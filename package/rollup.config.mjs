import svelte from "rollup-plugin-svelte";
import preprocess from "svelte-preprocess";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

const plugins = [
  svelte({
    preprocess: preprocess({
      typescript: {
        tsconfigFile: "./tsconfig.build.json",
      },
    }),
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
  typescript({
    tsconfig: "./tsconfig.build.json",
  }),
  terser(),
];

/** @type {import("rollup").RollupOptions[]} */
export default [
  {
    input: "./lib/overlay/index.ts",
    output: {
      file: "./dist/dots-overlay.js",
      format: "iife",
    },
    treeshake: true,
    plugins: plugins,
  },
];
