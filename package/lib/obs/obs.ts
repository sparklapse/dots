import type { Readable } from "svelte/store";

export type ObsContext = {
  connected: Readable<boolean>;
  inputKindList: Readable<string[]>;
};
