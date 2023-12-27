/**
 * You can't use tailwind in your components! (Due to shadow dom)
 *
 * Tailwind is here for a consistent css reset and some utility classes
 * on the dev server.
 */

import { dotsUIPlugin } from "@sparklapse/dots/ui/tailwind";

/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./index.html",
    "./App.svelte",
    "./node_modules/@sparklapse/dots/dist/**/*.{js,svelte}",
  ],
  theme: {
    extend: {},
  },
  plugins: [dotsUIPlugin()],
};
