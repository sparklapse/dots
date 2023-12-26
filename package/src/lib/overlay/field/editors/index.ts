import Text from "./Text.svelte";
import Multiline from "./Multiline.svelte";
import Checkbox from "./Checkbox.svelte";
import Select from "./Select.svelte";
import type { SvelteComponent } from "svelte";

export type FieldEditor = typeof SvelteComponent<{ label: string; value: unknown }>;

export const fieldEditors = {
  text: Text,
  multiline: Multiline,
  checkbox: Checkbox,
  select: Select,
} satisfies Record<string, FieldEditor>;
