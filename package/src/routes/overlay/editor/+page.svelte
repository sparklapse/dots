<script lang="ts">
  import type { DotsSource } from "./component/index.js";
  import { onMount } from "svelte";
  import Editor from "$lib/overlay/editor/Editor.svelte";
  import type { Sources } from "$lib/overlay/scene/index.js";

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
<Editor bind:sources />
