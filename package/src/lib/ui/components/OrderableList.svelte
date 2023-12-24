<script lang="ts">
  import type { ComponentType } from "svelte";
  import { flip } from "svelte/animate";

  export let itemElement: ComponentType | undefined = undefined;
  export let reverse: boolean = false;
  export let options: { id: string; label: string }[] = [];

  let draggedIndex: number | undefined = undefined;
  let overIndex: number | undefined = undefined;

  const dragStart = (
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLLIElement;
    },
  ) => {
    const { height } = ev.currentTarget.getBoundingClientRect();
    ev.dataTransfer?.setDragImage(ev.currentTarget, ev.offsetX, height / 2);

    draggedIndex = Number(ev.currentTarget.dataset.index);
  };

  const dragOver = (
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLLIElement;
    },
  ) => {
    if (draggedIndex === undefined) return;

    ev.preventDefault();
    ev.currentTarget.classList.add("dropzone");

    overIndex = Number(ev.currentTarget.dataset.index);

    const { top, height } = ev.currentTarget.getBoundingClientRect();
    let side = (top - ev.y + height / 2) / (height / 2);

    if (side > 0) {
      ev.currentTarget.classList.add("dropzone-top");
      ev.currentTarget.classList.remove("dropzone-bottom");
    } else {
      ev.currentTarget.classList.add("dropzone-bottom");
      ev.currentTarget.classList.remove("dropzone-top");
    }

    if (reverse) side *= -1;
    if (side < 0 && overIndex + 1 !== options.length && draggedIndex > overIndex) overIndex += 1;
    if (side > 0 && overIndex !== 0 && draggedIndex < overIndex) overIndex -= 1;
  };

  const dragUnstyle = (
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLLIElement;
    },
  ) => {
    ev.currentTarget.classList.remove("dropzone", "dropzone-top", "dropzone-bottom");
  };

  const drop = (
    ev: DragEvent & {
      currentTarget: EventTarget & HTMLLIElement;
    },
  ) => {
    if (draggedIndex === undefined || overIndex === undefined) return;

    ev.preventDefault();
    dragUnstyle(ev);

    options.splice(overIndex, 0, ...options.splice(draggedIndex, 1));
    options = [...options];

    draggedIndex = undefined;
  };
</script>

<ul
  class="flex flex-col bg-white p-2 rounded isolate list"
  style:flex-direction={reverse ? "column-reverse" : "column"}
>
  {#each options as opt, i (opt.id)}
    <li
      class="hover:bg-dots-coffee-50 box-border flex items-center first:rounded-t last:rounded-b p-2"
      draggable="true"
      data-index={i}
      on:dragstart={dragStart}
      on:dragover={dragOver}
      on:dragleave={dragUnstyle}
      on:drop={drop}
      animate:flip={{ duration: 200 }}
    >
      {#if itemElement}
        <svelte:component this={itemElement} {...opt} />
      {:else}
        <span class="select-none">{opt.label}</span>
      {/if}
    </li>
  {/each}
</ul>

<style>
  .list :global(.dropzone-top) {
    border-top: 2px solid theme("colors.dots-coffee.300");
  }

  .list :global(.dropzone-bottom) {
    border-bottom: 2px solid theme("colors.dots-coffee.300");
  }
</style>
