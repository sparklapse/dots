<script lang="ts" context="module">
  import { z } from "zod";
  import { customAlphabet } from "nanoid";

  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 6);
  export const ObsSourceControls = z.object({
    x: z.number().default(0),
    y: z.number().default(0),
    width: z.number().min(0).default(300),
    height: z.number().min(0).default(400),
    sourceId: z
      .string()
      .default("")
      .transform((v) => v || nanoid())
      .readonly(),
    sourceKind: z
      .enum([
        "image_source",
        "color_source_v3",
        "slideshow",
        "browser_source",
        "ffmpeg_source",
        "text_gdiplus_v2",
        "text_ft2_source_v2",
        "vlc_source",
        "monitor_capture",
        "window_capture",
        "game_capture",
        "dshow_input",
        "spout_capture", // Plugin: https://github.com/Off-World-Live/obs-spout2-plugin
        "wasapi_input_capture",
        "wasapi_output_capture",
        "wasapi_process_output_capture",
      ])
      .default("color_source_v3"),
    sizeType: z.enum(["settings", "scale"]).default("settings"),
  });
</script>

<script lang="ts">
  interface $$Props extends z.input<typeof ObsSourceControls> {}

  let options: $$Props = ObsSourceControls.parse({ ...$$props });
  $: options = ObsSourceControls.parse({ ...$$props });
</script>

<div
  class="absolute bg-red-400"
  style:left={`${options.x}px`}
  style:top={`${options.y}px`}
  style:width={`${options.width}px`}
  style:height={`${options.height}px`}
>
  OBS Source
</div>
