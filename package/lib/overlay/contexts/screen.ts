import type { Writable } from "svelte/store";

export type ScreenContext = {
  scale: Writable<number>;
};
