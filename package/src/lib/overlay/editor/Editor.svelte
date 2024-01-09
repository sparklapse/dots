<script lang="ts">
  import Screen from "../screen/Screen.svelte";
  import Editable from "./Editable.svelte";
  import type { Sources } from "../scene/types.js";

  export let scene: Sources = [];
  export let selected: number[] = [];

  let dragType: "move" | "resize" = "move";
  let resizeCorner: "nw" | "ne" | "sw" | "se" = "nw";
  let isDragging: boolean = false;

  let reference: HTMLDivElement;

  export const test = () => {
    console.log("test");
  };

  const catcherDown = () => {
    selected = [];
  };

  // TODO: Create a selection box to select multiple sources
  const catcherMove = () => {};
</script>

<svelte:document
  on:pointermove={(ev) => {
    if (!isDragging) return;
    if (ev.buttons !== 1) {
      isDragging = false;
      return;
    }

    let scale = parseFloat(getComputedStyle(reference).getPropertyValue("--dots-screen-scale"));

    switch (dragType) {
      case "move": {
        for (const i of selected) {
          scene[i].transform = {
            ...scene[i].transform,
            x: Math.round(scene[i].transform.x + ev.movementX / scale),
            y: Math.round(scene[i].transform.y + ev.movementY / scale),
          };
        }
        break;
      }
      case "resize": {
        const transform = scene[selected[0]].transform;

        let x = transform.x;
        let width = transform.width;
        let y = transform.y;
        let height = transform.height;

        if (resizeCorner.startsWith("n")) {
          y += ev.movementY / scale;
          height -= ev.movementY / scale;
        } else {
          height += ev.movementY / scale;
        }

        if (resizeCorner.endsWith("w")) {
          x += ev.movementX / scale;
          width -= ev.movementX / scale;
        } else {
          width += ev.movementX / scale;
        }

        x = Math.round(x);
        y = Math.round(y);
        width = Math.max(0, Math.round(width));
        height = Math.max(0, Math.round(height));

        scene[selected[0]].transform = {
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

<Screen>
  <div class="bg" bind:this={reference} />
  {#each scene as { id, tag, transform, options }}
    <svelte:element
      this={tag}
      {id}
      style:width={`${transform.width}px`}
      style:height={`${transform.height}px`}
      style:left={`${transform.x}px`}
      style:top={`${transform.y}px`}
      {...options}
    />
  {/each}
  <div class="window" slot="window">
    <div class="catch" on:pointerdown={catcherDown} />
    {#each scene as s, i}
      {#if !s.editor.locked && !(isDragging && !selected.includes(i))}
        <Editable
          selected={selected.includes(i)}
          transform={scene[i].transform}
          on:selected={(ev) => {
            if (isDragging) return;
            if (ev.detail.additive) {
              if (!selected.includes(i)) selected = [...selected, i];
            } else selected = [i];
          }}
          on:dragstart={() => {
            if (isDragging) return;
            dragType = "move";
            isDragging = true;
          }}
          on:resizestart={(ev) => {
            if (isDragging) return;
            selected = [i];
            dragType = "resize";
            resizeCorner = ev.detail;
            isDragging = true;
          }}
        />
      {/if}
    {/each}
  </div>
</Screen>

<style>
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
  }

  .catch {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: transparent;
  }

  .window {
    width: 100%;
    height: 100%;
    isolation: isolate;
  }
</style>
