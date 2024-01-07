<script lang="ts" context="module">
  import { field } from "$lib/overlay";

  export const label = "browser";
  export const transform = {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
  };
  export const options = {
    showPreview: field("action", "Show Preview"),
    enabled: field("checkbox", true),
    inputKind: field("readonly", "browser_source"),
    url: field("text", "https://obsproject.com/browser-source"),
    customCss: field("multiline", ""),
    cropLeft: field("number", 0),
    cropRight: field("number", 0),
    cropTop: field("number", 0),
    cropBottom: field("number", 0),
  };
</script>

<script lang="ts">
  export let preview = "";
</script>

{#if preview && preview !== "error"}
  <img src={preview} alt="obs preview" />
{:else if preview === "error"}
  <div class="message">
    <p>Something went wrong getting the preview. Check OBS and try again.</p>
  </div>
{:else}
  <div class="message">
    <p>Connect to OBS to get preview</p>
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
    object-fit: fill;
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
