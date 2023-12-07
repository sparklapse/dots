import Editor from "./Editor.svelte";
import type { WebComponent } from "../types";
import type { DotsScreen } from "../Screen/web";

type EditorProps = {
  screen: DotsScreen;
};
const Element = (Editor as WebComponent<typeof Editor, EditorProps>).element;

export class DotsEditor extends Element {
  #scaleListener?: () => void;

  async connectedCallback() {
    await super.connectedCallback();

    this.#scaleListener = this.screen.scale.subscribe((scale) => {
      this.screen.style.setProperty("--dots-screen-scale", scale.toString());
    });
  }

  async disconnectedCallback() {
    await super.disconnectedCallback();

    this.#scaleListener?.();
  }
}
