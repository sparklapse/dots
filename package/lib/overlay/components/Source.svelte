<script lang="ts">
  export let x: number = 0;
  export let y: number = 0;
  export let width: number = 100;
  export let height: number = 100;
</script>

<div
  class="source"
  style:left={`${x ?? 0}px`}
  style:top={`${y ?? 0}px`}
  style:width={`${width}px`}
  style:height={`${height}px`}
>
  <slot>
    <div style="background-color: red; width: 100%; height: 100%" />
  </slot>
</div>

<style>
  .source {
    position: absolute;
  }
</style>
