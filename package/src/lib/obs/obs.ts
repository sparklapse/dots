import OBSWebSocket, { EventSubscription } from "obs-websocket-js/msgpack";
import { Err, Ok, encaseRes } from "pratica";
import { get, writable } from "svelte/store";
import { syncs } from "./sources/syncs";
import type { Result } from "pratica";
import type { Readable } from "svelte/store";
import type { Source, Sources } from "$lib/overlay";

declare global {
  interface Window {
    __dots_obs: OBSWebSocket | undefined;
    __dots_obs_scene: string | undefined;
  }
}

const EVENTS = EventSubscription.InputVolumeMeters | EventSubscription.All;

const identified = writable(false);
export const isIdentified = { subscribe: identified.subscribe } as Readable<boolean>;

export const connect = async (
  port: number = 4455,
  password?: string,
  scene: string = window.__dots_obs_scene?.slice(5) ?? "overlay",
) => {
  const obs = window.__dots_obs ?? new OBSWebSocket();

  if (obs.identified) {
    console.warn("OBS is already connected");
    return Ok(obs);
  }

  obs.on("Identified", () => {
    identified.set(true);
  });

  obs.on("ConnectionClosed", () => {
    identified.set(false);
  });

  obs.on("ConnectionError", () => {
    identified.set(false);
  });

  try {
    await obs.connect(`ws://localhost:${port}`, password, {
      eventSubscriptions: EVENTS,
    });
  } catch {
    identified.set(false);
    return Err("Could not connect to OBS");
  }

  const { scenes } = await obs.call("GetSceneList");
  const sceneExists = scenes.some((s) => (s.sceneName as string) == "dots#" + scene);

  if (!sceneExists) {
    await obs.call("CreateScene", { sceneName: "dots#" + scene });
  }

  window.__dots_obs = obs;
  window.__dots_obs_scene = "dots#" + scene;

  return Ok(obs);
};

export const disconnect = async () => {
  const obs = window.__dots_obs;

  if (!obs) {
    console.warn("OBS is not connected");
    return;
  }

  await obs.disconnect();
};

export const getObs: () => Promise<Result<OBSWebSocket, unknown>> = async () => {
  if (!get(isIdentified)) await connect();

  return encaseRes(() => {
    if (window.__dots_obs) return window.__dots_obs;
    throw new Error("OBS is not connected");
  });
};

export const getDotsScene = async (): Promise<Result<string, string>> => {
  const label = window.__dots_obs_scene?.slice(5) ?? "overlay";

  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });

  if (!get(isIdentified)) return Err("OBS is not connected");

  const { scenes } = await obs.call("GetSceneList");
  const sceneExists = scenes.some((s) => (s.sceneName as string) == "dots#" + label);

  if (!sceneExists) {
    await obs.call("CreateScene", { sceneName: "dots#" + label });
  }

  return Ok("dots#" + label);
};

export const setDotsScene = async (label: string) => {
  window.__dots_obs_scene = "dots#" + label;
};

export const cleanRemoteSources = async (sources: Sources): Promise<Result<void, string>> => {
  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });
  const scene = (await getDotsScene()).cata({
    Ok: (scene) => scene,
    Err: (err) => {
      throw new Error(err);
    },
  });

  if (!get(isIdentified)) return Err("OBS is not connected");

  const { sceneItems } = await obs.call("GetSceneItemList", {
    sceneName: scene,
  });

  const realObsSources = sources
    .filter(({ tag }) => tag.startsWith("obs"))
    .map(({ id, label }) => `${label}#${id}`);
  const orphanedObsInputs = sceneItems.filter(
    ({ sourceName }) => !realObsSources.includes(sourceName as string),
  );

  await obs.callBatch(
    orphanedObsInputs.map(({ sourceName }) => ({
      requestType: "RemoveInput",
      requestData: {
        inputName: sourceName as string,
      },
    })),
  );

  return Ok();
};

export type Input = {
  itemId: number;
  index: number;
  label: string;
  enabled: boolean;
  locked: boolean;
  transform: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const getInput = async (
  source: Source<{ enabled: boolean; inputKind: string }>,
): Promise<Result<Input, string>> => {
  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });
  const scene = (await getDotsScene()).cata({
    Ok: (scene) => scene,
    Err: (err) => {
      throw new Error(err);
    },
  });

  if (!get(isIdentified)) return Err("OBS is not connected");

  let { sceneItems } = await obs.call("GetSceneItemList", {
    sceneName: scene,
  });

  const exists = sceneItems.some((item) => (item.sourceName as string).endsWith(source.id));

  if (!exists) {
    try {
      // Try getting input if exists in other scene
      await obs.call("GetInputSettings", {
        inputName: `${source.label}#${source.id}`,
      });

      await obs.call("CreateSceneItem", {
        sceneName: scene,
        sourceName: `${source.label}#${source.id}`,
      });
    } catch {
      // Create new item if does not exist
      const { defaultInputSettings } = await obs.call("GetInputDefaultSettings", {
        inputKind: source.options.inputKind,
      });

      await obs.call("CreateInput", {
        inputKind: source.options.inputKind,
        sceneName: scene,
        inputName: `${source.label}#${source.id}`,
        sceneItemEnabled: false,
        inputSettings: defaultInputSettings,
      });
    }

    sceneItems = (
      await obs.call("GetSceneItemList", {
        sceneName: scene,
      })
    ).sceneItems;
  }

  const item = sceneItems.find((item) => (item.sourceName as string).endsWith(source.id))!;
  const transform = item.sceneItemTransform as Record<string, unknown>;

  return Ok({
    itemId: item.sceneItemId as number,
    index: item.sceneItemIndex as number,
    label: item.sourceName as string,
    enabled: item.sceneItemEnabled as boolean,
    locked: item.sceneItemLocked as boolean,
    transform: {
      x: transform.positionX as number,
      y: transform.positionY as number,
      width: transform.sourceWidth as number,
      height: transform.sourceHeight as number,
    },
  });
};

export const getInputPreview = async (input: Awaited<ReturnType<typeof getInput>>) => {
  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });

  if (input.isErr()) return "error";

  try {
    const { imageData } = await obs.call("GetSourceScreenshot", {
      imageFormat: "png",
      sourceName: (input.value() as Input).label,
    });

    return imageData;
  } catch (err) {
    return "error";
  }
};

export const syncObsSources = async (
  sources: Source<{ inputKind: string; enabled: boolean }>[],
) => {
  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });
  const scene = (await getDotsScene()).cata({
    Ok: (scene) => scene,
    Err: (err) => {
      throw new Error(err);
    },
  });
  for (let index = 0; index < sources.length; index++) {
    const source = sources[index];

    const sync = syncs[source.options.inputKind];

    // @ts-expect-error - This should always be fine but types just aren't working
    if (sync) await sync(source);

    const input = (await getInput(source)).cata({
      Ok: (input) => input,
      Err: () => {
        throw new Error("Could not get input");
      },
    });

    await obs.call("SetSceneItemIndex", {
      sceneName: scene,
      sceneItemId: input.itemId,
      sceneItemIndex: index,
    });
  }
};
