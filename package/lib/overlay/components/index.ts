import Editor from "./Editor.svelte";
import Screen from "./Screen.svelte";
import Source from "./Source.svelte";
import type { ComponentType } from "svelte";

type WebComponent<T extends ComponentType = ComponentType> = T & {
  element: CustomElementConstructor;
};

export const DotsScreen = class extends (Screen as WebComponent<typeof Screen>).element {
  constructor() {
    super();
  }
} as CustomElementConstructor;

export const DotsEditor = class extends (Editor as WebComponent<typeof Editor>).element {
  constructor() {
    super();
  }
} as CustomElementConstructor;

export const DotsSource = class extends (Source as WebComponent<typeof Source>).element {
  x: number = 0;
  y: number = 0;
  width: number = 100;
  height: number = 100;

  constructor() {
    super();
  }

  get transform() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
    };
  }
} as CustomElementConstructor;
