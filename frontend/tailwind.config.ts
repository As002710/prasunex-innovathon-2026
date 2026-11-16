import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plum: {
          950: "#120714",
          900: "#1B0F1C",
          850: "#221224",
          800: "#2A142C",
          700: "#391A3C",
          600: "#4B2250",
        },
        pink: {
          DEFAULT: "#F28BA8",
          primary: "#F28BA8",
          light: "#F7A8BF",
          glow: "#FF9EBA",
        },
        amber: {
          DEFAULT: "#F2C46B",
          secondary: "#F2C46B",
          light: "#F7D692",
          glow: "#FFD07B",
        },
        sky: {
          DEFAULT: "#7CC8EE",
          info: "#7CC8EE",
          light: "#9BD5F2",
          glow: "#63BEEC",
        },
        mint: {
          DEFAULT: "#4ADE9A",
          good: "#4ADE9A",
          accent: "#5EEAD4",
          glow: "#00F5A0",
        },
        coral: {
          DEFAULT: "#F2705A",
          weak: "#F2705A",
          light: "#F87171",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Poppins", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(242, 139, 168, 0.15)",
        pinkGlow: "0 0 25px rgba(242, 139, 168, 0.3)",
        amberGlow: "0 0 25px rgba(242, 196, 107, 0.3)",
        skyGlow: "0 0 25px rgba(124, 200, 238, 0.3)",
        mintGlow: "0 0 25px rgba(74, 222, 154, 0.3)",
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
