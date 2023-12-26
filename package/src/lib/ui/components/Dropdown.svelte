<script lang="ts">
  import clsx from "clsx";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { getScrollableParent } from "../utils/selectors.js";

  export let y: "auto" | "above" | "below" = "auto";
  export let x: "left" | "right" = "left";
  let classes = "";
  export { classes as class };

  let open: boolean = false;
  let container: HTMLDivElement | undefined;
  let toggle: HTMLButtonElement | undefined;
  let dropdown: HTMLFormElement | undefined;

  let autoY: "above" | "below" = "below";
  const autoYHandler = () => {
    if (!dropdown || !container) return;

    const screenHeight = window.innerHeight;
    const { y } = container.getBoundingClientRect();
    const { height } = dropdown.getBoundingClientRect();

    if (screenHeight > y + height) autoY = "below";
    else autoY = "above";
  };

  $: if (dropdown) {
    container!.append(dropdown);
    if (y === "auto") autoYHandler();
  }

  onMount(() => {
    if (!container) return;

    const scrollParent = getScrollableParent(container);

    scrollParent?.addEventListener("scroll", autoYHandler);

    return () => {
      scrollParent?.removeEventListener("scroll", autoYHandler);
    };
  });

  onDestroy(() => {
    if (dropdown) dropdown.remove();
  });

  const blurDropdown = (ev: MouseEvent) => {
    if (!open) return;
    if (dropdown?.contains(ev.target as Node)) return;
    if (toggle?.contains(ev.target as Node)) return;

    ev.stopPropagation();
    open = false;
  };
</script>

<div class="relative w-fit" bind:this={container}>
  <button
    class={classes}
    on:click={() => {
      open = !open;
    }}
    bind:this={toggle}
  >
    <slot />
  </button>
</div>

<svelte:document on:pointerdown={blurDropdown} />

{#if open}
  <form
    class={clsx([
      "absolute z-10 w-full",
      (y === "auto" ? autoY : y) === "above" ? "bottom-full" : "top-full",
      x === "left" ? "left-0" : "right-0",
    ])}
    on:submit={(ev) => {
      ev.preventDefault();
      open = false;
    }}
    bind:this={dropdown}
    transition:fade={{ duration: 100 }}
  >
    <slot name="dropdown" />
  </form>
{/if}
