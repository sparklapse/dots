import Source from "./Source.svelte";
import { label, options, transform } from "./config.js";
import type { WebComponent } from "$lib/overlay/index.js";
import type { Transform } from "$lib/overlay/index.js";

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
        {} as Record<string, unknown>,
      ),
    };
  }

  static get optionsTypes() {
    return options;
  }

  get options() {
    const opts: Record<string, unknown> = {};
    for (const key in options) {
      // @ts-expect-error - Get option values from the component
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
