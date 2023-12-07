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

<div
  class="source"
  style:left={`${x ?? 0}px`}
  style:top={`${y ?? 0}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
>
  <Component transform={{ x, y, width, height }} $use-options />
</div>

<style>
  .source {
    position: absolute;
  }
</style>
