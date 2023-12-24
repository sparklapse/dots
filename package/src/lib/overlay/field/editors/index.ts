import Text from "./Text.svelte";
import Multiline from "./Multiline.svelte";
import Checkbox from "./Checkbox.svelte";
import type { SvelteComponent } from "svelte";

export type FieldEditor = typeof SvelteComponent<{ label: string; value: unknown }>;

export const fieldEditors = {
  text: Text,
  multiline: Multiline,
  checkbox: Checkbox,
} satisfies Record<string, FieldEditor>;
