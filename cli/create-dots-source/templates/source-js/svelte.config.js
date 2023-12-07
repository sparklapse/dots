import { dotsPreprocess } from "./lib/preprocessor.js";

/** @type {import("@sveltejs/vite-plugin-svelte").Options} */
export default {
  preprocess: [dotsPreprocess],
  compilerOptions: {
    css: "injected",
    customElement: true,
  },
};
