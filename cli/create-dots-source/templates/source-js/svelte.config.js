import { dotsPreprocess } from "./lib/preprocessor.js";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import("@sveltejs/vite-plugin-svelte").Options} */
export default {
  preprocess: [vitePreprocess(), dotsPreprocess],
  compilerOptions: {
    css: "injected",
    customElement: true,
  },
};
