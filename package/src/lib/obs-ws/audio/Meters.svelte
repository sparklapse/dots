<script lang="ts">
  import { onMount } from "svelte";
  import { getAudioMeters, setChannelGainDb, setChannelGainMul } from ".";
  import type { AudioMeters } from ".";
  import type { Readable } from "svelte/store";

  let meters: Readable<AudioMeters> | undefined;
  onMount(async () => {
    meters = await getAudioMeters();
  });
</script>

{#if $meters}
  <div class="flex gap-2 overflow-x-auto stable-gutter scrollbar-thin pb-2">
    {#each Object.entries($meters) as [label, meter]}
      <article class="grid grid-cols-[1fr,1rem,1rem] gap-1 w-16 flex-shrink-0">
        <h2
          class="text-sideways font-semibold max-h-48 w-fit whitespace-nowrap justify-self-end overflow-clip text-clip"
        >
          {label}
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
        <input
          class="text-sideways-lr"
          type="range"
          min={0}
          max={1}
          step={0.01}
          aria-orientation="vertical"
          value={meter.volume.multiplier}
          on:input={async (ev) => {
            const v = parseFloat(ev.currentTarget.value);
            if (isNaN(v)) return;
            await setChannelGainMul(label, v);
            // await setChannelGainMul(label, Math.min(Math.log(v * 120 + 1) / Math.log(75), 1));
          }}
        />
        <input
          class="col-span-3 dots-input w-full text-sm"
          type="number"
          min={-100}
          max={26}
          step="0.1"
          value={meter.volume.gain}
          on:change={async (ev) => {
            const v = parseFloat(ev.currentTarget.value);
            if (isNaN(v)) return;

            await setChannelGainDb(label, v);
          }}
        />
      </article>
    {/each}
  </div>
{/if}
