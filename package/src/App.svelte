<script lang="ts">
  import "$dist/overlay/dots-screen";
  import type { SvelteComponent } from "svelte";

  const tests: Record<string, { default: typeof SvelteComponent }> = import.meta.glob(
    "./tests/**/Page.svelte",
    {
      eager: true,
    },
  );
  let selectedTest = location.hash.slice(1) ?? "home";

  $: if (selectedTest) {
    location.hash = selectedTest;
  }
</script>

<div class="stable-gutter flex h-screen flex-col gap-2 overflow-x-hidden">
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
