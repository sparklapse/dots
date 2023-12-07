import type { ComponentType } from "svelte";

export type WebComponent<T extends ComponentType = ComponentType, P extends Object = {}> = T & {
  element: HTMLElement &
    CustomElementConstructor & {
      new (): P & {
        connectedCallback(): void | Promise<void>;
        disconnectedCallback(): void | Promise<void>;
      };
    };
};
