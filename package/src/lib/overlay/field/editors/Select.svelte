<script lang="ts">
  import Dropdown from "$lib/ui/components/Dropdown.svelte";

  export let label: string;
  export let value: string;
  export let items: { label: string; value: string }[] = [];

  let selected = items.indexOf(items.find((item) => item.value === value) ?? items[0]);
</script>

<div class="flex justify-between">
  <label class="capitalize" for={label}>{label}</label>
  <Dropdown class="dots-input min-w-[10rem]">
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
</div>
