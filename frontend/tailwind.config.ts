import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkEmerald: {
          950: "#021411",
          900: "#06241C",
          850: "#082E24",
          800: "#0B3B2E",
          700: "#0F4D3C",
          600: "#14634E",
        },
        mint: {
          300: "#6EE7B7",
          400: "#4ADE9A",
          DEFAULT: "#4ADE9A",
          500: "#2DD4BF",
          accent: "#5EEAD4",
          glow: "#00F5A0",
        },
        gold: {
          DEFAULT: "#F5B942",
          light: "#FDE68A",
          glow: "#FBBF24",
        },
        coral: {
          DEFAULT: "#F2705A",
          light: "#F87171",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
        mintGlow: "0 0 25px rgba(94, 234, 212, 0.25)",
        goldGlow: "0 0 25px rgba(245, 185, 66, 0.25)",
        heroMockup: "0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(74, 222, 154, 0.2)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
