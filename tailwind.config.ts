import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores institucionales UNA Puno
        'una-red': '#8B1538',
        'una-red-light': '#A91D45',
        'una-red-dark': '#6B1029',
        'una-gold': '#D4A017',
        'una-gold-light': '#F5C518',
        'una-gold-dark': '#B8860B',
        'una-blue': '#1565C0',
        'una-blue-light': '#1E88E5',
        'una-blue-dark': '#0D47A1',
        'una-cyan': '#00ACC1',
        'una-cyan-light': '#26C6DA',
        'una-green': '#1B5E20',
        'una-green-light': '#2E7D32',
        // Fondos oscuros elegantes
        'dark-bg': '#0D1117',
        'dark-card': '#161B22',
        'dark-elevated': '#1C2128',
        'dark-border': '#30363D',
        // Glass effects
        'glass': 'rgba(255, 255, 255, 0.03)',
        'glass-border': 'rgba(255, 255, 255, 0.08)',
        'glass-light': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        display: ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(212, 160, 23, 0.4)',
        'glow-red': '0 0 20px rgba(139, 21, 56, 0.4)',
        'glow-blue': '0 0 20px rgba(21, 101, 192, 0.4)',
        'glow-cyan': '0 0 20px rgba(0, 172, 193, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-una': 'linear-gradient(135deg, #8B1538 0%, #D4A017 50%, #1565C0 100%)',
        'gradient-gold': 'linear-gradient(135deg, #D4A017 0%, #F5C518 50%, #D4A017 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(212, 160, 23, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(212, 160, 23, 0.6)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
