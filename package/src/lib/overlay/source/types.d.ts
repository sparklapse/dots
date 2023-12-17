import type { ComponentType } from "svelte";

export type WebComponent<
  T extends ComponentType = ComponentType,
  P extends Record<string, unknown> = object,
> = T & {
  element: HTMLElement &
    CustomElementConstructor & {
      new (): P & {
        connectedCallback(): void | Promise<void>;
        disconnectedCallback(): void | Promise<void>;
      };
    };
};