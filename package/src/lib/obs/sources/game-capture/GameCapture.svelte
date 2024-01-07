<script lang="ts" context="module">
  import { field } from "$lib/overlay";

  export const label = "game-capture";
  export const transform = {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
  };
  export const options = {
    showPreview: field("action", "Show Preview"),
    selectGame: field("action", "Select Game"),
    enabled: field("checkbox", true),
    inputKind: field("readonly", "game_capture"),
    allowTransparency: field("checkbox", false),
    cropLeft: field("number", 0),
    cropRight: field("number", 0),
    cropTop: field("number", 0),
    cropBottom: field("number", 0),
  };
</script>

<script lang="ts">
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
    <p>Game Capture</p>
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
