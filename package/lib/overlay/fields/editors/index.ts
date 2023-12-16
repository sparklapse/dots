import Text from "./Text.svelte";
import Multiline from "./Multiline.svelte";
import type { FieldEditor } from "../types";

export const fieldEditors: Record<string, FieldEditor> = {
  text: Text,
  multiline: Multiline,
};
