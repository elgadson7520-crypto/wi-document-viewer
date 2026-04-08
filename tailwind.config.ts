import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        packers: {
          green: "#203731",
          "green-light": "#2a4a3f",
          "green-dark": "#1a2d28",
          gold: "#FFB612",
          "gold-light": "#FFC940",
          "gold-dark": "#E5A310",
        },
        background: "#f5f5f0",
      },
    },
  },
  plugins: [],
};
export default config;
