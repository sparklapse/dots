<script lang="ts">
  import Editable from "./Editable.svelte";
  import type { DotsScreen } from "../Screen/web";
  import type { Sources } from "../../scene";

  export let screen: DotsScreen;
  export let sources: Sources = [];
</script>

<dots-screen bind:this={screen}>
  {#each sources as { tag, props }}
    <svelte:element this={tag} {...props} />
  {/each}
  <div class="window" slot="window">
    {#each sources as { props }}
      <Editable bind:props />
    {/each}
  </div>
</dots-screen>

<style>
  .window {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
