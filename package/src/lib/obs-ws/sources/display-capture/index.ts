import { getInput, getInputPreview, getObs } from "$lib/obs-ws";
import { createSource } from "$lib/overlay";
import DisplayCapture, { label, transform, options } from "./DisplayCapture.svelte";
import MonitorSelect from "./MonitorSelect.svelte";
import type { Source } from "$lib/overlay";

const displayCaptureSource = class extends createSource(DisplayCapture, {
  transform,
  options,
}) {
  async showPreview(source: Source<{ enabled: boolean; inputKind: string }>) {
    if (!source.options.enabled) return;
    const input = await getInput(source);
    const preview = await getInputPreview(input);

    this.setAttribute("preview", preview);
    this.preview = preview;
  }
  async selectMonitor(source: Source<{ enabled: boolean; inputKind: string }>) {
    const obs = await getObs();
    const input = (await getInput(source)).cata({
      Ok: (input) => input,
      Err: () => {
        throw new Error("Input not found");
      },
    });

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

      setTimeout(() => {
        this.showPreview(source);
      }, 500);
      selector.$destroy();
    });
  }
};

customElements.define("obs-" + label, displayCaptureSource);
