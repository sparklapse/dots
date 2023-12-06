import { onDestroy, onMount, setContext } from "svelte";
import { writable, type Readable, get } from "svelte/store";
import OBSWebSocket, { EventSubscription } from "obs-websocket-js";
import { COMPONENTS, type Source } from "..";
import type { ObsContext } from "../contexts/obs";
import { browser } from "$app/environment";

type ObsSceneItem = {
  inputKind: string;
  isGroup: unknown;
  sceneItemBlendMode: string;
  sceneItemEnabled: boolean;
  sceneItemId: number;
  sceneItemIndex: number;
  sceneItemLocked: boolean;
  sceneItemTransform: Record<string, number>;
  sourceName: string;
  sourceType: string;
};

type SceneBundle =
  | {
      id: string;
      scene: Source[];
      type: "dots";
    }
  | {
      id: string;
      scene: Source<"obsSource">;
      type: "obs";
    };

// NOTE: OBS has a persistent data source (key/value) which could be used to store the scene

export const connectObs = () => {
  // OBS Websocket Client
  const obs = new OBSWebSocket();

  // Context
  const connected = writable(obs.identified);
  const inputKindList = writable<string[]>([]);

  setContext<ObsContext>("obs", {
    connected: {
      subscribe: connected.subscribe,
    } as Readable<boolean>,
    inputKindList: {
      subscribe: inputKindList.subscribe,
    } as Readable<string[]>,
  });

  // Connection
  let reconnectTimeout: NodeJS.Timeout | number | undefined = undefined;
  const connect = async () => {
    if (!browser) return;

    try {
      await obs.connect("ws://localhost:4455", undefined, {
        eventSubscriptions: EventSubscription.All,
      });
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      reconnectTimeout = undefined;
    } catch {
      console.warn("OBS failed to connect, trying again in 1s");
      reconnectTimeout = setTimeout(connect, 1000);
    }

    inputKindList.set((await obs.call("GetInputKindList")).inputKinds);
  };

  const reconnectListener = connected.subscribe((v) => {
    if (!browser) return;
    if (v) return;
    if (reconnectTimeout) return;
    console.warn("OBS disconnected, reconnecting in 5s");
    reconnectTimeout = setTimeout(connect, 5000);
  });

  onMount(async () => {
    await connect();
  });

  onDestroy(async () => {
    if (reconnectTimeout) clearTimeout(reconnectTimeout);
    reconnectListener();
    await obs.disconnect();
  });

  if (browser) {
    obs.on("Identified", async () => {
      await new Promise((r) => setTimeout(r, 1000));
      connected.set(true);
    });
    obs.on("ConnectionClosed", () => {
      connected.set(false);
    });
    obs.on("ConnectionError", () => {
      connected.set(false);
    });
  }

  // Scene Processing and Syncing
  const bundleDotsScene = (scene: Source[]) => {
    const bundled: SceneBundle[] = [];
    for (const source of scene) {
      const sourceType = source.type.startsWith("obs") ? "obs" : "dots";
      if (bundled.length === 0) {
        if (sourceType === "dots") {
          bundled.push({ id: `dotsb-${bundled.length}`, scene: [source], type: sourceType });
          continue;
        }
        bundled.push({
          id: (source as Source<"obsSource">).options.sourceId,
          scene: source as Source<"obsSource">,
          type: sourceType as "obs",
        });
        continue;
      }

      const lastBundle = bundled.at(-1)!;

      if (sourceType === "dots" && lastBundle.type === "dots") {
        lastBundle.scene.push(source);
        continue;
      }
      if (sourceType === "dots" && lastBundle.type === "obs") {
        bundled.push({ id: `dotsb-${bundled.length}`, scene: [source], type: sourceType });
        continue;
      }
      bundled.push({
        id: (source as Source<"obsSource">).options.sourceId,
        scene: source as Source<"obsSource">,
        type: sourceType as "obs",
      });
    }
    return bundled;
  };

  // const unbundleObsScene = (bundle: SceneBundle[]) => {
  //   const scene: Source[] = [];
  //   for (const source of bundle) {
  //     if (source.type === "dots") {
  //       scene.push(...source.scene);
  //       continue;
  //     }
  //     scene.push(source.scene);
  //   }
  //   return scene;
  // }

  const backSyncInterval = 100;
  let lastSync = 0;
  const syncScene = async (scene: Source[], name: string) => {
    if (!obs.identified) return;

    const sceneBundles = bundleDotsScene(scene);
    const sceneBundleIds = sceneBundles.map((s) => s.id);

    const sceneList = await obs.call("GetSceneList");
    if (!sceneList.scenes.map((s) => s.sceneName).includes(name)) {
      await obs.call("CreateScene", { sceneName: name });
    }

    const sourceList = await obs.call("GetSceneItemList", {
      sceneName: name,
    });

    // Add scene bundles to obs
    for (const bundle of sceneBundles) {
      switch (bundle.type) {
        case "dots": {
          if (!sourceList.sceneItems.map((s) => s.sourceName).includes(bundle.id)) {
            try {
              await obs.call("CreateInput", {
                inputKind: "browser_source",
                inputName: bundle.id,
                sceneName: name,
                inputSettings: {
                  width: 1920,
                  height: 1080,
                },
              });
            } catch (e) {
              const err = e as Error;
              if (err.message.startsWith("A source already exists by that input name.")) continue;
              console.error(err);
            }
          }

          const itemId = await obs.call("GetSceneItemId", {
            sceneName: name,
            sourceName: bundle.id,
          });

          await obs.call("SetSceneItemLocked", {
            sceneName: name,
            sceneItemId: itemId.sceneItemId,
            sceneItemLocked: true,
          });

          await obs.call("SetInputSettings", {
            inputName: bundle.id,
            inputSettings: {
              url: `http://localhost:5173/proto/view?s=${bundle.id}`,
            },
          });

          await obs.call("CallVendorRequest", {
            vendorName: "obs-browser",
            requestType: "emit_event",
            requestData: {
              event_name: `dots-scene-${bundle.id}`,
              event_data: {
                scene: bundle.scene,
              },
            },
          });

          break;
        }
        case "obs": {
          if (!sourceList.sceneItems.map((s) => s.sourceName).includes(bundle.id)) {
            await obs.call("CreateInput", {
              inputKind: bundle.scene.options.sourceKind,
              inputName: bundle.id,
              sceneName: name,
              // inputSettings: {
              //   width: bundle.scene.options.width,
              //   height: bundle.scene.options.height,
              // },
            });
          }

          const itemId = await obs.call("GetSceneItemId", {
            sceneName: name,
            sourceName: bundle.id,
          });

          // const transform = await obs.call("GetSceneItemTransform", {
          //   sceneName: name,
          //   sceneItemId: itemId.sceneItemId,
          // });

          // const properties = await obs.call("GetInputSettings", {
          //   inputName: bundle.id,
          // });

          await obs.call("SetSceneItemTransform", {
            sceneName: name,
            sceneItemId: itemId.sceneItemId,
            sceneItemTransform: {
              positionX: bundle.scene.options.x,
              positionY: bundle.scene.options.y,
              // scaleX: 1,
              // scaleY: 1,
            },
          });
          break;
        }
      }
    }

    // Sort sources in obs to match dots bundled scene
    for (let i = 0; i < sceneBundleIds.length; i++) {
      const bundle = sceneBundles[i];
      const itemId = await obs.call("GetSceneItemId", {
        sceneName: name,
        sourceName: bundle.id,
      });
      await obs.call("SetSceneItemIndex", {
        sceneName: name,
        sceneItemId: itemId.sceneItemId,
        sceneItemIndex: i,
      });
    }

    // Cull sources that are not in the scene
    for (const source of sourceList.sceneItems) {
      if (!sceneBundleIds.includes(source.sourceName as string)) {
        try {
          await obs.call("RemoveSceneItem", {
            sceneName: name,
            sceneItemId: source.sceneItemId as number,
          });
        } catch (e) {
          const err = e as Error;
          if (err.message.startsWith("No scene items were found in scene")) continue;
          console.error(err);
        }
      }
    }

    lastSync = Date.now();
  };

  const syncBack = async (scene: Source[], name: string) => {
    if (!obs.identified) return;

    const sceneBundles = bundleDotsScene(scene);
    const sceneBundleIds = sceneBundles.map((s) => s.id);

    const sceneList = await obs.call("GetSceneList");
    if (!sceneList.scenes.map((s) => s.sceneName).includes(name)) {
      await obs.call("CreateScene", { sceneName: name });
    }

    const sourceList = await obs.call("GetSceneItemList", {
      sceneName: name,
    });

    const backfill: Source[] = [];
    for (const source of sourceList.sceneItems) {
      if ((source.sourceName as string).startsWith("dotsb")) continue;
      if (!sceneBundleIds.includes(source.sourceName as string)) {
        const { positionX, positionY, width, height } = source.sceneItemTransform as Record<
          string,
          number
        >;
        if (source.sourceType !== "OBS_SOURCE_TYPE_INPUT") continue;
        backfill.push({
          type: "obsSource",
          options: COMPONENTS["obsSource"].controls.parse({
            x: positionX,
            y: positionY,
            width,
            height,
            sourceKind: source.inputKind,
            sourceId: source.sourceName,
          }),
          label: source.sourceName as string,
        });
      }
    }

    return backfill;
  };

  const createSyncedScene = (name: string, inital: Source[] = []) => {
    const scene = writable<Source[]>(structuredClone(inital));
    if (!browser) return { scene };

    const backSync = setInterval(async () => {
      if (Date.now() - lastSync < backSyncInterval) return;
      if (!get(connected)) return;

      const sceneSourceList = await obs.call("GetSceneItemList", {
        sceneName: name,
      });

      for (const source of sceneSourceList.sceneItems) {
        const sourceName = source.sourceName as string;
        if (sourceName.startsWith("dotsb")) continue;

        const dotsSource = get(scene)
          .filter(
            (s) =>
              s.type === "obsSource" &&
              (s as Source<"obsSource">).options.sourceId === source.sourceName,
          )
          .at(0);

        if (!dotsSource) continue; // Should never happen

        const { positionX, positionY, width, height } = source.sceneItemTransform as Record<
          string,
          number
        >;

        const i = get(scene).indexOf(dotsSource);
        if (i === -1) {
          console.warn("Scene item doesnt exist");
          continue;
        }
        if (
          dotsSource.options.x === positionX &&
          dotsSource.options.y === positionY &&
          width == dotsSource.options.width &&
          height == dotsSource.options.height
        )
          continue;

        scene.update((scene) => {
          scene[i].options.x = positionX;
          scene[i].options.y = positionY;
          scene[i].options.width = width;
          scene[i].options.height = height;

          return [...scene];
        });
      }
    }, backSyncInterval);

    const connectedSync = connected.subscribe(async (connected) => {
      if (!connected) return;

      // Initial back sync
      const sceneBundles = bundleDotsScene(get(scene));
      const sceneBundleIds = sceneBundles.map((s) => s.id);

      const sceneList = await obs.call("GetSceneList");
      if (!sceneList.scenes.map((s) => s.sceneName).includes(name)) {
        await obs.call("CreateScene", { sceneName: name });
      }

      const sourceList = await obs.call("GetSceneItemList", {
        sceneName: name,
      });

      const backfill: Source[] = [];
      for (const source of sourceList.sceneItems) {
        if ((source.sourceName as string).startsWith("dotsb")) continue;
        if (!sceneBundleIds.includes(source.sourceName as string)) {
          const { positionX, positionY, width, height } = source.sceneItemTransform as Record<
            string,
            number
          >;
          if (source.sourceType !== "OBS_SOURCE_TYPE_INPUT") continue;
          backfill.push({
            type: "obsSource",
            options: COMPONENTS["obsSource"].controls.parse({
              x: positionX,
              y: positionY,
              width,
              height,
              sourceKind: source.inputKind,
              sourceId: source.sourceName,
            }),
            label: source.sourceName as string,
          });
        }
      }

      scene.update((scene) => {
        return [...scene, ...backfill];
      });
    });

    const sceneSync = scene.subscribe(async (sceneChange) => {
      if (!get(connected)) return;
      // debugger;
      await syncScene(sceneChange, name);
    });

    obs.on("SceneItemCreated", async ({ sceneName, sceneItemId, sourceName }) => {
      if (sceneName !== name) return;
      if (sourceName.startsWith("dotsb")) return;
      if (
        get(scene)
          .map((s) => (s.type === "obsSource" ? (s as Source<"obsSource">).options.sourceId : ""))
          .includes(sourceName)
      )
        return;

      await new Promise((r) => setTimeout(r, 100));
      const obsSource = (await obs.call("GetSceneItemList", { sceneName: name })).sceneItems
        .filter((s) => s.sceneItemId === sceneItemId)
        .at(0) as ObsSceneItem;
      scene.update((scene) => {
        return [
          ...scene,
          {
            type: "obsSource",
            options: COMPONENTS["obsSource"].controls.parse({
              width: obsSource.sceneItemTransform.width,
              height: obsSource.sceneItemTransform.height,
              sourceKind: obsSource.inputKind,
              sourceId: obsSource.sourceName,
            }),
            label: obsSource.sourceName as string,
          },
        ];
      });
    });

    // obs.on("SceneItemListReindexed", ({ sceneName, sceneItems }) => {
    // });

    obs.on("SceneItemRemoved", ({ sceneName, sourceName }) => {
      if (sceneName !== name) return;
      scene.update((scene) => {
        return [
          ...scene.filter((s) => {
            if (s.type !== "obsSource") return true;
            if ((s as Source<"obsSource">).options.sourceId !== sourceName) return true;
            return false;
          }),
        ];
      });
    });

    onDestroy(() => {
      clearInterval(backSync);
      connectedSync();
      sceneSync();
    });

    return {
      scene,
    };
  };

  return {
    createSyncedScene,
    syncScene,
    syncBack,
    connected: {
      subscribe: connected.subscribe,
    } as Readable<boolean>,
  };
};
