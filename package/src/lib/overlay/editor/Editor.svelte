<script lang="ts">
  import { onDestroy } from "svelte";
  import Screen from "../screen/Screen.svelte";
  import Inspector from "./Inspector.svelte";
  import Editable from "./Editable.svelte";
  import type { Sources } from "../scene/types.js";

  export let sources: Sources = [];
  export let inspector: HTMLElement | undefined = undefined;
  export let selected: number = -1;

  let inspectorContents: HTMLDivElement;

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
    <svelte:element
      this={tag}
      style:width={`${transform.width}px`}
      style:height={`${transform.height}px`}
      style:left={`${transform.x}px`}
      style:top={`${transform.y}px`}
      {...options}
    />
  {/each}
  <div class="window" slot="window">
    <div class="catch" on:pointerdown={() => (selected = -1)} />
    {#each sources as s, i}
      {#if !s.editor.locked}
        <Editable
          selected={selected == i}
          on:selected={() => (selected = i)}
          bind:transform={sources[i].transform}
        />
      {/if}
    {/each}
  </div>
</Screen>

{#if selected !== -1}
  <div class="contents" bind:this={inspectorContents}>
    {#key selected}
      <Inspector bind:source={sources[selected]} />
    {/key}
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
