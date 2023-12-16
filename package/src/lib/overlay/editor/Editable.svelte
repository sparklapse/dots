<script lang="ts">
  import { createEventDispatcher } from "svelte";

  let editable: HTMLDivElement;
  let isDragging: boolean = false;
  let dragType: "move" | "resize";
  let dragCorner: "nw" | "ne" | "sw" | "se";

  export let selected: boolean = false;
  export let transform: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  const dispatch = createEventDispatcher<{ selected: void }>();

  const dragHandle = (type: typeof dragType, corner?: typeof dragCorner) => {
    return (
      ev: PointerEvent & {
        currentTarget: EventTarget & HTMLDivElement;
      },
    ) => {
      if (ev.button !== 0) return;

      dragType = type;
      if (type === "resize") {
        ev.stopPropagation();
        if (!corner) throw Error("Corner must be provided when resizing");
        dragCorner = corner!;
      }
      isDragging = true;
    };
  };
</script>

<svelte:document
  on:pointermove={(ev) => {
    if (!isDragging) return;
    if (ev.buttons !== 1) {
      isDragging = false;
      return;
    }

    let scale = parseFloat(getComputedStyle(editable).getPropertyValue("--dots-screen-scale"));

    switch (dragType) {
      case "move": {
        transform = {
          ...transform,
          x: transform.x + ev.movementX / scale,
          y: transform.y + ev.movementY / scale,
        };
        break;
      }
      case "resize": {
        let x = transform.x;
        let width = transform.width;
        let y = transform.y;
        let height = transform.height;

        if (dragCorner.startsWith("n")) {
          y += ev.movementY / scale;
          height -= ev.movementY / scale;
        } else {
          height += ev.movementY / scale;
        }

        if (dragCorner.endsWith("w")) {
          x += ev.movementX / scale;
          width -= ev.movementX / scale;
        } else {
          width += ev.movementX / scale;
        }

        transform = {
          ...transform,
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

<div
  class={"editable" + (selected || isDragging ? " selected" : "")}
  style:left={`calc(${transform.x}px * var(--dots-screen-scale))`}
  style:top={`calc(${transform.y}px * var(--dots-screen-scale))`}
  style:width={`calc(${transform.width}px * var(--dots-screen-scale))`}
  style:height={`calc(${transform.height}px * var(--dots-screen-scale))`}
  on:pointerdown={(ev) => {
    dispatch("selected");
    dragHandle("move")(ev);
  }}
  bind:this={editable}
>
  <div
    on:pointerdown={dragHandle("resize", "nw")}
    class="resizeHandle"
    style:top="0"
    style:left="0"
    style:transform="translate(-50%, -50%)"
    style:cursor="nw-resize"
  />
  <div
    on:pointerdown={dragHandle("resize", "ne")}
    class="resizeHandle"
    style:top="0"
    style:right="0"
    style:transform="translate(50%, -50%)"
    style:cursor="ne-resize"
  />
  <div
    on:pointerdown={dragHandle("resize", "sw")}
    class="resizeHandle"
    style:bottom="0"
    style:left="0"
    style:transform="translate(-50%, 50%)"
    style:cursor="sw-resize"
  />
  <div
    on:pointerdown={dragHandle("resize", "se")}
    class="resizeHandle"
    style:bottom="0"
    style:right="0"
    style:transform="translate(50%, 50%)"
    style:cursor="se-resize"
  />
</div>

<style>
  .editable {
    position: absolute;
    background-color: rgba(255, 255, 255, 0.5);
    outline-color: black;
    outline-style: solid;
    outline-width: 1px;
    opacity: 0;
    transition-property: opacity;
    transition-duration: 0.15s;
    transition-timing-function: ease-in-out;
  }

  .editable:hover,
  .editable.selected {
    opacity: 1;
  }

  .resizeHandle {
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    background-color: white;
    outline-color: black;
    outline-style: solid;
    outline-width: 1px;
    user-select: none;
    transition-property: background-color, outline-color;
    transition-duration: 0.05s;
    transition-timing-function: ease-in-out;
  }
</style>
