import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#07090f",
          900: "#0b111d",
          800: "#111827"
        },
        ink: "#f6f7fb",
        mist: "#98a2b3",
        slate: "#1f2937",
        accent: {
          400: "#6ea8ff",
          500: "#4f8dff"
        },
        gold: "#d3b06f"
      },
      boxShadow: {
        soft: "0 10px 40px rgba(8, 12, 22, 0.35)",
        glow: "0 0 0 1px rgba(110, 168, 255, 0.2), 0 30px 70px rgba(34, 91, 185, 0.18)"
      },
      borderRadius: {
        xl2: "1.25rem"
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.8" }
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        }
      },
      animation: {
        "pulse-glow": "pulse-glow 7s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
