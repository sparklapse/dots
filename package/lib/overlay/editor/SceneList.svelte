<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import type { Source } from "..";

  const dispatch = createEventDispatcher<{ select: number }>();

  export let scene: Source[];
  let displayScene: Source[] = structuredClone(scene).reverse();
  $: displayScene = structuredClone(scene).reverse();
</script>

<ul>
  {#each displayScene as source, i}
    <li class="flex items-center space-x-2">
      <button on:click={() => dispatch("select", scene.length - 1 - i)}>
        <span>{source.label ?? source.type}</span>
      </button>
    </li>
  {/each}
</ul>
