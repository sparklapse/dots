<script lang="ts">
  import "$lib/overlay";
  import "./component";
  import type { DotsSource } from "./component";
  import { onMount } from "svelte";
  import Editor from "$lib/overlay/editor/Editor.svelte";
  import type { Sources } from "$lib/overlay/scene";

  let sources: Sources = [];
  let dsPromise = customElements.whenDefined("dots-screen");
  onMount(async () => {
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
{#await dsPromise then}
  <Editor bind:sources />
{/await}
