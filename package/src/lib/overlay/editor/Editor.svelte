<script lang="ts">
  import Editable from "./Editable.svelte";
  import Screen from "$lib/overlay/screen/Screen.svelte";
  import type { Sources } from "../scene/index.js";
  import Inspector from "./Inspector.svelte";
  import { onDestroy } from "svelte";

  export let sources: Sources = [];
  export let inspector: HTMLElement | undefined = undefined;

  let inspectorContents: HTMLDivElement;
  let selected = -1;

  $: if (inspectorContents && inspector) {
    if (inspector) inspector.appendChild(inspectorContents);
  }

  onDestroy(() => {
    if (inspectorContents) inspectorContents.remove();
  });
</script>

<Screen>
  <div class="bg" />
  {#each sources as { tag, transform, options }}
    <svelte:element this={tag} {...transform} {...options} />
  {/each}
  <div class="window" slot="window">
    <div class="catch" on:pointerdown={() => (selected = -1)} />
    {#each sources as _, i}
      <Editable
        selected={selected == i}
        on:selected={() => (selected = i)}
        bind:transform={sources[i].transform}
      />
    {/each}
  </div>
</Screen>

{#if selected !== -1}
  <div class="contents" bind:this={inspectorContents}>
    <Inspector
      tag={sources[selected].tag}
      bind:transform={sources[selected].transform}
      bind:options={sources[selected].options}
    />
  </div>
{/if}

<style>
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .catch {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }

  .window {
    width: 100%;
    height: 100%;
    isolation: isolate;
  }
</style>