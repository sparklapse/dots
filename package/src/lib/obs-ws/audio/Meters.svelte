<script lang="ts">
  import { onMount } from "svelte";
  import { getAudioMeters, type AudioMeter } from ".";
  import type { Readable } from "svelte/store";

  let meters: Readable<AudioMeter[]> | undefined;
  onMount(async () => {
    meters = await getAudioMeters();
  });
</script>

{#if $meters}
  <div class="flex gap-2">
    {#each $meters as meter}
      <article class="flex gap-2 w-12">
        <h2 class="text-sideways font-semibold max-h-48 whitespace-nowrap overflow-clip text-clip">
          {meter.label}
        </h2>
        <div class="relative w-4 h-48 bg-zinc-600">
          <div
            class="absolute bottom-0 w-1/2 h-1/2 bg-zinc-400 transition-[height] duration-75"
            style="height: {meter.peak.left * 100}%;"
          ></div>
          <div
            class="absolute bottom-0 left-1/2 w-1/2 h-1/2 bg-zinc-400 transition-[height] duration-75"
            style="height: {meter.peak.right * 100}%;"
          ></div>
        </div>
      </article>
    {/each}
  </div>
{/if}
