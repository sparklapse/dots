import Source from "./Source.svelte";
import { label, options, transform } from "./config";
import type { WebComponent } from "$lib/overlay/types";
import type { Transform } from "$lib/overlay/scene";

const Element = (Source as WebComponent<typeof Source, Transform>).element;

export const DotsSource = class extends Element {
  static get defaultProps() {
    return {
      transform,
      options: Object.entries(options).reduce(
        (acc, [key, option]) => ({
          ...acc,
          [key]: option.value,
        }),
        {} as Record<string, any>,
      ),
    };
  }

  static get optionsTypes() {
    return options;
  }

  get options() {
    const opts: Record<string, any> = {};
    for (const key in options) {
      // @ts-ignore
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
