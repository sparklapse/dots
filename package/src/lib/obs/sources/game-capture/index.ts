import { getInput, getInputPreview, getObs } from "$lib/obs/obs";
import { createSource } from "$lib/overlay";
import GameCapture, { label, transform, options } from "./GameCapture.svelte";
import GameSelect from "./GameSelect.svelte";
import type { Source } from "$lib/overlay";

const gameCaptureSource = class extends createSource(GameCapture, {
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
  async selectGame(source: Source<{ enabled: boolean; inputKind: string }>) {
    const obs = await getObs();
    const input = (await getInput(source)).cata({
      Ok: (input) => input,
      Err: () => {
        throw new Error("Input not found");
      },
    });

    const games = (
      await obs.call("GetInputPropertiesListPropertyItems", {
        inputName: input.label,
        propertyName: "window",
      })
    ).propertyItems.map(({ itemEnabled, itemName, itemValue }) => ({
      enabled: itemEnabled as boolean,
      label: itemName as string,
      value: itemValue as string,
    }));

    games.unshift({
      enabled: false,
      label: "DUMMY",
      value: "DUMMY",
    });

    const selector = new GameSelect({
      target: document.body,
      props: {
        items: games,
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

customElements.define("obs-" + label, gameCaptureSource);
