/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          950: "#090B0F",
          900: "#0D1016",
          850: "#11151C",
        },
        surface: {
          DEFAULT: "#151A22",
          elevated: "#1A202A",
          overlay: "#202733",
          border: "#232D3B",
          subtle: "#1B222D",
        },
        content: {
          primary: "#F4F7FB",
          secondary: "#A7B0BE",
          muted: "#6F7885",
        },
        cyan: {
          400: "#38BDF8",
          500: "#00C2FF",
          600: "#0284C7",
        },
        azure: {
          500: "#3B82F6",
          600: "#2563EB",
        },
        violet: {
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
        },
        fuchsia: {
          400: "#E879F9",
          500: "#D946EF",
          600: "#C026D3",
        },
        emerald: {
          400: "#34D399",
          500: "#22C55E",
          600: "#16A34A",
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706",
        },
        rose: {
          400: "#FB7185",
          500: "#F43F5E",
          600: "#E11D48",
        },
        critical: {
          400: "#FF5A5F",
          500: "#EF4444",
          600: "#DC2626",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        "playful": "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)",
        "playful-lg": "0 20px 40px -10px rgba(0, 0, 0, 0.12), 0 8px 16px -4px rgba(0, 0, 0, 0.06)",
        "glow-blue": "0 0 25px -5px rgba(59, 130, 246, 0.4)",
        "glow-purple": "0 0 25px -5px rgba(168, 85, 247, 0.4)",
        "glow-pink": "0 0 25px -5px rgba(244, 63, 94, 0.4)",
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.4)",
        "glow-emerald": "0 0 25px -5px rgba(16, 185, 129, 0.4)",
        "glow-cyan": "0 0 25px -5px rgba(6, 182, 212, 0.4)",
      },
      animation: {
        "float": "float 4s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradientX 6s ease infinite",
        "shimmer": "shimmer 2s infinite linear",
        "bounce-subtle": "bounceSubtle 2s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.75", transform: "scale(1.03)" },
        },
        gradientX: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-3px)" },
        },
      },
    },
  },
  plugins: [],
};
