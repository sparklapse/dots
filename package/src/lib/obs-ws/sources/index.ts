import type { DotsSource } from "$lib/overlay";
import type { Source } from "$lib/overlay/scene/types";

export type ObsSource = DotsSource & {
  toObs: (source: Source) => Promise<void>;
  showPreview?: (source: Source) => Promise<void>;
};

export const load = async () => {
  const displayCapture = import("./display-capture");
  const browser = import("./browser");

  await Promise.allSettled([displayCapture, browser]);
};

export const tags = ["obs-display-capture", "obs-browser"];
