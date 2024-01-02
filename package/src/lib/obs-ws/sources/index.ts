import { displayCaptureLabel, displayCaptureSource } from "./display-capture";

export const load = () => {
  if (!customElements.get("obs-" + displayCaptureLabel))
    customElements.define("obs-" + displayCaptureLabel, displayCaptureSource);
};

export const tags = ["obs-" + displayCaptureLabel];
