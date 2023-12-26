import Text from "./Text.svelte";
import Number from "./Number.svelte";
import Multiline from "./Multiline.svelte";
import Checkbox from "./Checkbox.svelte";
import Select from "./Select.svelte";
import type { SvelteComponent } from "svelte";

export type FieldEditor = typeof SvelteComponent<{ label: string; value: unknown }>;

export const fieldEditors = {
  text: Text,
  number: Number,
  multiline: Multiline,
  checkbox: Checkbox,
  select: Select,
} satisfies Record<string, FieldEditor>;
