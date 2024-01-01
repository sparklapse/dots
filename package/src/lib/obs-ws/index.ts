import { get, writable } from "svelte/store";
import OBSWebSocket, { EventSubscription } from "obs-websocket-js/msgpack";
import type { Readable } from "svelte/store";
import type { Source, Sources } from "$lib/overlay";

declare global {
  interface Window {
    __dots_obs: OBSWebSocket | undefined;
    __dots_obs_scene: string | undefined;
  }
}

const EVENTS = EventSubscription.InputVolumeMeters;

const identified = writable(false);
export const isIdentified = { subscribe: identified.subscribe } as Readable<boolean>;

export const connect = async (
  port: number = 4455,
  password?: string,
  scene: string = "overlay",
) => {
  const obs = window.__dots_obs ?? new OBSWebSocket();

  if (obs.identified) {
    console.warn("OBS is already connected");
    return obs;
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

  await obs.connect(`ws://localhost:${port}`, password, {
    eventSubscriptions: EVENTS,
  });

  const { scenes } = await obs.call("GetSceneList");
  const sceneExists = scenes.some((s) => (s.sceneName as string) == "dots#" + scene);

  if (!sceneExists) {
    await obs.call("CreateScene", { sceneName: "dots#" + scene });
  }

  window.__dots_obs = obs;
  window.__dots_obs_scene = "dots#" + scene;
  return obs;
};

export const disconnect = async () => {
  const obs = window.__dots_obs;

  if (!obs) {
    console.warn("OBS is not connected");
    return;
  }

  await obs.disconnect();
};

export const getObs = () =>
  new Promise<OBSWebSocket>((resolve, reject) => {
    if (window.__dots_obs) {
      resolve(window.__dots_obs);
      return;
    }

    connect();

    const interval = setInterval(() => {
      const obs = window.__dots_obs;

      if (obs) {
        clearInterval(interval);
        resolve(obs);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      reject("OBS is not connected");
    }, 10000);
  });

export const getDotsScene = () =>
  new Promise<string>((resolve, reject) => {
    if (window.__dots_obs_scene) {
      resolve(window.__dots_obs_scene);
      return;
    }

    connect();

    const interval = setInterval(() => {
      const scene = window.__dots_obs_scene;

      if (scene) {
        clearInterval(interval);
        resolve(scene);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      reject("OBS is not connected");
    }, 10000);
  });

export const cleanRemoteSources = async (sources: Sources) => {
  const obs = await getObs();
  const scene = await getDotsScene();
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
};

export const getInput = async (source: Source<{ enabled: boolean; inputKind: string }>) => {
  const obs = await getObs();
  const scene = await getDotsScene();

  if (!get(isIdentified)) await connect();

  let { sceneItems } = await obs.call("GetSceneItemList", {
    sceneName: scene,
  });

  const exists = sceneItems.some((item) => (item.sourceName as string).endsWith(source.id));

  if (!exists) {
    await obs.call("CreateInput", {
      inputKind: source.options.inputKind,
      sceneName: scene,
      inputName: `${source.label}#${source.id}`,
      sceneItemEnabled: false,
    });

    sceneItems = (
      await obs.call("GetSceneItemList", {
        sceneName: scene,
      })
    ).sceneItems;
  }

  const item = sceneItems.find((item) => (item.sourceName as string).endsWith(source.id))!;
  const transform = item.sceneItemTransform as Record<string, unknown>;

  return {
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
  };
};
