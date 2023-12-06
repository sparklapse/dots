<script lang="ts">
  import { getContext, onMount, createEventDispatcher } from "svelte";
  import { nanoid } from "nanoid";
  import type { ScreenContext } from "../contexts/screen";
  import Component from "./primitives/Component.svelte";

  const dispatch = createEventDispatcher<{ pointerdown: void }>();

  export let options = {
    id: nanoid(),
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    url: "https://thispersondoesnotexist.com",
  };

  // Editor
  export let inspector: HTMLElement | undefined = undefined;

  const { scale } = getContext<ScreenContext>("screen");

  let image: HTMLImageElement;

  onMount(() => {
    const observer = new ResizeObserver(() => {
      const { width, height } = image.getBoundingClientRect();

      options = {
        ...options,
        width: width / $scale,
        height: height / $scale,
      };
    });

    observer.observe(image!);

    return () => observer.disconnect();
  });
</script>

<Component inspectorRoot={inspector} on:pointerdown={() => dispatch("pointerdown")} bind:options>
  <div slot="inspector">
    <h2>EDIT IMAGE</h2>
  </div>

  <img
    src={options.url}
    alt="User content"
    class="absolute isolate select-none"
    draggable={false}
    style:left={`${options.x}px`}
    style:top={`${options.y}px`}
    style:width={`${options.width}px`}
    style:height={`${options.height}px`}
    bind:this={image}
  />
</Component>
