/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        neutral: {
          "50": "hsl(var(--neutral-50))",
          "400": "rgb(163, 163, 163)",
          "600": "hsl(var(--neutral-600))",
          "700": "hsl(var(--neutral-700))",
          "800": "rgb(38, 38, 38)",
          "900": "#171717",
          "950": "#0a0a0a",
          default: "hsl(var(--neutral))",
        },
        green: {
          "100": "rgb(46, 174, 92)",
          "900": "var(--green-900)",
        },
        red: {
          "100": "rgb(232, 82, 95)",
          "900": "var(--red-900)",
        },
        chart: {
          "dark-purple": "rgb(57, 53, 102)",
          brown: "rgb(102, 68, 53)",
          orange: "rgb(225, 127, 56)",
          red: "rgb(214, 42, 73)",
          "emerald-green": "rgb(0, 148, 93)",
          blue: "rgb(26, 115, 232)",
          "light-red": "rgb(214, 42, 73)",
          gray: "rgb(118, 119, 122)",
          purple: "rgb(135, 66, 222)",
          teal: "rgb(12, 163, 150)",
          fuchsia: "rgb(167, 29, 112)",
        },
        "header-background": "`var(--header-background)`",
        sidebar: {
          DEFAULT: "#171717",
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
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".bg-stripes": {
          backgroundImage:
            "linear-gradient(-45deg, var(--stripes-color) 12.50%, transparent 12.50%, transparent 50%, var(--stripes-color) 50%, var(--stripes-color) 62.50%, transparent 62.50%, transparent 100%)",
          backgroundSize: "6px 6px",
        },

        ".bg-stripes-red-950": {
          "--stripes-color": "rgb(69, 10, 10)",
        },

        ".bg-stripes-green-950": {
          "--stripes-color": "rgb(5, 46, 22)",
        },

        ".bg-stripes-blue-950": {
          "--stripes-color": "rgb(23, 37, 84)",
        },
      });
    }),
  ],
} satisfies Config;

export default config;
