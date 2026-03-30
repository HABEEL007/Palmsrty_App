import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        primary: {
          DEFAULT: '#7C3AED',
          neon: '#7C3AED',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          glow: '#06B6D4',
        },
        accent: '#F59E0B',
        surface: '#141827',
        border: '#1E2840',
        text: '#E5E7EB',
        muted: '#6B7280',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'neon-primary': '0 0 20px rgba(124, 58, 237, 0.4)',
        'neon-secondary': '0 0 20px rgba(6, 182, 212, 0.4)',
      },
      keyframes: {
        'bg-shift': {
          '0%, 100%': { background: '#0B0F1A' },
          '50%': { background: '#0F172A' },
        },
      },
      animation: {
        'bg-shift': 'bg-shift 10s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
