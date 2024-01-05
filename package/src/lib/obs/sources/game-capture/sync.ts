import { options, toObs } from "./GameCapture.svelte";

export const gameCaptureSync = {
  [options.inputKind.value]: toObs,
};
