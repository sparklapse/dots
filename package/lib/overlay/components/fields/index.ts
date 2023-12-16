import type { SvelteComponent } from "svelte";

type FieldType = "string" | "number" | "boolean";
type FieldOptions = {
  type: FieldType;
  default: any;
  editor?: SvelteComponent<{ value: any }>;
};

const field = (options: FieldOptions) => {
  return options;
};
