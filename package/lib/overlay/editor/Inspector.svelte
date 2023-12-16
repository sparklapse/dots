<script lang="ts">
  import { onMount } from "svelte";
  import type { Transform } from "../../scene";
  import type { Field } from "../fields";

  export let tag: string;
  export let options: { [key: string]: any };
  export let transform: Transform;

  const transformKeys = Object.keys(transform) as (keyof Transform)[];

  let optionsTypes: { [key: string]: Field } = {};
  onMount(async () => {
    const component = (await customElements.whenDefined(tag)) as typeof HTMLElement & {
      optionsTypes: { [key: string]: Field };
    };
    optionsTypes = component.optionsTypes;
  });
</script>

<div class="transform">
  <h3>Transform</h3>
  {#each transformKeys as param}
    <div class="control">
      <label for={param}>{param}</label>
      <input type="number" name={param} bind:value={transform[param]} />
    </div>
  {/each}
</div>
<div class="options">
  <h3>Options</h3>
  {#each Object.keys(optionsTypes) as option}
    <div class="control">
      <svelte:component
        this={optionsTypes[option].editor}
        label={option}
        bind:value={options[option]}
      />
    </div>
  {/each}
</div>
