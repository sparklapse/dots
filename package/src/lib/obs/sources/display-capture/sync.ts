import { getObs, getDotsScene, getInput } from "$lib/obs/obs";
import { options } from "./DisplayCapture.svelte";
import type { Source, InferFieldValues } from "$lib/overlay";

export const displayCaptureSync = {
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
  },
};
