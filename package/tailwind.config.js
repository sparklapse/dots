import { dotsUI } from "./lib/ui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./{src,lib}/**/*.{js,ts,svelte}"],
  theme: {
    extend: {},
  },
  plugins: [dotsUI],
};
