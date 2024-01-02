import { getDotsScene, getInput, getObs } from "$lib/obs-ws";
import { createSource } from "$lib/overlay";
import type { InferFieldValues } from "$lib/overlay/field";
import type { Source } from "$lib/overlay/scene/types";
import DisplayCapture, { label, transform, options } from "./DisplayCapture.svelte";
import MonitorSelect from "./MonitorSelect.svelte";

type DisplayCaptureSource = Source<InferFieldValues<typeof options>>;

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

  async selectMonitor(source: Source<{ enabled: boolean; inputKind: string }>) {
    const obs = await getObs();
    const input = await getInput(source);

    const monitors = (
      await obs.call("GetInputPropertiesListPropertyItems", {
        inputName: input.label,
        propertyName: "monitor_id",
      })
    ).propertyItems.map(({ itemEnabled, itemName, itemValue }) => ({
      enabled: itemEnabled as boolean,
      label: itemName as string,
      value: itemValue as string,
    }));

    monitors.unshift({
      enabled: false,
      label: "DUMMY",
      value: "DUMMY",
    });

    const selector = new MonitorSelect({
      target: document.body,
      props: {
        items: monitors,
      },
    });

    selector.$on("close", async (ev) => {
      const monitorId = ev.detail;

      await obs.call("SetInputSettings", {
        inputName: input.label,
        inputSettings: {
          monitor_id: monitorId,
        },
      });

      await this.showPreview(source);
      selector.$destroy();
    });
  }
};

customElements.define("obs-" + label, displayCapture);
