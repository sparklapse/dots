<script>
  import Component from "../src/Component.svelte";
  import { transform } from "../src/config";

  // Required for editor transformation
  export let x = transform.x;
  export let y = transform.y;
  export let width = transform.width;
  export let height = transform.height;

  /* $options$ */
</script>

<Component transform={{ x, y, width, height }} $use-options />

<style>
  :global(:host) {
    position: absolute;
  }
</style>
