<script lang="ts">
  import Editable from "./Editable.svelte";
  import type { DotsScreen } from "../screen/web";
  import type { Sources } from "../../scene";
  import Inspector from "./Inspector.svelte";
  import { onDestroy } from "svelte";

  export let screen: DotsScreen;
  export let sources: Sources = [];
  let inspectorMount: string | undefined;
  export { inspectorMount as inspector };

  let inspector: HTMLDivElement;
  let selected = -1;

  $: if (inspector && inspectorMount) {
    const mount = document.getElementById(inspectorMount);
    console.log(mount);
    if (mount) mount.appendChild(inspector);
  }

  onDestroy(() => {
    if (inspector) inspector.remove();
  });
</script>

<dots-screen bind:this={screen}>
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
</dots-screen>

{#if selected !== -1}
  <div class="inspector-controls" bind:this={inspector}>
    <Inspector
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
