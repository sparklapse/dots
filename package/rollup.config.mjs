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
  terser(),
];

/** @type {import("rollup").RollupOptions[]} */
export default [
  // Screen web component
  {
    input: "./lib/overlay/screen/index.ts",
    output: {
      file: "./dist/overlay/dots-screen.js",
      format: "iife",
      sourcemap: true,
    },
    treeshake: true,
    plugins: [
      ...plugins,
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
    ],
  },
  // Editor Library
  {
    input: "./lib/overlay/editor/index.ts",
    output: {
      file: "./dist/overlay/dots-editor.js",
      format: "esm",
      sourcemap: true,
    },
    treeshake: true,
    plugins: [
      ...plugins,
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
    ],
  },
  // Scene library
  {
    input: "./lib/overlay/scene/index.ts",
    output: {
      file: "./dist/overlay/dots-scene.js",
      format: "esm",
      sourcemap: true,
    },
    treeshake: true,
    plugins: [
      ...plugins,
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
    ],
  },
  {
    input: "./lib/main.ts",
    output: {
      file: "./dist/index.js",
      format: "esm",
      sourcemap: true,
    },
    treeshake: true,
    plugins: [
      ...plugins,
      typescript({
        tsconfig: "./tsconfig.build.json",
        compilerOptions: {
          declaration: true,
          outDir: "./dist",
        },
      }),
    ],
  },
];
