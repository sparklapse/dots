<script lang="ts">
  import type { SvelteComponent } from "svelte";
  import "../lib/overlay";

  const tests: Record<string, { default: typeof SvelteComponent }> = import.meta.glob(
    "./tests/**/Page.svelte",
    {
      eager: true,
    },
  );
  let selectedTest = "home";
</script>

<div class="flex flex-col gap-2">
  <h1>Dots</h1>
  <select name="tests" id="tests" bind:value={selectedTest}>
    <option value="home">Select a test</option>
    {#each Object.keys(tests) as test}
      <option value={test}>{test}</option>
    {/each}
  </select>

  {#if selectedTest !== "home"}
    <svelte:component this={tests[selectedTest].default} />
  {/if}
</div>
