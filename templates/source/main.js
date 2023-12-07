import "@sparklapse/dots/overlay";
import "./lib/main";

import { label } from "./src/config";

if (/[a-z0-9-]/.test(label) === false)
  throw new Error("sourceLabel must be lower alphanumeric with dashes");

customElements.whenDefined("dots-editor").then(() => {
  const editor = document.querySelector("dots-editor");

  editor.scene = [
    ...editor.scene,
    {
      tag: "source-" + label,
      props: { x: 100, y: 100, width: 100, height: 100 },
    },
  ];
});
