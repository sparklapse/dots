<script>
  import Component from "../src/Component.svelte";

  export let x = 0;
  export let y = 0;
  export let width = 100;
  export let height = 100;
</script>

<div
  class="source"
  style:left={`${x ?? 0}px`}
  style:top={`${y ?? 0}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
>
  <Component />
</div>

<style>
  .source {
    position: absolute;
  }
</style>
