<script>
  import Component from "../src/Component.svelte";
  import { defaultTransform } from "../src/config";

  // Required for editor transformation
  export let x = defaultTransform.x;
  export let y = defaultTransform.y;
  export let width = defaultTransform.width;
  export let height = defaultTransform.height;
</script>

<div
  class="source"
  style:left={`${x ?? 0}px`}
  style:top={`${y ?? 0}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
>
  <Component transform={{ x, y, width, height }} />
</div>

<style>
  .source {
    position: absolute;
  }
</style>
