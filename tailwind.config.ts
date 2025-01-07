import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#131b27",
        foreground: "var(--foreground)",
        federalBlue: "#000C56",
        charcoal: "#36465F",
        roseQuartz: "#AC9AC9C",
        silver: "#C0B4AB",
        alabaster: "#E9E4DB"
      },
    },
  },
  plugins: [],
} satisfies Config;
