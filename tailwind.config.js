/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--color-surface-alt) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        'accent-soft': 'rgb(var(--color-accent-soft) / <alpha-value>)',
        line: 'rgb(var(--color-line) / <alpha-value>)',
        nude: 'rgb(var(--color-nude) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        danger: 'rgb(var(--color-danger) / <alpha-value>)',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'fluid-xs': 'clamp(0.68rem, 0.66rem + 0.1vw, 0.75rem)',
        'fluid-sm': 'clamp(0.8rem, 0.77rem + 0.15vw, 0.875rem)',
        'fluid-base': 'clamp(0.9rem, 0.87rem + 0.18vw, 1rem)',
        'fluid-lg': 'clamp(1.05rem, 1rem + 0.3vw, 1.25rem)',
        'fluid-xl': 'clamp(1.3rem, 1.15rem + 0.7vw, 1.75rem)',
        'fluid-2xl': 'clamp(1.7rem, 1.4rem + 1.4vw, 2.75rem)',
        'fluid-3xl': 'clamp(2.1rem, 1.5rem + 2.6vw, 4rem)',
        'fluid-4xl': 'clamp(2.6rem, 1.5rem + 4.6vw, 6rem)',
        'fluid-hero': 'clamp(3rem, 1.2rem + 7.4vw, 9rem)',
      },
      letterSpacing: {
        luxe: '0.28em',
        wide: '0.12em',
      },
      spacing: {
        gutter: 'clamp(1.25rem, 4vw, 5rem)',
        section: 'clamp(3.5rem, 8vw, 9rem)',
      },
      maxWidth: {
        shell: '1600px',
        prose: '68ch',
      },
      aspectRatio: {
        portrait: '3 / 4',
        editorial: '4 / 5',
        cinema: '16 / 9',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.16, 1, 0.3, 1)',
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      transitionDuration: { 250: '250ms', 400: '400ms', 600: '600ms', 800: '800ms' },
      boxShadow: {
        soft: '0 1px 2px rgb(0 0 0 / 0.03), 0 12px 40px -18px rgb(0 0 0 / 0.14)',
        lift: '0 24px 70px -32px rgb(0 0 0 / 0.30)',
      },
      backgroundImage: {
        'gold-sheen':
          'linear-gradient(110deg, rgb(var(--color-accent) / 0) 20%, rgb(var(--color-accent) / 0.28) 50%, rgb(var(--color-accent) / 0) 80%)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
  plugins: [],
}
