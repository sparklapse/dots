import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

import { label } from "./src/config.js";

if (/[a-z0-9-]/.test(label) === false) {
  throw new Error("sourceLabel must be alphanumeric with dashes");
}

/** @type {import("rollup").RollupOptions} */
export default {
  input: "./lib/main.js",
  output: {
    file: `./dist/source-${label}.js`,
    format: "iife",
  },
  plugins: [
    svelte({
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
