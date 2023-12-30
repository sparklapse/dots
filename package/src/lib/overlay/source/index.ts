import type { ComponentType } from "svelte";
import type { Field, FieldValues } from "../field/index.js";
import type { Transform } from "../scene/types.js";

export type DotsSource = typeof HTMLElement & {
  defaultProps: {
    transform: Transform;
    options: Record<string, FieldValues>;
  };
  optionsTypes: Record<string, Field>;
  options: Record<string, FieldValues>;
};

export const createSource = (
  source: ComponentType,
  { transform, options }: { transform: Transform; options: Record<string, Field> },
) => {
  const SourceElement = source.element!;

  return class extends SourceElement {
    [key: keyof typeof options]: unknown;

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
      // NOTE: Svelte lowercases all props no matter what, so we need to map back
      // to the case sensitive name.
      const propMap = Object.keys(options).reduce(
        (prev, curr) => {
          prev[curr.toLowerCase()] = curr;
          return prev;
        },
        {} as Record<string, string>,
      );

      const propName = propMap[name];

      switch (options[propName].type) {
        case "number": {
          this[name] = Number(newValue);
          break;
        }
        case "checkbox": {
          this[name] = newValue === "true";
          break;
        }
        case "text":
        case "select":
        case "multiline": {
          this[name] = newValue;
          break;
        }
      }
    }

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

    static get optionTypes() {
      return options;
    }

    get options() {
      const opts: Record<string, unknown> = {};
      for (const key in options) {
        opts[key] = this[key];
      }
      return opts;
    }
  };
};
