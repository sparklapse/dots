<script>
  import "./src";
  import { onMount } from "svelte";
  import { label } from "./src/Source.svelte";
  import { Editor } from "@sparklapse/dots/overlay";

  /**
   * @type {import("@sparklapse/dots/overlay").Sources}
   */
  let sources = [];

  onMount(async () => {
    const sourceElement = await customElements.whenDefined("source-" + label);
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
