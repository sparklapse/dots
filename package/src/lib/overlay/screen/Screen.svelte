<script lang="ts">
  import { onMount } from "svelte";

  export let width: number = 1920;
  export let height: number = 1080;

  let scale = -1;

  let container: HTMLDivElement;
  let screen: HTMLDivElement;

  $: if (container) {
    container.style.setProperty("--dots-screen-scale", scale.toString());
  }

  onMount(() => {
    const resize = () => {
      const { width: cw } = container.getBoundingClientRect();
      const sw = parseInt(getComputedStyle(screen).width.replace("px", ""));

      scale = cw / sw;
    };
    resize();

    const observer = new ResizeObserver(resize);

    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  });
</script>

<div class="w-full h-fit" bind:this={container}>
  <div class="contents">
    <div
      class="window"
      style:width={`${Math.round(width * scale)}px`}
      style:height={`${Math.round(height * scale)}px`}
    >
      <div
        class="screen"
        style:transform-origin="top left"
        style:width={`${width}px`}
        style:height={`${height}px`}
        style:transform={`scale(${scale * 100}%)`}
        bind:this={screen}
      >
        <slot>
          <div class="placeholder">
            <span>SCREEN EMPTY</span>
          </div>
        </slot>
      </div>
      <div class="window-overlay">
        <slot name="window" />
      </div>
    </div>
  </div>
</div>

<style>
  .window {
    position: relative;
    isolation: isolate;
  }

  .screen {
    position: absolute;
    overflow: hidden;
    z-index: 0;
  }

  .window-overlay {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 10;
    overflow: hidden;
  }

  .placeholder {
    display: grid;
    width: 100%;
    height: 100%;
    place-content: center;
    background-color: rgba(0, 0, 0, 0.7);
  }

  .placeholder span {
    font-family: sans-serif;
    font-size: 6rem;
    font-weight: 700;
    color: white;
  }
</style>
