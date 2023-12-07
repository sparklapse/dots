import Source from "./Source.svelte";
import type { WebComponent } from "../types";

type SourceProps = {
  x: number;
  y: number;
  width: number;
  height: number;
};
export const DotsSource = class extends (Source as WebComponent<typeof Source, SourceProps>)
  .element {
  screen?: HTMLElement;

  constructor() {
    super();
  }

  get transform() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
};
