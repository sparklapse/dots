<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let selected: boolean = false;
  export let transform: {
    x: number;
    y: number;
    width: number;
    height: number;
  };

  const dispatch = createEventDispatcher<{
    selected: { additive: boolean };
    dragstart: void;
    resizestart: "nw" | "ne" | "sw" | "se";
  }>();
</script>

<div
  class={"editable" + (selected ? " selected" : "")}
  style:left={`calc(${transform.x}px * var(--dots-screen-scale))`}
  style:top={`calc(${transform.y}px * var(--dots-screen-scale))`}
  style:width={`calc(${transform.width}px * var(--dots-screen-scale))`}
  style:height={`calc(${transform.height}px * var(--dots-screen-scale))`}
  on:pointerdown={(ev) => {
    if (ev.button == 0 && !selected) dispatch("selected", { additive: ev.shiftKey });
  }}
  on:pointermove={(ev) => {
    if (ev.buttons !== 1) return;
    dispatch("dragstart");
  }}
  on:pointerup={(ev) => {
    if (ev.button == 0 && selected) dispatch("selected", { additive: ev.shiftKey });
  }}
>
  <div
    on:pointerdown={() => dispatch("resizestart", "nw")}
    class="resizeHandle"
    style:top="0"
    style:left="0"
    style:transform="translate(-50%, -50%)"
    style:cursor="nw-resize"
  />
  <div
    on:pointerdown={() => dispatch("resizestart", "ne")}
    class="resizeHandle"
    style:top="0"
    style:right="0"
    style:transform="translate(50%, -50%)"
    style:cursor="ne-resize"
  />
  <div
    on:pointerdown={() => dispatch("resizestart", "sw")}
    class="resizeHandle"
    style:bottom="0"
    style:left="0"
    style:transform="translate(-50%, 50%)"
    style:cursor="sw-resize"
  />
  <div
    on:pointerdown={() => dispatch("resizestart", "se")}
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
    user-select: none;
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
