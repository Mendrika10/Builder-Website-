import type { Config } from "tailwindcss";

/**
 * Design tokens — source de vérité d'implémentation.
 * Spécification : docs/design/art-direction.md (palette « Ivoire & Indigo »,
 * duo Sora/Inter, base 4px, radius 10/14/999, ombres minimales).
 * Toute valeur ici est un token ; aucune valeur arbitraire dans le code.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Palette primaire (indigo) — actions, liens, focus
        primary: {
          50: "#EEF2FF",
          100: "#E0E7FF",
          200: "#C7D2FE",
          300: "#A5B4FC",
          400: "#818CF8",
          500: "#6366F1",
          600: "#4F46E5", // main
          700: "#4338CA",
          800: "#3730A3",
          900: "#312E81",
        },
        // Neutres (ivoire → encre) — fonds, textes, bordures
        neutral: {
          50: "#FAFAF9", // fond application (ivoire)
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524", // texte principal
          900: "#1C1917", // titres / dark
        },
        // Sémantiques
        success: "#16A34A",
        warning: "#D97706",
        danger: "#E11D48",
        info: "#0284C7",
        // Surfaces
        surface: {
          page: "#FAFAF9",
          card: "#FFFFFF",
          sunken: "#F5F5F4",
          dark: "#1C1917",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        // Échelle art-direction.md §4.2 (leadings intégrés)
        display: ["4.5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
        h1: ["3rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h2: ["2.25rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        h3: ["1.5rem", { lineHeight: "1.3" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      borderRadius: {
        input: "10px",
        card: "14px",
      },
      boxShadow: {
        resting: "0 1px 2px rgb(0 0 0 / 0.05)",
        raised: "0 4px 12px rgb(0 0 0 / 0.08)",
      },
      transitionDuration: {
        fast: "150ms",
        base: "250ms",
        slow: "400ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
