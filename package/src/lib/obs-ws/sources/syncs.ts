import { browserSync } from "./browser/sync";
import { displayCaptureSync } from "./display-capture/sync";
import { windowCaptureSync } from "./window-capture/sync";

export const syncs = {
  ...browserSync,
  ...displayCaptureSync,
  ...windowCaptureSync,
};
