import { options, toObs } from "./WindowCapture.svelte";

export const windowCaptureSync = {
  [options.inputKind.value]: toObs,
};
