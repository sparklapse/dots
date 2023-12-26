<script lang="ts">
  import "./src";
  import { onMount } from "svelte";
  import { label } from "./src/Source.svelte";
  import { Editor } from "@sparklapse/dots/overlay";
  import type { Sources, DotsSource } from "@sparklapse/dots/overlay";

  let sources: Sources = [];

  onMount(async () => {
    const sourceElement = (await customElements.whenDefined("source-" + label)) as DotsSource;
    sources = [
      ...sources,
      {
        id: "abc123",
        label: "My Source",
        tag: "source-" + label,
        ...sourceElement.defaultProps,
      },
    ];
  });
</script>

<div>
  <h1>Source Preview</h1>
  <Editor bind:sources />
</div>
