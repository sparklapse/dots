import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { dotsPreprocess } from "./lib/preprocessor";

export default defineConfig({
  plugins: [
    svelte({
      preprocess: [dotsPreprocess],
      compilerOptions: {
        customElement: true,
      },
    }),
    {
      // Since web components can't be redefined, full reload
      name: "full-reload",
      handleHotUpdate: ({ server }) => {
        server.ws.send({ type: "full-reload" });
      },
    },
  ],
});
