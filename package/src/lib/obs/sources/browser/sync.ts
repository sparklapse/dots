import { getObs, getDotsScene, getInput } from "$lib/obs/obs";
import { options } from "./Browser.svelte";
import type { Source, InferFieldValues } from "$lib/overlay";

export const browserSync = {
  [options.inputKind.value]: async (source: Source<InferFieldValues<typeof options>>) => {
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
    const obsInput = (await getInput(source)).cata({
      Ok: (input) => input,
      Err: (err) => {
        console.error(err);
        return null;
      },
    });

    if (!obsInput) return;

    const transform = {
      positionX: source.transform.x,
      positionY: source.transform.y,
      boundsWidth: Math.max(source.transform.width, 1),
      boundsHeight: Math.max(source.transform.height, 1),
      cropLeft: source.options.cropLeft,
      cropRight: source.options.cropRight,
      cropTop: source.options.cropTop,
      cropBottom: source.options.cropBottom,
    };

    await obs.call("SetSceneItemTransform", {
      sceneName: scene,
      sceneItemId: obsInput!.itemId,
      sceneItemTransform: {
        boundsType: "OBS_BOUNDS_SCALE_INNER",
        ...transform,
      },
    });

    const settings = {
      width: Math.max(source.transform.width, 1),
      height: Math.max(source.transform.height, 1),
      url: source.options.url,
      css: source.options.customCss,
    };

    await obs.call("SetInputSettings", {
      inputName: obsInput.label,
      inputSettings: settings,
    });

    await obs.call("SetSceneItemEnabled", {
      sceneItemEnabled: source.options.enabled,
      sceneName: scene,
      sceneItemId: obsInput.itemId,
    });

    if (obsInput.label !== `${source.label}#${source.id}`)
      await obs.call("SetInputName", {
        inputName: obsInput.label,
        newInputName: `${source.label}#${source.id}`,
      });

    await obs.call("PressInputPropertiesButton", {
      inputName: obsInput.label,
      propertyName: "refreshnocache",
    });
  },
};
