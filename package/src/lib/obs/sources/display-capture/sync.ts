import { options, toObs } from "./DisplayCapture.svelte";

export const displayCaptureSync = {
  [options.inputKind.value]: toObs,
};
