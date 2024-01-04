import { getInput, getInputPreview, getObs } from "$lib/obs-ws";
import { createSource } from "$lib/overlay";
import WindowCapture, { label, transform, options } from "./WindowCapture.svelte";
import WindowSelect from "./WindowSelect.svelte";
import type { Source } from "$lib/overlay";

const windowCaptureSource = class extends createSource(WindowCapture, {
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
  async selectWindow(source: Source<{ enabled: boolean; inputKind: string }>) {
    const obs = await getObs();
    const input = (await getInput(source)).cata({
      Ok: (input) => input,
      Err: () => {
        throw new Error("Input not found");
      },
    });

    const windows = (
      await obs.call("GetInputPropertiesListPropertyItems", {
        inputName: input.label,
        propertyName: "window",
      })
    ).propertyItems.map(({ itemEnabled, itemName, itemValue }) => ({
      enabled: itemEnabled as boolean,
      label: itemName as string,
      value: itemValue as string,
    }));

    windows.unshift({
      enabled: false,
      label: "DUMMY",
      value: "DUMMY",
    });

    const selector = new WindowSelect({
      target: document.body,
      props: {
        items: windows,
      },
    });

    selector.$on("close", async (ev) => {
      const windowId = ev.detail;

      await obs.call("SetInputSettings", {
        inputName: input.label,
        inputSettings: {
          window: windowId,
        },
      });

      await this.showPreview(source);
      selector.$destroy();
    });
  }
};

customElements.define("obs-" + label, windowCaptureSource);
