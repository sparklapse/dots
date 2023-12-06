<script lang="ts">
  import clsx from "clsx";

  import { getContext, onDestroy, onMount, createEventDispatcher } from "svelte";
  import type { ScreenContext } from "../../contexts/screen";

  type O = $$Generic<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;

  export let options: O;

  const dispatch = createEventDispatcher<{ pointerdown: void }>();

  // Component
  let component: HTMLDivElement;

  // Inspector
  export let inspectorRoot: HTMLElement | undefined = undefined;
  let inspectorControls: HTMLDivElement | undefined;

  $: if (inspectorRoot && inspectorControls) {
    inspectorRoot.append(inspectorControls);
  }

  onDestroy(() => {
    if (inspectorControls) inspectorControls.remove();
  });

  // Editor Overlay
  let overlayRoot: HTMLElement | undefined = undefined;
  let overlayHandle: HTMLDivElement | undefined;

  let isDragging: boolean = false;
  let dragType: "move" | "resize";
  let dragCorner: "nw" | "ne" | "sw" | "se";

  const dragHandle = (type: typeof dragType, corner?: typeof dragCorner) => {
    return (
      ev: PointerEvent & {
        currentTarget: EventTarget & HTMLDivElement;
      },
    ) => {
      if (ev.button !== 0) return;

      dispatch("pointerdown");

      dragType = type;
      if (type === "resize") {
        ev.stopPropagation();
        if (!corner) throw Error("Corner must be provided when resizing");
        dragCorner = corner!;
      }
      isDragging = true;
    };
  };

  onMount(() => {
    const screen = component.closest("[data-dots-screen]") as HTMLDivElement | null;
    if (!screen) return;

    overlayRoot = screen.querySelector("[data-dots-screen-overlay]")! as HTMLDivElement;
  });

  const { scale } = getContext<ScreenContext>("screen");

  $: if (overlayRoot && overlayHandle) {
    overlayRoot.append(overlayHandle);
  }

  onDestroy(() => {
    if (overlayHandle) overlayHandle.remove();
  });
</script>

<div class="contents" bind:this={component}>
  <slot />
</div>

{#if inspectorRoot}
  <div bind:this={inspectorControls}>
    <slot name="inspector" />
  </div>
{/if}

<svelte:document
  on:pointermove={(ev) => {
    if (!overlayRoot || !overlayHandle) return;
    if (!isDragging) return;
    if (ev.buttons !== 1) {
      isDragging = false;
      return;
    }

    switch (dragType) {
      case "move": {
        options = {
          ...options,
          x: options.x + ev.movementX / $scale,
          y: options.y + ev.movementY / $scale,
        };
        break;
      }
      case "resize": {
        let x = options.x;
        let width = options.width;
        let y = options.y;
        let height = options.height;

        if (dragCorner.startsWith("n")) {
          y += ev.movementY / $scale;
          height -= ev.movementY / $scale;
        } else {
          height += ev.movementY / $scale;
        }

        if (dragCorner.endsWith("w")) {
          x += ev.movementX / $scale;
          width -= ev.movementX / $scale;
        } else {
          width += ev.movementX / $scale;
        }

        options = {
          ...options,
          x,
          y,
          height,
          width,
        };
      }
    }
  }}
  on:pointerup={(ev) => {
    if (ev.button !== 0) return;
    isDragging = false;
  }}
/>

{#if overlayRoot}
  <div
    class="absolute"
    style:left={`${(options.x ?? 0) * $scale}px`}
    style:top={`${(options.y ?? 0) * $scale}px`}
    style:width={`${options.width * $scale}px`}
    style:height={`${options.height * $scale}px`}
    on:pointerdown={dragHandle("move")}
    bind:this={overlayHandle}
  >
    <slot name="overlay">
      <div
        class={clsx([
          "h-full w-full rounded-sm bg-white bg-opacity-20 outline outline-1 transition-all duration-200",
          inspectorRoot
            ? "opacity-100 outline-white"
            : "opacity-0 outline-transparent hover:opacity-100 hover:outline-white",
        ])}
      >
        <div
          on:pointerdown={dragHandle("resize", "nw")}
          class="absolute left-0 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 cursor-nw-resize bg-white"
        />
        <div
          on:pointerdown={dragHandle("resize", "ne")}
          class="absolute right-0 top-0 h-2 w-2 -translate-y-1/2 translate-x-1/2 cursor-ne-resize bg-white"
        />
        <div
          on:pointerdown={dragHandle("resize", "sw")}
          class="absolute bottom-0 left-0 h-2 w-2 -translate-x-1/2 translate-y-1/2 cursor-sw-resize bg-white"
        />
        <div
          on:pointerdown={dragHandle("resize", "se")}
          class="absolute bottom-0 right-0 h-2 w-2 translate-x-1/2 translate-y-1/2 cursor-se-resize bg-white"
        />
      </div>
    </slot>
  </div>
{/if}
