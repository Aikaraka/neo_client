import type { Config } from "tailwindcss";
import tailwindAnimatePlugin from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        slideDown: {
          from: { "max-height": "0px" },
          to: { "max-height": "var(--radix-accordion-content-height)" },
        },
        slideUp: {
          from: { "max-height": "var(--radix-accordion-content-height)" },
          to: { "max-height": "0px" },
        },
        rotateHalf: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
      },
      animation: {
        "accordion-down": "slideDown 0.2s ease-out",
        "accordion-up": "slideUp 0.2s ease-out",
        rotateChevron: "rotateHalf 300ms cubic-bezier(0.87, 0, 0.13, 1)",
      },
      transitionTimingFunction: {
        "accordion-ease": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
      boxShadow: {
        bookShelf: "0px 4px 24px 7px rgba(85, 69, 58, 0.19)",
      },
      backgroundImage: {
        neo: "var(--neo)",
      },
      colors: {
        background: "hsl(var(--background))",
        bookshelf: {
          background: "hsl(var(--bookshelf-background))",
        },
        foreground: "hsl(var(--foreground))",
        buttonHover: "var(--buttonHover)",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    tailwindAnimatePlugin,
    function ({ addUtilities }) {
      addUtilities({
        ".text-neo": {
          background: "var(--neo)",
          "-webkit-background-clip": "text",
          "-webkit-text-fill-color": "transparent",
        },
        ".stroke-neo": {
          stroke: "var(--neo)",
        },
        ".fill-neo": {
          fill: "var(--neo)",
        },
      });
    },
  ],
};
export default config;
