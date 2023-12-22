<script lang="ts">
  import { onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  let classes = "";
  export { classes as class };

  let open: boolean = false;
  let toggle: HTMLButtonElement | undefined;
  let dropdown: HTMLFormElement | undefined;

  $: if (dropdown) {
    document.body.append(dropdown);
  }

  let toggleRect: DOMRect | undefined;
  $: if (toggle && open) {
    toggleRect = toggle.getBoundingClientRect();
  }

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

<button
  class={classes}
  on:click={() => {
    open = !open;
  }}
  bind:this={toggle}
>
  <slot />
</button>

<svelte:document on:pointerdown={blurDropdown} />

{#if open}
  <form
    class="absolute z-10"
    style:top={`${(toggleRect?.top ?? 0) + (toggleRect?.height ?? 0)}px`}
    style:left={`${toggleRect?.left ?? 0}px`}
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
