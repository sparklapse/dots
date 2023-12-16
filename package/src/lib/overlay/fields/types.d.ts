import type { SvelteComponent } from "svelte";

// export class FieldEditor extends SvelteComponent<{ label: string; value: any }> {}
export type FieldEditor = typeof SvelteComponent<{ label: string; value: any }>;
