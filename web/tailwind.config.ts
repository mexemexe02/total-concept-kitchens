import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "hero-aurora": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(6%, 5%) scale(1.06)" },
        },
        "hero-aurora-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(-5%, -4%) scale(1.08)" },
        },
        "mise-dot": {
          "0%, 80%, 100%": { transform: "scale(0.65)", opacity: "0.45" },
          "40%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "hero-aurora": "hero-aurora 22s ease-in-out infinite",
        "hero-aurora-slow": "hero-aurora-slow 28s ease-in-out infinite",
        "mise-dot": "mise-dot 1.15s ease-in-out infinite",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        cream: "#f7f5f0",
        charcoal: "#1c1b19",
        bronze: "#9a7b4f",
        "bronze-light": "#c4a574",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: [
          "var(--font-display)",
          "var(--font-geist-sans)",
          "Georgia",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
