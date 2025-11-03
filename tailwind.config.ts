import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Retro ski jacket inspired colors
        teal: {
          DEFAULT: "#20B2AA",
          light: "#5FD4D1",
          dark: "#178B85",
        },
        purple: {
          DEFAULT: "#9370DB",
          light: "#B399E8",
          dark: "#7B5BC4",
        },
        royal: {
          DEFAULT: "#4169E1",
          light: "#6B8AE8",
          dark: "#2F4FBD",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-space-mono)",
          "Space Mono",
          "Courier New",
          "monospace",
        ],
        mono: [
          "var(--font-courier-prime)",
          "Courier Prime",
          "Courier New",
          "monospace",
        ],
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
