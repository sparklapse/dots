import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

import { sourceLabel } from "./src/config.js";

if (/[a-zA-Z0-9-]/.test(sourceLabel) === false) {
  throw new Error("sourceLabel must be alphanumeric with dashes");
}

/** @type {import("rollup").RollupOptions} */
export default {
  input: "./lib/main.js",
  output: {
    file: `./dist/source-${sourceLabel}.js`,
    format: "iife",
  },
  plugins: [
    svelte({
      emitCss: false,
      compilerOptions: {
        css: "injected",
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
