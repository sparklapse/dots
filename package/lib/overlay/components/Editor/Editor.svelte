<script lang="ts">
  import Editable from "./Editable.svelte";
  import type { DotsScreen } from "../Screen/web";
  import type { Sources } from "../../scene";
  import Inspector from "./Inspector.svelte";

  export let screen: DotsScreen;
  export let sources: Sources = [];

  let inspector: HTMLDivElement;
  let selected = -1;
</script>

<dots-screen bind:this={screen}>
  <div class="bg"></div>
  {#each sources as { tag, transform, options }}
    <svelte:element this={tag} {...transform} {...options} />
  {/each}
  <div class="window" slot="window">
    {#each sources as { transform }, i}
      <Editable on:selected={() => (selected = i)} bind:transform />
    {/each}
  </div>
</dots-screen>

{#if selected !== -1}
  <div bind:this={inspector}>
    <Inspector bind:options={sources[selected].options} />
  </div>
{/if}

<style>
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }
  .window {
    width: 100%;
    height: 100%;
  }
</style>
