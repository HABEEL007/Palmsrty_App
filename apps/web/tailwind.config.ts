/**
 * @file tailwind.config.ts
 * @description Centralized configuration for Tailwind styling system.
 * Defines project custom theme, colors, and accessibility plugins.
 */

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F1A',
        surface: '#141827',
        primary: {
          DEFAULT: '#7C3AED',
          neon: '#9333EA',
          glow: 'rgba(124, 58, 237, 0.4)',
        },
        secondary: {
          DEFAULT: '#06B6D4',
          glow: '#22D3EE',
        },
        accent: {
          DEFAULT: '#F59E0B',
          muted: '#D97706',
        },
        muted: '#9CA3AF',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'outfit': ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 20px rgba(124, 58, 237, 0.4)',
        'secondary': '0 0 20px rgba(6, 182, 212, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
