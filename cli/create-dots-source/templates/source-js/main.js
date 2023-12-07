import "./lib/main";
import "@sparklapse/dots/overlay";
import { buildScene } from "@sparklapse/dots/overlay/scene";

import { label } from "./src/config";

if (/[a-z0-9-]/.test(label) === false)
  throw new Error("sourceLabel must be lower alphanumeric with dashes");

customElements.whenDefined("dots-editor").then(() => {
  const editor = document.querySelector("dots-editor");
  const buildButton = document.getElementById("build-scene");

  buildButton.addEventListener("click", () => {
    const scene = buildScene(editor.sources);
    const built = document.getElementById("built");
    built.innerHTML = scene;
  });

  editor.sources = [
    ...editor.sources,
    {
      tag: "source-" + label,
      props: { x: 100, y: 100, width: 100, height: 100 },
    },
  ];
});
