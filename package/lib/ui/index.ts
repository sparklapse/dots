import plugin from "tailwindcss/plugin";

/**
 * Colors Reference (https://coolors.co/ffe0f2-b5dfca-705d56):
 *   Primary - #FFE0F2
 *   Secondary - #B5DFCA
 *   Greys - #705D56
 */
export const dotsUI = plugin(
  ({ addComponents, theme }) => {
    addComponents({
      // Utils
      ".stable-gutter": {
        scrollbarGutter: "stable both-edges",
      },
      // Backgrounds
      ".dots-bg": {
        background: `linear-gradient(45deg, ${theme("colors.dots-g.50")} 0%, ${theme(
          "colors.dots-g.100",
        )} 100%)`,
      },
      // Buttons
      ".dots-btn": {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "fit-content",
        padding: "0.25rem 1rem",
        borderRadius: "0.25rem",
        backgroundColor: "white",
        boxShadow:
          "-0.1rem 0.1rem 0.25rem var(--dots-btn-clr-s), 0.05rem -0.05rem 0.1rem var(--dots-btn-clr-h)",
        // Default to greys
        "--dots-btn-clr-s": theme("colors.dots-g.100"),
        "--dots-btn-clr-h": theme("colors.dots-g.50"),
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
      ".dots-btn-p": {
        "--dots-btn-clr-s": theme("colors.dots-p.100"),
        "--dots-btn-clr-h": theme("colors.dots-p.50"),
      },
      ".dots-btn-s": {
        "--dots-btn-clr-s": theme("colors.dots-s.100"),
        "--dots-btn-clr-h": theme("colors.dots-s.50"),
      },
      //Inputs
      ".dots-input": {
        padding: "0 0.5rem",
        borderRadius: "0.25rem",
        border: `1px solid ${theme("colors.dots-g.100")}`,
        boxShadow: `0 0 0.15rem rgba(255, 255, 255, 0.25), inset 0 0 0.25rem rgba(0, 0, 0, 0.05)`,
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
        border: `2px solid ${theme("colors.dots-g.100")}`,
        boxShadow: `-0.1rem 0.1rem 0.5rem ${theme("colors.dots-g.50")}`,
      },
      ".dots-card-feature-p": {
        boxShadow: `-0.1rem 0.1rem 0.5rem ${theme("colors.dots-p.50")}`,
        border: `2px solid ${theme("colors.dots-p.100")}`,
        background: `linear-gradient(45deg, white 0%, ${theme("colors.dots-p.50")} 100%)`,
      },
      ".dots-card-feature-s": {
        boxShadow: `-0.1rem 0.1rem 0.5rem ${theme("colors.dots-s.50")}`,
        border: `2px solid ${theme("colors.dots-s.100")}`,
        background: `linear-gradient(45deg, white 0%, ${theme("colors.dots-s.50")} 100%)`,
      },
    });
  },
  {
    theme: {
      extend: {
        colors: {
          "dots-p": {
            50: "hsl(326, 70%, 95%)",
            100: "hsl(325, 60%, 86%)",
            200: "hsl(325, 50%, 77%)",
            300: "hsl(325, 40%, 68%)",
            400: "hsl(325, 40%, 59%)",
            500: "hsl(325, 40%, 50%)",
            600: "hsl(325, 40%, 41%)",
            700: "hsl(325, 40%, 32%)",
            800: "hsl(325, 40%, 23%)",
            900: "hsl(326, 40%, 14%)",
            950: "hsl(326, 40%, 5%)",
          },
          "dots-s": {
            50: "hsl(147, 39%, 95%)",
            100: "hsl(150, 40%, 86%)",
            200: "hsl(150, 40%, 77%)",
            300: "hsl(150, 40%, 68%)",
            400: "hsl(150, 40%, 59%)",
            500: "hsl(150, 40%, 50%)",
            600: "hsl(150, 40%, 41%)",
            700: "hsl(150, 40%, 32%)",
            800: "hsl(150, 40%, 23%)",
            900: "hsl(150, 40%, 14%)",
            950: "hsl(153, 39%, 5%)",
          },
          "dots-g": {
            50: "hsl(20, 13%, 95%)",
            100: "hsl(13, 13%, 86%)",
            200: "hsl(19, 14%, 77%)",
            300: "hsl(16, 14%, 68%)",
            400: "hsl(16, 13%, 59%)",
            500: "hsl(16, 13%, 50%)",
            600: "hsl(16, 13%, 41%)",
            700: "hsl(16, 14%, 32%)",
            800: "hsl(15, 14%, 23%)",
            900: "hsl(20, 13%, 14%)",
            950: "hsl(20, 13%, 5%)",
          },
        },
      },
    },
  },
);
