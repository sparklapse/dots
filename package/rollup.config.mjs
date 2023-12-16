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
  {
    input: "./lib/overlay/index.ts",
    output: {
      file: "./dist/dots-overlay.js",
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
  {
    input: "./lib/overlay/scene/index.ts",
    output: {
      file: "./dist/dots-overlay-scene.js",
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
        include: ["./lib/overlay/scene.ts"],
      }),
    ],
  },
  {
    input: "./lib/overlay/components/fields/index.ts",
    output: {
      file: "./dist/dots-overlay-component-fields.js",
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
        include: ["./lib/overlay/components/fields/index.ts"],
      }),
    ],
  },
];
