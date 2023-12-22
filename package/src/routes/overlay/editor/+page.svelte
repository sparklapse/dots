<script lang="ts">
  import { onMount } from "svelte";
  import { Editor } from "$lib/overlay/index.js";
  import type { Sources, DotsSource } from "$lib/overlay/index.js";

  let inspector: HTMLDivElement;
  let sources: Sources = [];
  onMount(async () => {
    await import("./component/index.js");
    const textSource = (await customElements.whenDefined("source-text")) as DotsSource;
    const imageSource = (await customElements.whenDefined("source-image")) as DotsSource;

    sources = [
      {
        tag: "source-text",
        ...textSource.defaultProps,
      },
      {
        tag: "source-image",
        ...imageSource.defaultProps,
      },
    ];
  });
</script>

<h1>Editor Test</h1>
<div class="grid grid-cols-3 gap-2">
  <div class="col-span-2">
    <Editor bind:sources {inspector} />
  </div>
  <div bind:this={inspector} />
</div>
