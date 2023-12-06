import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/vite-plugin-svelte").Options} */
export default {
  compilerOptions: {
    customElement: true,
  },
  preprocess: [vitePreprocess()],
};
