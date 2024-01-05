import { options, toObs } from "./Browser.svelte";

export const browserSync = {
  [options.inputKind.value]: toObs,
};
