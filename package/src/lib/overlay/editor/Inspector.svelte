<script lang="ts">
  import { onMount } from "svelte";
  import { fieldEditors } from "../field/editors/index.js";
  import Fallback from "../field/editors/Fallback.svelte";
  import type { SvelteComponent } from "svelte";
  import type { Source, Transform } from "../scene/types.js";
  import type { Field } from "../field/index.js";

  export let source: Source;

  // This fixes a weird typescript issue when using with svelte:component
  const fe = fieldEditors as { [key: string]: typeof SvelteComponent };

  const transformKeys = Object.keys(source.transform) as (keyof Transform)[];

  let optionTypes: { [key: string]: Field } = {};
  onMount(async () => {
    const component = (await customElements.whenDefined(source.tag)) as typeof HTMLElement & {
      optionTypes: { [key: string]: Field };
    };
    optionTypes = component.optionTypes;
  });

  const clickAction = (option: string) => {
    return () => {
      const elem = document.getElementById(source.id) as HTMLElement & {
        [key: string]: ((source: Source) => void) | undefined;
      };

      const action = elem[option];
      if (typeof action !== "function") return;
      if (action) action.call(elem, source);
    };
  };
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
    {#each Object.keys(optionTypes) as option}
      {#if optionTypes[option].type === "action" || optionTypes[option].type === "helper"}
        <div class="control">
          <svelte:component
            this={fe[optionTypes[option].type] ?? Fallback}
            label={option}
            bind:value={optionTypes[option].value}
            on:click={clickAction(option)}
          />
        </div>
      {:else}
        <div class="control">
          <svelte:component
            this={fe[optionTypes[option].type] ?? Fallback}
            label={option}
            bind:value={source.options[option]}
            {...optionTypes[option].props}
          />
        </div>
      {/if}
      <hr />
    {/each}
  </div>
  <div class="mt-auto py-1">
    <p class="italic">Inspecting {source.label} ({source.id})</p>
  </div>
</div>
