<script lang="ts">
  import type { DotsScene } from "../Scene/web";
  import Editable from "./Editable.svelte";

  export let screen: DotsScene;
  let scene: { tag: string; props: { x: number; y: number; width: number; height: number } }[] = [
    {
      tag: "source-test",
      props: {
        x: 200,
        y: 200,
        width: 100,
        height: 100,
      },
    },
  ];
</script>

<dots-scene bind:this={screen}>
  {#each scene as { tag, props }}
    <svelte:element this={tag} {...props} />
  {/each}
  <div slot="window">
    {#each scene as { props }}
      <Editable bind:props />
    {/each}
  </div>
</dots-scene>
