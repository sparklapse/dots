import preprocess from "svelte-preprocess";

/** @type {import("@sveltejs/vite-plugin-svelte").Options} */
export default {
  preprocess: [preprocess()],
  compilerOptions: {
    customElement: true,
  },
};
