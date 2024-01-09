<script lang="ts">
  import { onMount } from "svelte";
  import { Editor, Inspector } from "$lib/overlay/index.js";
  import type { Sources, DotsSource } from "$lib/overlay/index.js";

  let scene: Sources = [];
  let selected: number[] = [];
  onMount(async () => {
    await import("./component/index.js");
    await import("./built/source-0.3.0.js" + "");
    const textSource = (await customElements.whenDefined("source-text")) as DotsSource;
    const imageSource = (await customElements.whenDefined("source-image")) as DotsSource;
    const mySource = (await customElements.whenDefined("source-my-source")) as DotsSource;

    scene = [
      {
        id: "abc123",
        label: "text 1",
        tag: "source-text",
        editor: {
          locked: false,
        },
        ...textSource.defaultProps,
      },
      {
        id: "def456",
        label: "image 1",
        tag: "source-image",
        editor: {
          locked: false,
        },
        ...imageSource.defaultProps,
      },
      {
        id: "def456",
        label: "custom v0.3.0",
        tag: "source-my-source", // built
        editor: {
          locked: false,
        },
        ...mySource.defaultProps,
      },
    ];
  });
</script>

<h1>Editor Test</h1>
<div class="grid grid-cols-3 gap-2">
  <div class="col-span-2">
    <Editor bind:scene bind:selected />
  </div>
  {#if selected.length === 1}
    {#key selected}
      <Inspector bind:source={scene[selected[0]]} />
    {/key}
  {:else if selected.length > 1}
    <p>Multiple Sources selected ({selected.length})</p>
  {:else}
    <p>No Sources selected</p>
  {/if}
</div>
