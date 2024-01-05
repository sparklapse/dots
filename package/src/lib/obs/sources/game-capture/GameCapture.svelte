<script lang="ts" context="module">
  import { field } from "$lib/overlay";
  import { getObs, getDotsScene, getInput } from "$lib/obs/obs";
  import type { Source, InferFieldValues } from "$lib/overlay";

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

    const settings = {
      allow_transparency: source.options.allowTransparency,
      capture_mode: "window",
    };

    await obs.call("SetInputSettings", {
      inputName: obsInput.label,
      inputSettings: settings,
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
