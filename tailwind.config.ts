import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#1b1f45",
          800: "#262b5c",
          700: "#363c78"
        },
        orange: {
          DEFAULT: "#e2833f",
          dark: "#c96f2e",
          light: "#f6e3d2"
        }
      },
      borderRadius: {
        card: "14px"
      },
      boxShadow: {
        card: "0 1px 2px rgba(27,31,69,.04), 0 8px 24px rgba(27,31,69,.05)"
      }
    }
  },
  plugins: []
};

export default config;
