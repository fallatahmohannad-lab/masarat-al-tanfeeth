/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'IBM Plex Sans Arabic', 'Tajawal', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        // Primary action color
        cyan: {
          50: '#e7f8fc',
          100: '#c8eff8',
          200: '#9ee3f1',
          400: '#1fc2e3',
          500: '#00B4DB', // primary
          600: '#0096ba',
          700: '#0a7894',
        },
        // Deep teal — text / headings / icons ONLY (never large fills)
        teal: {
          900: '#0F2027',
          800: '#163844',
          700: '#1E5F74',
          600: '#2c7c95',
          400: '#5a9fb3',
        },
        // Status
        ok: { 50: '#e8f7f1', 100: '#cdeee1', 500: '#1D9E75', 600: '#178561' },
        warn: { 50: '#fdf3e3', 100: '#fbe6c4', 500: '#EF9F27', 600: '#cf851a' },
        bad: { 50: '#fcecec', 100: '#f8d6d5', 500: '#E24B4A', 600: '#c63a39' },
        // Surfaces
        page: '#F4F6F9',
        line: '#E2E8EB',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15,32,39,0.04), 0 6px 18px rgba(15,32,39,0.06)',
        lift: '0 2px 6px rgba(15,32,39,0.06), 0 12px 30px rgba(15,32,39,0.10)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        grow: {
          '0%': { width: '0%' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.35s ease-out',
        pop: 'pop 0.25s ease-out',
      },
    },
  },
  plugins: [],
}
