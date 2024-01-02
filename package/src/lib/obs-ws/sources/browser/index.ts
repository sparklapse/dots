import { createSource } from "$lib/overlay";
import Browser, { label, transform, options } from "./Browser.svelte";
import { getInput, getInputPreview } from "$lib/obs-ws";
import type { Source } from "$lib/overlay";

const browserSource = class extends createSource(Browser, {
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
};

customElements.define("obs-" + label, browserSource);
