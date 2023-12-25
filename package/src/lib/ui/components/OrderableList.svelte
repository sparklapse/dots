<script lang="ts">
  import clsx from "clsx";
  import { createEventDispatcher } from "svelte";
  import { flip } from "svelte/animate";

  type I = $$Generic<{ id: string; label: string }>;

  export let reverse: boolean = false;
  export let items: I[] = [];

  let draggedIndex: number | undefined = undefined;
  let overIndex: number | undefined = undefined;

  const dispatch = createEventDispatcher<{ reordered: { prev: number; new: number } }>();

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
    if (side < 0 && overIndex + 1 !== items.length && draggedIndex > overIndex) overIndex += 1;
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

    items.splice(overIndex, 0, ...items.splice(draggedIndex, 1));
    items = [...items];

    dispatch("reordered", { prev: draggedIndex, new: overIndex });

    draggedIndex = undefined;
  };
</script>

<ul
  class={clsx([
    "flex flex-col bg-white rounded isolate list",
    reverse ? "flex-col-reverse" : "flex-col",
  ])}
>
  {#each items as opt, i (opt.id)}
    <li
      class={clsx([
        "hover:bg-dots-coffee-50 box-border flex items-center overflow-hidden",
        reverse ? "last:rounded-t first:rounded-b" : "first:rounded-t last:rounded-b",
      ])}
      draggable="true"
      data-index={i}
      on:dragstart={dragStart}
      on:dragover={dragOver}
      on:dragleave={dragUnstyle}
      on:drop={drop}
      animate:flip={{ duration: 200 }}
    >
      <slot item={{ index: i, ...opt }} />
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
