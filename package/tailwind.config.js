import { dotsUI } from "./src/lib/ui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,svelte}"],
  theme: {
    extend: {},
  },
  plugins: [dotsUI],
};
