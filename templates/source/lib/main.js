import Source from "./Source.svelte";
import { sourceLabel } from "../src/config";

const DotsSource = class extends Source.element {
  get transform() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
};

customElements.define("source-" + sourceLabel, DotsSource);
