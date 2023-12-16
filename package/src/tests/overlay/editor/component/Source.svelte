<script>
  import { transform } from "./config";

  export let x = transform.x;
  export let y = transform.y;
  export let width = transform.width;
  export let height = transform.height;
</script>

<div
  class="source"
  style:left={`${x ?? 0}px`}
  style:top={`${y ?? 0}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
  style:background-color="red"
></div>

<style>
  .source {
    position: absolute;
  }
</style>
