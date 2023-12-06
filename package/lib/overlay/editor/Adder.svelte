<script lang="ts">
  import { onDestroy, createEventDispatcher } from "svelte";
  import { IconPlus } from "@tabler/icons-svelte";
  import Card from "$lib/components/ui/Card.svelte";
  import TextInput from "$lib/components/ui/input/TextInput.svelte";
  import { COMPONENTS } from "$lib/components/overlay/list";
  import type { ComponentKeys } from "$lib/components/overlay/list";

  const dispatch = createEventDispatcher<{ create: ComponentKeys }>();

  const options = Object.keys(COMPONENTS).map((key) => ({
    label: `${key[0].toUpperCase()}${key.slice(1)}`,
    value: key as ComponentKeys,
  }));

  let search: string = "";
  let open: boolean = false;
  let container: HTMLDivElement;
  let dropdown: HTMLDivElement;
  let results: typeof options = [];

  $: results = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase()),
  );

  $: open = search.length > 0;

  onDestroy(() => {
    if (dropdown) dropdown.remove();
  });

  $: if (dropdown) {
    document.body.appendChild(dropdown);

    const { x, y, height } = container.getBoundingClientRect();

    dropdown.style.left = `${x}px`;
    dropdown.style.top = `${y + height}px`;
  }

  const create = (item?: ComponentKeys) => {
    if (search.length === 0) return;
    if (results.length === 0) return;

    dispatch("create", item ?? results[0].value);
    search = "";
  };
</script>

<div bind:this={container}>
  <Card class="flex h-3 w-80 max-w-sm items-center gap-2 from-stone-600 to-stone-700 p-1 shadow">
    <TextInput
      class="w-full"
      placeholder="Search for a component to add"
      bind:value={search}
      on:keydown={(ev) => {
        if (ev.detail.key !== "Enter") return;

        create();
      }}
    />
    <button on:click={() => create()}>
      <IconPlus />
    </button>
  </Card>
</div>

{#if open}
  <div
    class="absolute flex flex-col items-start rounded bg-stone-200 py-2 text-black shadow-xl"
    bind:this={dropdown}
  >
    {#each results.slice(0, 5) as option}
      <button
        class="w-full px-5 text-left hover:bg-stone-300"
        on:click={() => create(option.value)}
      >
        {option.label}
      </button>
    {/each}
  </div>
{/if}
