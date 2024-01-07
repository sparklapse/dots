<script lang="ts" context="module">
  import { field } from "$lib/overlay";

  export const label = "display-capture";
  export const transform = {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
  };
  export const options = {
    showPreview: field("action", "Show Preview"),
    selectMonitor: field("action", "Select Monitor"),
    enabled: field("checkbox", true),
    inputKind: field("readonly", "monitor_capture"),
    cropLeft: field("number", 0),
    cropRight: field("number", 0),
    cropTop: field("number", 0),
    cropBottom: field("number", 0),
  };
</script>

<script lang="ts">
  // export const inputKind = "monitor_capture";
  // export let captureCursor: boolean;
  // export let forceSDR: boolean;
  // export let method: 0 | 1 | 2;

  // export let cropLeft: number;
  // export let cropRight: number;
  // export let cropTop: number;
  // export let cropBottom: number;

  export let preview: string = "";
</script>

{#if preview && preview !== "error"}
  <img src={preview} alt="obs preview" />
{:else if preview === "error"}
  <div class="message">
    <p>Something went wrong getting the preview. Check OBS and try again.</p>
  </div>
{:else}
  <div class="message">
    <p>Display Capture</p>
  </div>
{/if}

<style>
  :global(:host) {
    display: block;
    position: absolute;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .message {
    display: grid;
    place-content: center;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    color: white;
  }

  p {
    font-weight: bold;
    font-size: 4rem;
    word-wrap: break-word;
    text-align: center;
  }
</style>
