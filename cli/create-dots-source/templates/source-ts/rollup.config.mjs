import svelte from "rollup-plugin-svelte";
import preprocess from "svelte-preprocess";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";

/** @type {import("rollup").RollupOptions} */
export default {
  input: "./src/index.ts",
  output: {
    file: `./dist/source.js`,
    format: "iife",
  },
  plugins: [
    svelte({
      preprocess: [
        preprocess({
          typescript: {
            tsconfigFile: "./tsconfig.build.json",
          },
        }),
      ],
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
