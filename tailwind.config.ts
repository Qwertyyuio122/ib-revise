import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'surface-canvas': '#0e0e11',
        'surface-card': '#141419',
        'surface-raised': '#1b1b22',
        'border-subtle': '#23232a',
        'text-primary': '#f4f4f6',
        'text-secondary': '#9ca3af',
        'accent-blush': '#f4a7b9',
        'accent-blush-glow': 'rgba(244, 167, 185, 0.12)',
        'accent-rose-hover': '#ffd2dc',
      },
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
      boxShadow: {
        'blush-bloom': '0 8px 24px -4px rgba(244, 167, 185, 0.25)',
        'blush-halo': '0 0 0 1px rgba(244, 167, 185, 0.35), 0 12px 32px -8px rgba(0, 0, 0, 0.5)',
      },
    },
  },
  plugins: [],
};

export default config;
