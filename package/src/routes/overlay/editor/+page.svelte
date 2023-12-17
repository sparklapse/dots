<script lang="ts">
  import type { DotsSource } from "./component/index.js";
  import { onMount } from "svelte";
  import { Editor } from "$lib/overlay/index.js";
  import type { Sources } from "$lib/overlay/index.js";

  let inspector: HTMLDivElement;
  let sources: Sources = [];
  onMount(async () => {
    await import("./component/index.js");
    const source = (await customElements.whenDefined("source-testing")) as typeof DotsSource;
    const { transform, options } = source.defaultProps;

    sources = [
      {
        tag: "source-testing",
        transform,
        options,
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
