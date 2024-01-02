import { getInput, getObs } from "$lib/obs-ws";
import { createSource } from "$lib/overlay";
import DisplayCapture, { label, transform, options, toObs } from "./DisplayCapture.svelte";
import MonitorSelect from "$lib/obs-ws/sources-proto/display-capture/MonitorSelect.svelte";
import type { Source } from "$lib/overlay";

export const displayCaptureLabel = label;
export const displayCaptureSource = class extends createSource(DisplayCapture, {
  transform,
  options,
}) {
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
export const displayCaptureSync = {
  [options.inputKind.value]: toObs,
};
