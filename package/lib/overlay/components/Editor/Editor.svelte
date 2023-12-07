<script lang="ts">
  import type { DotsScene } from "../Scene/web";
  import Editable from "./Editable.svelte";

  export let screen: DotsScene;
  export let scene: {
    tag: string;
    props: { x: number; y: number; width: number; height: number };
  }[] = [];
</script>

<dots-scene bind:this={screen}>
  {#each scene as { tag, props }}
    <svelte:element this={tag} {...props} />
  {/each}
  <div class="window" slot="window">
    {#each scene as { props }}
      <Editable bind:props />
    {/each}
  </div>
</dots-scene>

<style>
  .window {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
