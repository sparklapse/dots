<script lang="ts">
  import { onMount } from "svelte";

  export let width: number = 1920;
  export let height: number = 1080;

  let scale = 0;

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
      class="relative isolate"
      style:width={`${Math.round(width * scale)}px`}
      style:height={`${Math.round(height * scale)}px`}
    >
      <div
        class="absolute overflow-hidden z-0"
        style:transform-origin="top left"
        style:width={`${width}px`}
        style:height={`${height}px`}
        style:transform={`scale(${scale * 100}%)`}
        bind:this={screen}
      >
        <slot>
          <div class="grid w-full h-full place-content-center bg-black bg-opacity-70">
            <span class="text-8xl font-bold text-white">SCREEN EMPTY</span>
          </div>
        </slot>
      </div>
      <div class="relative w-full h-full z-10 overflow-hidden">
        <slot name="window" />
      </div>
    </div>
  </div>
</div>
