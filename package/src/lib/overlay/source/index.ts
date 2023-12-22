import type { ComponentType } from "svelte";
import type { Field } from "../field/index.js";
import type { Transform } from "../scene/types.js";

export type DotsSource = typeof HTMLElement & {
  defaultProps: {
    transform: Transform;
    options: Record<string, unknown>;
  };
  optionsTypes: Record<string, Field>;
  options: Record<string, unknown>;
};

export const createSource = (
  source: ComponentType,
  { transform, options }: { transform: Transform; options: Record<string, Field> },
) => {
  const SourceElement = source.element!;

  return class extends SourceElement {
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
  };
};
