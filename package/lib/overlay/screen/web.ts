import Screen from "./Screen.svelte";
import type { Readable } from "svelte/store";
import type { WebComponent } from "../types";

type ScreenProps = {
  scale: Readable<number>;
};
const Element = (Screen as WebComponent<typeof Screen, ScreenProps>).element;

export class DotsScreen extends Element {
  constructor() {
    super();
  }
}
