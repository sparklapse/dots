import type { ComponentType } from "svelte";
import type { Field, FieldValues } from "../field/index.js";
import type { Transform } from "./types.js";

export type DotsSource = typeof HTMLElement & {
  defaultProps: {
    transform: Transform;
    options: Record<string, FieldValues>;
  };
  optionTypes: Record<string, Field>;
  options: Record<string, FieldValues>;
};

export const createSource = (
  source: ComponentType,
  { transform, options }: { transform: Transform; options: Record<string, Field> },
) => {
  const SourceElement = source.element as {
    new (): HTMLElement & {
      connectedCallback(): void | Promise<void>;
      disconnectedCallback(): void | Promise<void>;
    };
    prototype: HTMLElement & {
      connectedCallback(): void | Promise<void>;
      disconnectedCallback(): void | Promise<void>;
    };
  };

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
      if (!propName) return;

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
          (acc, [key, option]) => {
            if (option.type === "action") return acc;
            if (option.type === "helper") return acc;

            return {
              ...acc,
              [key]: option.value,
            };
          },
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
        if (options[key].type === "action") continue;

        opts[key] = this[key];
      }
      return opts;
    }

    get actions() {
      const acts: Record<string, unknown> = {};
      for (const key in options) {
        if (options[key].type !== "action") continue;

        acts[key] = this[key];
      }
      return acts;
    }
  };
};
