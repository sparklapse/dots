/**
 * You can't use tailwind in your components! (Due to shadow dom)
 *
 * Tailwind is here for a consistent css reset and some utility classes
 * on the dev server.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html"],
  theme: {
    extend: {},
  },
  plugins: [],
};
