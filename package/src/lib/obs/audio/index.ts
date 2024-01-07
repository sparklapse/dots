// TODO: Audio utilities, monitoring, etc.

import { writable, type Readable } from "svelte/store";
import { getObs } from "..";
import { browser } from "$app/environment";

export type AudioMeter = {
  peak: {
    left: number;
    right: number;
  };
  volume: {
    muted: boolean;
    gain: number;
    multiplier: number;
  };
};
export type AudioMeters = { [key: string]: AudioMeter };

declare global {
  interface Window {
    __dots_obs_audio: Readable<AudioMeters> | undefined;
  }
}

const setupAudio = async () => {
  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });
  const meters = writable<AudioMeters>({});

  window.__dots_obs_audio = {
    subscribe: meters.subscribe,
  } as Readable<AudioMeters>;

  const getAllInputs = async () => {
    const initialInputs = (await obs.call("GetInputList")).inputs.filter(
      ({ inputKind }) =>
        inputKind === "wasapi_output_capture" ||
        inputKind === "wasapi_input_capture" ||
        inputKind === "wasapi_process_output_capture",
    );

    for (const input of initialInputs) {
      const { inputName } = input as { inputName: string };
      const { inputVolumeDb, inputVolumeMul } = await obs.call("GetInputVolume", { inputName });
      const { inputMuted } = await obs.call("GetInputMute", { inputName });

      meters.update((meters) => {
        return {
          ...meters,
          [inputName]: {
            peak: {
              left: 0,
              right: 0,
            },
            volume: {
              muted: inputMuted,
              gain: parseFloat(inputVolumeDb.toFixed(2)),
              multiplier: inputVolumeMul,
            },
          },
        };
      });
    }
  };
  await getAllInputs();

  obs.on("Identified", getAllInputs);

  obs.on("InputVolumeMeters", ({ inputs }) => {
    for (const { inputLevelsMul, inputName } of inputs) {
      const [left, right] = inputLevelsMul as [number[], number[]];
      meters.update((meters) => {
        const meter = meters[inputName as string];
        if (!meter) return meters;

        return {
          ...meters,
          [inputName as string]: {
            ...meter,
            // y = log75(x * 120 + 1)
            peak: {
              left: Math.min(Math.log(left[1] * 120 + 1) / Math.log(75), 1),
              right: Math.min(Math.log(right[1] * 120 + 1) / Math.log(75), 1),
            },
          },
        };
      });
    }
  });

  obs.on("InputVolumeChanged", ({ inputName, inputVolumeDb, inputVolumeMul }) => {
    meters.update((meters) => {
      const meter = meters[inputName as string];
      if (!meter) return meters;

      return {
        ...meters,
        [inputName]: {
          ...meter,
          volume: {
            ...meter.volume,
            gain: parseFloat(inputVolumeDb.toFixed(2)),
            multiplier: inputVolumeMul,
          },
        },
      };
    });
  });

  obs.on("InputMuteStateChanged", ({ inputName, inputMuted }) => {
    meters.update((meters) => {
      const meter = meters[inputName as string];
      if (!meter) return meters;

      return {
        ...meters,
        [inputName]: {
          ...meter,
          volume: {
            ...meter.volume,
            muted: inputMuted,
          },
        },
      };
    });
  });

  obs.on("ConnectionClosed", () => {
    meters.set({});
  });
};

export const getAudioMeters = async () => {
  if (!browser) return;
  if (!window.__dots_obs_audio) await setupAudio();

  return window.__dots_obs_audio;
};

export const setChannelGainDb = async (channel: string, gain: number) => {
  if (gain < -100) throw new Error("Gain must be greater than -100dB");
  if (gain > 26) throw new Error("Gain must be less than 26dB");

  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });
  await obs.call("SetInputVolume", {
    inputName: channel,
    inputVolumeDb: gain,
  });
};

export const setChannelGainMul = async (channel: string, gain: number) => {
  if (gain < 0) throw new Error("Gain must be greater than 0");
  if (gain > 1) throw new Error("Gain must be less than 1");

  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });
  await obs.call("SetInputVolume", {
    inputName: channel,
    inputVolumeMul: gain,
  });
};

export const setChannelMuted = async (channel: string, muted: boolean) => {
  const obs = (await getObs()).cata({
    Ok: (obs) => obs,
    Err: () => {
      throw new Error("Failed to get obs");
    },
  });
  await obs.call("SetInputMute", {
    inputName: channel,
    inputMuted: muted,
  });
};
