import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      $lib: resolve("./lib"),
      $dist: resolve("./dist"),
    },
  },
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
});
