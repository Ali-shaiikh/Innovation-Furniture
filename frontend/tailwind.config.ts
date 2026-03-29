import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream:     "var(--cream)",
        gold:      "var(--gold)",
        "deep-gold": "var(--deep-gold)",
        brown:     "var(--brown)",
        charcoal:  "var(--charcoal)",
        "warm-white": "var(--warm-white)",
        muted:     "var(--muted)",
        "dark-bg": "var(--dark-bg)",
      },
      fontFamily: {
        serif:  ["var(--font-cormorant)", "Georgia", "serif"],
        sans:   ["var(--font-jost)", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "480px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      letterSpacing: {
        luxury: "0.2em",
        wide2:  "0.15em",
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
        800: "800ms",
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/4": "3 / 4",
      },
    },
  },
  plugins: [
    // scrollbar-hide utility for the library collection mobile shelf scroll
    function ({ addUtilities }: { addUtilities: (u: Record<string, Record<string, string>>) => void }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none",
        },
      });
    },
  ],
};

export default config;
