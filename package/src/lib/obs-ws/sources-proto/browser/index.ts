import { getDotsScene, getInput, getObs } from "$lib/obs-ws";
import { createSource } from "$lib/overlay";
import Browser, { label, transform, options } from "./Browser.svelte";
import type { Source } from "$lib/overlay";

type BrowserSource = Source<{
  inputKind: string;
  url: string;
  customCss: string;
  enabled: boolean;
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
}>;
export const browser = class extends createSource(Browser, {
  transform,
  options,
}) {
  static async toObs(source: BrowserSource) {
    const obs = await getObs();
    const scene = await getDotsScene();
    const obsInput = await getInput(source);

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
  }

  async showPreview(source: Source<{ enabled: boolean; inputKind: string }>) {
    const obs = await getObs();
    const input = await getInput(source);

    if (!input) return;

    try {
      const { imageData } = await obs.call("GetSourceScreenshot", {
        imageFormat: "png",
        sourceName: input.label,
      });

      this.setAttribute("preview", imageData);
      this.preview = imageData;
    } catch (e) {
      this.setAttribute("preview", "error");
      this.preview = "error";
    }
  }
};

customElements.define("obs-" + label, browser);
