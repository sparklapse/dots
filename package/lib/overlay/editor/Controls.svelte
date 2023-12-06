<script lang="ts">
  import { z } from "zod";
  import { getContext } from "svelte";
  import type { ComponentKeys } from "..";
  import type { ObsContext } from "../contexts/obs";

  type S = $$Generic<z.ZodObject<{ [key: string]: z.ZodType }>>;

  export let componentType: ComponentKeys;
  export let schema: S;
  export let values: z.infer<S>;

  const obsInputKinds = getContext<ObsContext | undefined>("obs")?.inputKindList;

  $: controls = Object.entries(schema.shape).map(([key, value]) => {
    if (value instanceof z.ZodDefault) {
      return [key, value._def.innerType] as const;
    } else {
      return [key, value] as const;
    }
  });
</script>

<div class="flex w-full flex-col gap-2 overflow-y-auto">
  {#each controls as ctrl}
    <div class="flex justify-between gap-8 px-3 py-1">
      <span class="font-mono font-bold text-zinc-700">{ctrl[0]}</span>
      {#if ctrl[1] instanceof z.ZodString}
        <input bind:value={values[ctrl[0]]} />
      {:else if ctrl[1] instanceof z.ZodNumber}
        <input
          class="w-24 bg-transparent"
          type="number"
          min={ctrl[1].minValue}
          max={ctrl[1].maxValue}
          step={(ctrl[1].maxValue ?? Infinity) > 1 ? 1 : 0.01}
          bind:value={values[ctrl[0]]}
        />
      {:else if ctrl[1] instanceof z.ZodBoolean}
        <input bind:checked={values[ctrl[0]]} type="checkbox" />
      {:else if ctrl[1] instanceof z.ZodEnum}
        {#if componentType === "obsSource" && $obsInputKinds}
          <select bind:value={values[ctrl[0]]}>
            {#each ctrl[1]._def.values as val}
              <option value={val} disabled={!$obsInputKinds.includes(val)}>{val}</option>
            {/each}
          </select>
        {:else}
          <select bind:value={values[ctrl[0]]}>
            {#each ctrl[1]._def.values as val}
              <option value={val}>{val}</option>
            {/each}
          </select>
        {/if}
      {:else}
        <span>({values[ctrl[0]]})</span>
      {/if}
    </div>
  {/each}
</div>
