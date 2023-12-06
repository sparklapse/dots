import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [
    svelte({
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
  build: {
    lib: {
      entry: "./lib/main.ts",
      name: "DotsOverlay",
      fileName: "dots-overlay",
    },
  },
});
