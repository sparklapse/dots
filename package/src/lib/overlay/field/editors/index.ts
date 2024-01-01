import Text from "./Text.svelte";
import Number from "./Number.svelte";
import Multiline from "./Multiline.svelte";
import Checkbox from "./Checkbox.svelte";
import Select from "./Select.svelte";
import Action from "./Action.svelte";
import Fallback from "./Fallback.svelte";
import Helper from "./Helper.svelte";
import type { SvelteComponent } from "svelte";

export type FieldEditor = typeof SvelteComponent<{ label: string; value: unknown }>;

export const fieldEditors = {
  text: Text,
  number: Number,
  multiline: Multiline,
  checkbox: Checkbox,
  select: Select,
  action: Action,
  readonly: Fallback,
  helper: Helper,
} satisfies Record<string, FieldEditor>;
