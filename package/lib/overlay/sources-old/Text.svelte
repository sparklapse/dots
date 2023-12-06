<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { nanoid } from "nanoid";
  import type { ScreenContext } from "../contexts/screen";
  import Component from "./primitives/Component.svelte";

  export let options = {
    id: nanoid(),
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    text: "Hello world!",
    fontSize: 24,
  };

  // Editor
  export let inspector: HTMLElement | undefined = undefined;

  const { scale } = getContext<ScreenContext>("screen");

  let textarea: HTMLPreElement;

  onMount(() => {
    const observer = new ResizeObserver(() => {
      const { width, height } = textarea.getBoundingClientRect();

      options = {
        ...options,
        width: width / $scale,
        height: height / $scale,
      };
    });

    observer.observe(textarea!);

    return () => observer.disconnect();
  });
</script>

<Component inspectorRoot={inspector} bind:options>
  <div slot="inspector">
    <h2>EDIT TEXT</h2>
  </div>

  <div
    slot="overlay"
    class="h-full w-full rounded-sm bg-white bg-opacity-20 opacity-0 outline outline-1 outline-transparent transition-all duration-200 hover:opacity-100 hover:outline-white"
  />

  <pre
    class="absolute isolate select-none text-white"
    style:left={`${options.x}px`}
    style:top={`${options.y}px`}
    style:font-size={`${options.fontSize}px`}
    bind:this={textarea}>{options.text}</pre>
</Component>
