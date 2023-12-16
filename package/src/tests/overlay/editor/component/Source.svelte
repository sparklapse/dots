<script lang="ts">
  import { transform } from "./config";

  export let x = transform.x;
  export let y = transform.y;
  export let width = transform.width;
  export let height = transform.height;

  export let color: string;
  export let text: string;
</script>

<div
  class="source"
  style:left={`${x ?? 0}px`}
  style:top={`${y ?? 0}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
  style:background-color={color}
>
  <pre>{text}</pre>
</div>

<style>
  .source {
    position: absolute;
  }

  .source pre {
    margin: 0;
  }
</style>
