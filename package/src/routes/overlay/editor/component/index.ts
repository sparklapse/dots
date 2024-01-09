import TextSource, {
  label as tsLabel,
  transform as tsTransform,
  options as tsOptions,
} from "./TextSource.svelte";
import ImageSource, {
  label as isLabel,
  transform as isTransform,
  options as isOptions,
} from "./ImageSource.svelte";
import { createSource } from "$lib/overlay";

export const textSource = createSource(TextSource, {
  transform: tsTransform,
  options: tsOptions,
});
export const imageSource = createSource(ImageSource, {
  transform: isTransform,
  options: isOptions,
});

customElements.define("source-" + tsLabel, textSource);
customElements.define("source-" + isLabel, imageSource);
