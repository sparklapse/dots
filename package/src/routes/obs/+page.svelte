<script lang="ts">
  import { nanoid } from "nanoid";
  import { Editor } from "$lib/overlay";
  import {
    isIdentified,
    connect,
    disconnect,
    cleanRemoteSources,
    syncObsSources,
  } from "$lib/obs-ws";
  import { getAudioMeters } from "$lib/obs-ws/audio";
  import { onMount } from "svelte";
  import { load, tags } from "$lib/obs-ws/sources";
  import Meters from "$lib/obs-ws/audio/Meters.svelte";
  import type { DotsSource, Source, Sources } from "$lib/overlay";

  let inspector: HTMLDivElement;
  let sources: Sources = [];
  let selected = -1;

  onMount(async () => {
    await load();
  });

  const addSource = (tag: string) => {
    return async () => {
      const elem = (await customElements.whenDefined(tag)) as DotsSource;

      sources = [
        ...sources,
        {
          id: nanoid(7),
          tag: tag,
          label: tag,
          editor: {
            locked: false,
          },
          ...elem.defaultProps,
        },
      ];
    };
  };

  const syncToObs = async () => {
    await syncObsSources(sources as Source<{ inputKind: string }>[]);

    await cleanRemoteSources(sources);
  };

  const testObs = async () => {
    console.log(await getAudioMeters());
  };
</script>

<div class="dots-card">
  <h1 class="font-bold text-xl">OBS Connector</h1>
  <div class="py-2 flex flex-col gap-2">
    <div>
      <h2 class="font-bold">Status</h2>
      <p>{$isIdentified ? "Connected" : "Not connected"}</p>
    </div>
    <div class="flex flex-col gap-2">
      <div>
        <h2 class="font-bold">Calls</h2>
        <button class="dots-btn" on:click={() => connect()}>Connect</button>
        <button class="dots-btn" on:click={() => disconnect()}>Disconnect</button>
        <button class="dots-btn" on:click={() => syncToObs()}>Sync</button>
        <button class="dots-btn" on:click={() => testObs()}>Test</button>
      </div>
      <div>
        <h2 class="font-bold">Audio</h2>
        <Meters />
      </div>
      <div>
        <h2 class="font-bold">Components</h2>
        <div class="flex flex-wrap gap-2">
          <button
            class="dots-btn dots-btn-maceron"
            on:click={() => {
              selected = -1;
              sources = [];
            }}
          >
            Clear Sources
          </button>
          {#each tags as tag}
            <button class="dots-btn" on:click={addSource(tag)}>{tag}</button>
          {/each}
        </div>
      </div>
      <hr class="w-full my-4" />
      <div>
        <div class="col-span-2">
          <Editor bind:sources bind:selected {inspector} />
        </div>
        <div bind:this={inspector} />
      </div>
    </div>
  </div>
</div>
