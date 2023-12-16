<script lang="ts">
  import "$lib/overlay";
  import "./component";
  import { onMount } from "svelte";
  import type { DotsEditor } from "$lib/overlay/components/editor/web";

  let editor: DotsEditor;

  onMount(async () => {
    if (!editor) return;

    editor.sources = [
      {
        tag: "source-testing",
        transform: {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
        },
        options: {},
      },
    ];
  });
</script>

<h1>Editor Test</h1>
<dots-editor bind:this={editor}></dots-editor>
