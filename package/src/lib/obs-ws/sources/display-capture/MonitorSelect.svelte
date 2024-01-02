<script lang="ts">
  import { Dropdown } from "$lib/ui";
  import { createEventDispatcher, onMount } from "svelte";

  export let items: { label: string; value: string }[] = [{ label: "DUMMY", value: "DUMMY" }];

  const dispatch = createEventDispatcher<{ close: string }>();

  let dialog: HTMLDialogElement;
  let selected = 0;
  let value = items[selected].value;

  onMount(() => {
    dialog.showModal();
  });
</script>

<dialog
  class="grid place-content-center dots-card overflow-visible"
  on:close={() => dispatch("close", value)}
  bind:this={dialog}
>
  <form class="flex flex-col gap-2" method="dialog">
    <h1 class="text-xl font-bold">Select a monitor</h1>
    <Dropdown class="dots-input">
      <span>{items[selected].label}</span>
      <div class="bg-white shadow w-full" slot="dropdown">
        <div class="h-full max-h-[20rem] overflow-y-auto scrollbar-thin">
          {#each items as item, i}
            <button
              class="w-full text-left p-2 hover:bg-zinc-100"
              class:selected={i === selected}
              on:click={() => {
                selected = i;
                value = item.value;
              }}
            >
              {item.label}
            </button>
          {/each}
        </div>
      </div>
    </Dropdown>
    <div class="flex justify-between">
      <button class="dots-btn">Cancel</button>
      <button class="dots-btn">Save</button>
    </div>
  </form>
</dialog>

<style>
  dialog::backdrop {
    backdrop-filter: blur(5px);
  }

  dialog[open] {
    opacity: 1;
    transform: translateY(0);
  }

  dialog {
    opacity: 0;
    transform: translateY(-1rem);
    transition:
      opacity 0.2s ease-in-out,
      transform 0.2s ease-in-out,
      overlay 0.2s ease-out allow-discrete,
      display 0.2s ease-out allow-discrete;
  }

  @starting-style {
    dialog[open] {
      opacity: 0;
      transform: translateY(-1rem);
    }
  }
</style>
