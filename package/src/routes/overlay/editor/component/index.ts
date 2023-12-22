import Source, { label, transform, options } from "./Source.svelte";
import { createSource } from "$lib/overlay/source/index.js";

export const source = createSource(Source, { transform, options });

customElements.define("source-" + label, source);
