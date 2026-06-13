import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A56DB",
          50: "#EEF3FD",
          100: "#D5E3FA",
          500: "#1A56DB",
          600: "#1547C0",
          700: "#1038A0",
        },
        accent: {
          green: "#16A34A",
          gold: "#F59E0B",
          purple: "#7C3AED",
        },
        background: "#F8FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        dark: "#0F172A",
        muted: "#94A3B8",
        premium: "#7C3AED",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        serif: ["var(--font-source-serif)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.04)",
        "card-hover":
          "0 4px 12px 0 rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06)",
        modal: "0 20px 60px rgba(0,0,0,0.15)",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "spin-slow": "spin 3s linear infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
