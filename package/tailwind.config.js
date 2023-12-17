import { dotsUIPlugin } from "./src/lib/ui/tailwind";

/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {},
  },
  plugins: [dotsUIPlugin()],
};
