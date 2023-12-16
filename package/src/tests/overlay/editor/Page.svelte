<script lang="ts">
  import "$lib/overlay";
  import "./component";
  import type { DotsSource } from "./component";
  import { onMount } from "svelte";
  import type { DotsEditor } from "$lib/overlay/components/editor/web";

  let editor: DotsEditor;

  onMount(async () => {
    if (!editor) return;
    const source = (await customElements.whenDefined("source-testing")) as typeof DotsSource;
    const { transform, options } = source.defaultProps;

    editor.sources = [
      {
        tag: "source-testing",
        transform,
        options,
      },
    ];
    console.log(editor.sources);
  });
</script>

<h1>Editor Test</h1>
<dots-editor bind:this={editor}></dots-editor>
