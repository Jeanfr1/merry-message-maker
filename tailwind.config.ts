import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        christmas: {
          red: "#C41E3A",
          green: "#165B33",
          gold: "#FFD700",
          snow: "#FFFAFA",
          pine: "#2C5530",
        },
      },
      keyframes: {
        snowfall: {
          "0%": { transform: "translateY(-10px)" },
          "100%": { transform: "translateY(100vh)" },
        },
      },
      animation: {
        snowfall: "snowfall 5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
