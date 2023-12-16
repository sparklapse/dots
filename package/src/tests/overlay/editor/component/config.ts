import { field } from "$lib/overlay/components/fields";
import type { Transform } from "$lib/overlay/scene";

export const label: string = "testing";

export const options = {
  color: field("text", "red"),
  text: field("multiline", "Hello\nWorld!"),
};

export const transform: Transform = {
  x: 100,
  y: 100,
  width: 200,
  height: 200,
};
