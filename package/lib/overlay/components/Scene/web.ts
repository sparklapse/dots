import Scene from "./Scene.svelte";
import type { Readable } from "svelte/store";
import type { WebComponent } from "../types";

type SceneProps = {
  scale: Readable<number>;
};
const Element = (Scene as WebComponent<typeof Scene, SceneProps>).element;

export class DotsScene extends Element {
  constructor() {
    super();
  }
}
