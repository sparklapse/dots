<script lang="ts" context="module">
  import { field } from "$lib/overlay/index.js";

  export const label = "image";
  export const transform = {
    x: 400,
    y: 100,
    width: 200,
    height: 200,
  };

  export const options = {
    src: field("text", "https://thispersondoesnotexist.com/"),
  };
</script>

<script lang="ts">
  export let src: string;
</script>

<img class="source" alt="" {src} />

<style>
  :global(:host) {
    display: block;
    position: absolute;
  }

  .source {
    display: flex;
    width: 100%;
    height: 100%;
  }
</style>
