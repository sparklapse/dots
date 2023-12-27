import Source, { label, transform, options } from "./Source.svelte";
import { createSource } from "@sparklapse/dots/overlay";

const source = createSource(Source, { transform, options });

customElements.define("source-" + label, source);
