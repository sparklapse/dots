<script lang="ts" context="module">
  import { field } from "$lib/overlay/index.js";

  export const label = "testing";
  export const transform = {
    x: 100,
    y: 100,
    width: 200,
    height: 200,
  };

  export const options = {
    color: field("text", "red"),
    text: field("multiline", "Hello\nWorld!"),
  };
</script>

<script lang="ts">
  export let color: string;
  export let text: string;
</script>

<div class="source" style:background-color={color}>
  <pre>{text}</pre>
</div>

<style>
  :global(:host) {
    display: block;
    position: absolute;
  }

  .source {
    display: flex;
    width: 100%;
    height: 100%;
    font-size: 4rem;
  }

  .source pre {
    margin: 0;
  }
</style>
