import plugin from "tailwindcss/plugin.js";

/**
 * Colors Reference (https://coolors.co/ffe0f2-b5dfca-705d56):
 *   Primary - #FFE0F2
 *   Secondary - #B5DFCA
 *   Greys - #705D56
 */
export const dotsUIPlugin = plugin.withOptions(
  () => {
    return ({ addComponents, theme }) => {
      addComponents({
        // Utils
        ".stable-gutter": {
          scrollbarGutter: "stable both-edges",
        },
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
        },
        ".text-sideways": {
          textOrientation: "mixed",
          writingMode: "sideways-lr",
        },
        ".text-sideways-lr": {
          writingMode: "sideways-lr",
        },
        ".text-sideways-rl": {
          writingMode: "sideways-rl",
        },
        // Backgrounds
        ".dots-bg": {
          background: `linear-gradient(45deg, ${theme("colors.dots-coffee.50")} 0%, ${theme(
            "colors.dots-coffee.100",
          )} 100%)`,
        },
        // Buttons
        ".dots-btn": {
          display: "flex-inline",
          justifyContent: "center",
          alignItems: "center",
          height: "fit-content",
          padding: "0.25rem 1rem",
          borderRadius: "0.25rem",
          backgroundColor: "white",
          boxShadow:
            "-0.1rem 0.1rem 0.25rem var(--dots-btn-clr-s), 0.05rem -0.05rem 0.1rem var(--dots-btn-clr-h)",
          // Default to greys
          "--dots-btn-clr-s": theme("colors.dots-coffee.100"),
          "--dots-btn-clr-h": theme("colors.dots-coffee.50"),
        },
        ".dots-btn-sm": {
          fontSize: "0.833rem",
          padding: "0.125rem 0.5rem",
        },
        ".dots-btn-lg": {
          fontSize: "1.25rem",
          padding: "0.5rem 1.5rem",
        },
        ".dots-btn-outline": {
          backgroundColor: "var(--dots-btn-clr-h)",
          border: "2px solid var(--dots-btn-clr-s)",
          boxShadow: "none",
        },
        ".dots-btn-maceron": {
          color: theme("colors.dots-maceron.800"),
          "--dots-btn-clr-s": theme("colors.dots-maceron.100"),
          "--dots-btn-clr-h": theme("colors.dots-maceron.50"),
        },
        ".dots-btn-tea": {
          color: theme("colors.dots-tea.800"),
          "--dots-btn-clr-s": theme("colors.dots-tea.100"),
          "--dots-btn-clr-h": theme("colors.dots-tea.50"),
        },
        //Inputs
        ".dots-input": {
          padding: "0 0.5rem",
          borderRadius: "0.25rem",
          border: `1px solid ${theme("colors.dots-coffee.100")}`,
          boxShadow: `0 0 0.15rem rgba(255, 255, 255, 0.25), inset 0 0 0.25rem rgba(0, 0, 0, 0.05)`,
          "&:not([type=checkbox]):not([type=radio]):not(textarea)": {
            backgroundColor: "white",
          },
          "&[type=number]": {
            appearance: "textfield",
            textAlign: "right",
            fontVariantNumeric: "tabular-nums",
          },
          "&[type=password]": {},
        },
        // Cards
        ".dots-card": {
          padding: "1rem",
          borderRadius: "0.5rem",
          backgroundColor: "white",
          border: `2px solid ${theme("colors.dots-coffee.100")}`,
          boxShadow: `-0.1rem 0.1rem 0.5rem ${theme("colors.dots-coffee.50")}`,
        },
        ".dots-card-maceron": {
          color: theme("colors.dots-maceron.800"),
          boxShadow: `-0.1rem 0.1rem 0.5rem ${theme("colors.dots-maceron.50")}`,
          border: `2px solid ${theme("colors.dots-maceron.100")}`,
          background: `linear-gradient(45deg, white 0%, ${theme("colors.dots-maceron.50")} 100%)`,
        },
        ".dots-card-tea": {
          color: theme("colors.dots-tea.800"),
          boxShadow: `-0.1rem 0.1rem 0.5rem ${theme("colors.dots-tea.50")}`,
          border: `2px solid ${theme("colors.dots-tea.100")}`,
          background: `linear-gradient(45deg, white 0%, ${theme("colors.dots-tea.50")} 100%)`,
        },
      });
    };
  },
  () => ({
    content: ["./node_modules/@sparklapse/dots/**/*.{js,svelte}"],
    theme: {
      extend: {
        colors: {
          "dots-maceron": {
            50: "hsl(326, 70%, 95%)",
            100: "hsl(325, 60%, 91%)",
            200: "hsl(325, 50%, 82%)",
            300: "hsl(325, 40%, 73%)",
            400: "hsl(325, 40%, 64%)",
            500: "hsl(325, 40%, 55%)",
            600: "hsl(325, 40%, 46%)",
            700: "hsl(325, 40%, 37%)",
            800: "hsl(325, 40%, 28%)",
            900: "hsl(326, 40%, 19%)",
            950: "hsl(326, 40%, 10%)",
          },
          "dots-tea": {
            50: "hsl(147, 39%, 95%)",
            100: "hsl(150, 40%, 91%)",
            200: "hsl(150, 40%, 82%)",
            300: "hsl(150, 40%, 73%)",
            400: "hsl(150, 40%, 64%)",
            500: "hsl(150, 40%, 55%)",
            600: "hsl(150, 40%, 46%)",
            700: "hsl(150, 40%, 37%)",
            800: "hsl(150, 40%, 28%)",
            900: "hsl(150, 40%, 19%)",
            950: "hsl(153, 39%, 10%)",
          },
          "dots-coffee": {
            50: "hsl(20, 13%, 95%)",
            100: "hsl(13, 13%, 91%)",
            200: "hsl(19, 14%, 82%)",
            300: "hsl(16, 14%, 73%)",
            400: "hsl(16, 13%, 64%)",
            500: "hsl(16, 13%, 55%)",
            600: "hsl(16, 13%, 46%)",
            700: "hsl(16, 14%, 37%)",
            800: "hsl(15, 14%, 28%)",
            900: "hsl(20, 13%, 19%)",
            950: "hsl(20, 13%, 10%)",
          },
        },
      },
    },
  }),
);
