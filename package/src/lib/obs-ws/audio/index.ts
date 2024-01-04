// TODO: Audio utilities, monitoring, etc.

import { writable, type Readable } from "svelte/store";
import { getObs } from "..";
import { browser } from "$app/environment";

export type AudioMeter = {
  label: string;
  peak: {
    left: number;
    right: number;
  };
};

declare global {
  interface Window {
    __dots_obs_audio: Readable<AudioMeter[]> | undefined;
  }
}

const setupMeter = async () => {
  const obs = await getObs();
  const meter = writable<AudioMeter[]>([]);

  window.__dots_obs_audio = {
    subscribe: meter.subscribe,
  } as Readable<AudioMeter[]>;

  obs.on("InputVolumeMeters", ({ inputs }) => {
    const meters = inputs.map(({ inputLevelsMul, inputName }) => {
      const [left, right] = inputLevelsMul as [number[], number[]];
      return {
        label: inputName as string,
        // y = log75(x * 120 + 1)
        peak: {
          left: Math.min(Math.log(left[1] * 120 + 1) / Math.log(75), 1),
          right: Math.min(Math.log(right[1] * 120 + 1) / Math.log(75), 1),
        },
      };
    });

    meter.set(meters);
  });

  obs.on("ConnectionClosed", () => {
    meter.set([]);
  });
};

export const getAudioMeters = async () => {
  if (!browser) return;
  if (!window.__dots_obs_audio) await setupMeter();

  return window.__dots_obs_audio;
};
