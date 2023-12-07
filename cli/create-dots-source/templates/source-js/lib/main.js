import Source from "./Source.svelte";
import { label, options, transform } from "../src/config";

const DotsSource = class extends Source.element {
  static get defaultProps() {
    return {
      transform,
      options,
    };
  }

  get options() {
    const opts = {};
    for (const key in options) {
      opts[key] = this[key];
    }
    return opts;
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

customElements.define("source-" + label, DotsSource);
