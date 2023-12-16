import Source from "./Source.svelte";
import { label, options, transform } from "./config";
import type { WebComponent } from "$lib/overlay/components/types";
import type { Transform } from "$lib/overlay/scene";

const Element = (Source as WebComponent<typeof Source, Transform>).element;

const DotsSource = class extends Element {
  static get defaultProps() {
    return {
      transform,
      options,
    };
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
