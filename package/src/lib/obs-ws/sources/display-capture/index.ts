import { getDotsScene, getInput, getObs } from "$lib/obs-ws";
import { createSource } from "$lib/overlay";
import type { Source } from "$lib/overlay/scene/types";
import DisplayCapture, { label, transform, options } from "./DisplayCapture.svelte";

type DisplayCaptureOptions = {
  inputKind: string;
  enabled: boolean;
  captureCursor: boolean;
  forceSDR: boolean;
  method: 0 | 1 | 2;
  cropLeft: number;
  cropRight: number;
  cropTop: number;
  cropBottom: number;
};
type DisplayCaptureSource = Source<DisplayCaptureOptions>;
// type OBSDisplayCapture = {
//   item: {
//     inputKind: "monitor_capture";
//     isGroup: unknown;
//     sceneItemBlendMode: "OBS_BLEND_NORMAL" | unknown;
//     sceneItemEnabled: boolean;
//     sceneItemId: number;
//     sceneItemIndex: number;
//     sceneItemLocked: boolean;
//     sceneItemTransform: {
//       alignment: number;
//       boundsAlignment: number;
//       boundsHeight: number;
//       boundsType: "OBS_BOUNDS_NONE" | unknown;
//       boundsWidth: number;
//       cropBottom: number;
//       cropLeft: number;
//       cropRight: number;
//       cropTop: number;
//       height: number;
//       positionX: number;
//       positionY: number;
//       rotation: number;
//       scaleX: number;
//       scaleY: number;
//       sourceHeight: number;
//       sourceWidth: number;
//       width: number;
//     };
//     sourceName: string;
//     sourceType: "OBS_SOURCE_TYPE_INPUT" | unknown;
//   };
//   settings: {
//     method?: 0 | 1 | 2;
//     capture_cursor?: boolean;
//     force_sdr?: boolean;
//     monitor_id: string;
//   };
// };

const displayCapture = class extends createSource(DisplayCapture, {
  transform,
  options,
}) {
  static async toObs(source: DisplayCaptureSource) {
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
        boundsType: "OBS_BOUNDS_MAX_ONLY",
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
  }

  #interval: number | NodeJS.Timer | undefined;
  async connectedCallback() {
    await super.connectedCallback();

    // const refresh = () => {
    //   if (get(isIdentified)) this.showPreview();
    //   this.#interval = setTimeout(refresh, 1000);
    // };
    // refresh();
  }

  async disconnectedCallback() {
    // clearTimeout(this.#interval as number);
    // this.#interval = undefined;
    await super.disconnectedCallback();
  }

  async showPreview(source: Source<{ enabled: boolean; inputKind: string }>) {
    if (!source.options.enabled) return;

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

customElements.define("obs-" + label, displayCapture);
