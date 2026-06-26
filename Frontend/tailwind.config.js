/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          0: 'rgb(var(--color-bg-0) / <alpha-value>)',
          1: 'rgb(var(--color-bg-1) / <alpha-value>)',
          2: 'rgb(var(--color-bg-2) / <alpha-value>)',
        },
        violet: {
          900: 'rgb(var(--color-violet-900) / <alpha-value>)',
          800: 'rgb(var(--color-violet-800) / <alpha-value>)',
          700: 'rgb(var(--color-violet-700) / <alpha-value>)',
          600: 'rgb(var(--color-violet-600) / <alpha-value>)',
          500: 'rgb(var(--color-violet-500) / <alpha-value>)',
          400: 'rgb(var(--color-violet-400) / <alpha-value>)',
          300: 'rgb(var(--color-violet-300) / <alpha-value>)',
          200: 'rgb(var(--color-violet-200) / <alpha-value>)',
        },
        neon: 'rgb(var(--color-neon) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          dim: 'rgb(var(--color-ink-dim) / <alpha-value>)',
          faint: 'rgb(var(--color-ink-faint) / <alpha-value>)',
        },
        line: 'var(--color-line)',
        line2: 'var(--color-line-strong)',
      },
      fontFamily: {
        display: ['"Syne"', 'system-ui', 'sans-serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'cosmos-gradient':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(122,59,255,.35), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 30%, rgba(192,132,255,.18), transparent 65%), radial-gradient(ellipse 70% 40% at 10% 80%, rgba(61,26,140,.35), transparent 70%), linear-gradient(180deg, #06030f 0%, #0a0520 50%, #06030f 100%)',
        'glow-violet': 'radial-gradient(circle at center, rgba(122,59,255,.5), transparent 70%)',
      },
      boxShadow: {
        glow: '0 0 60px rgba(122,59,255,.45)',
        'glow-lg': '0 0 120px rgba(122,59,255,.55)',
        'glow-sm': '0 0 30px rgba(122,59,255,.35)',
        inset: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
      },
      animation: {
        float: 'float 8s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
        'pulse-slow': 'pulse 5s ease-in-out infinite',
        drift: 'drift 60s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
        'scroll-left': 'scroll-left 25s linear infinite',
        'scroll-right': 'scroll-right 25s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%': { transform: 'translate3d(0,0,0)' },
          '100%': { transform: 'translate3d(-400px,-400px,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'scroll-left': {
          from: { transform: 'translateX(0)' },
          to:   { transform: 'translateX(-50%)' },
        },
        'scroll-right': {
          from: { transform: 'translateX(-50%)' },
          to:   { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
