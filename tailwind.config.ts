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
        background: "var(--background)",
        foreground: "var(--foreground)",
        "space-bg": "#050816",
        "space-deep": "#0B0C10",
        "space-surface": "#111827",
        "accent-cyan": "#66FCF1",
        "accent-purple": "#9D4EDD",
        "accent-blue": "#4F46E5",
      },
      fontFamily: {
        poppins: ["var(--font-poppins)"],
        roboto: ["var(--font-roboto)"],
        space: ["var(--font-space-grotesk)"],
      },
    },
  },
  plugins: [],
};
export default config;
