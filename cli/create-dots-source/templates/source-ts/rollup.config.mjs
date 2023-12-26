import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

/** @type {import("rollup").RollupOptions} */
export default {
  input: "./src/index.js",
  output: {
    file: `./dist/source.js`,
    format: "iife",
  },
  plugins: [
    svelte({
      preprocess: [],
      emitCss: false,
      compilerOptions: {
        css: "injected",
        customElement: true,
      },
    }),
    resolve({
      browser: true,
      exportConditions: ["svelte"],
      extensions: [".svelte"],
    }),
    terser(),
  ],
};
