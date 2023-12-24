<script lang="ts">
  import { onMount } from "svelte";
  import type { Source, Transform } from "../scene/types.js";
  import type { Field } from "../field/index.js";

  export let source: Source;

  const transformKeys = Object.keys(source.transform) as (keyof Transform)[];

  let optionsTypes: { [key: string]: Field } = {};
  onMount(async () => {
    const component = (await customElements.whenDefined(source.tag)) as typeof HTMLElement & {
      optionsTypes: { [key: string]: Field };
    };
    optionsTypes = component.optionsTypes;
  });
</script>

<div class="flex flex-col gap-4">
  <div class="flex flex-col gap-2">
    <h3 class="text-xl font-bold" title={source.id}>Source</h3>
    <div class="flex justify-between">
      <label for="label">Label</label>
      <input class="dots-input" type="text" name="label" bind:value={source.label} />
    </div>
  </div>
  <div class="flex flex-col gap-2">
    <h3 class="text-xl font-bold">Transform</h3>
    {#each transformKeys as param}
      <div class="flex justify-between">
        <label for={param}>{param}</label>
        <input class="dots-input" type="number" name={param} bind:value={source.transform[param]} />
      </div>
    {/each}
  </div>
  <div class="flex flex-col gap-2">
    <h3 class="text-xl font-bold">Options</h3>
    {#each Object.keys(optionsTypes) as option}
      <div class="control">
        <svelte:component
          this={optionsTypes[option].editor}
          label={option}
          bind:value={source.options[option]}
        />
      </div>
    {/each}
  </div>
  <div class="mt-auto py-1">
    <p class="italic">Inspecting {source.label} ({source.id})</p>
  </div>
</div>
