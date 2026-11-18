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
        // Primary Burgundy & Dark Wine Theme
        burgundy: {
          950: "#120206",
          900: "#1B040A",
          850: "#24060E",
          800: "#2E0813",
          750: "#380B18",
          700: "#440E1E",
          600: "#551227",
          500: "#701A33",
          DEFAULT: "#2E0813",
        },
        // Royal Metallic Gold Palette for borders, accents & buttons
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#F5C542",
          DEFAULT: "#D4AF37",
          500: "#D4AF37",
          600: "#B8860B",
          700: "#926B08",
          glow: "rgba(212, 175, 55, 0.40)",
          border: "rgba(212, 175, 55, 0.35)",
        },
        // Backward-compatible alias mapping to Burgundy
        darkEmerald: {
          950: "#120206",
          900: "#1B040A",
          850: "#24060E",
          800: "#2E0813",
          700: "#380B18",
          600: "#440E1E",
        },
        // Backward-compatible alias mapping to Royal Gold
        mint: {
          100: "#FEF3C7",
          200: "#FDE68A",
          300: "#FCD34D",
          400: "#F5C542",
          DEFAULT: "#D4AF37",
          500: "#D4AF37",
          accent: "#FDE68A",
          glow: "#D4AF37",
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
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(212, 175, 55, 0.25)",
        goldGlow: "0 0 25px rgba(212, 175, 55, 0.35)",
        mintGlow: "0 0 25px rgba(212, 175, 55, 0.35)",
        heroMockup: "0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 40px rgba(212, 175, 55, 0.25)",
        goldBorder: "0 0 0 1px rgba(212, 175, 55, 0.4), 0 0 18px rgba(212, 175, 55, 0.2)",
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
