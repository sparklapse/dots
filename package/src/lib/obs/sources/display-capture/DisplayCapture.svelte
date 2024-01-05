<script lang="ts" context="module">
  import { field } from "$lib/overlay";
  import { getObs, getDotsScene, getInput } from "$lib/obs/obs";
  import type { Source, InferFieldValues } from "$lib/overlay";

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

  export const toObs = async (source: Source<InferFieldValues<typeof options>>) => {
    const obs = await getObs();
    const scene = await getDotsScene();
    const obsInput = (await getInput(source)).cata({
      Ok: (input) => input,
      Err: (err) => {
        console.error(err);
        return null;
      },
    });

    if (!obsInput) return;

    const transform = {
      positionX: source.transform.x,
      positionY: source.transform.y,
      boundsWidth: Math.max(source.transform.width, 1),
      boundsHeight: Math.max(source.transform.height, 1),
      cropLeft: source.options.cropLeft,
      cropRight: source.options.cropRight,
      cropTop: source.options.cropTop,
      cropBottom: source.options.cropBottom,
    };

    await obs.call("SetSceneItemTransform", {
      sceneName: scene,
      sceneItemId: obsInput!.itemId,
      sceneItemTransform: {
        boundsType: "OBS_BOUNDS_SCALE_INNER",
        ...transform,
      },
    });

    await obs.call("SetSceneItemEnabled", {
      sceneItemEnabled: source.options.enabled,
      sceneName: scene,
      sceneItemId: obsInput.itemId,
    });

    if (obsInput.label !== `${source.label}#${source.id}`)
      await obs.call("SetInputName", {
        inputName: obsInput.label,
        newInputName: `${source.label}#${source.id}`,
      });
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
    object-fit: contain;
  }

  .message {
    display: grid;
    place-content: center;
    height: 100%;
  }

  p {
    font-weight: bold;
    font-size: 4rem;
    word-wrap: break-word;
    text-align: center;
  }
</style>
