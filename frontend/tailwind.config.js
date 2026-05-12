/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          950: '#0b0f19',
        },
        eco: {
          deep:    '#0a1f1a',
          forest:  '#0d3b2e',
          emerald: '#10b981',
          mint:    '#34d399',
          teal:    '#14b8a6',
          aqua:    '#06b6d4',
          lime:    '#a3e635',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      keyframes: {
        liquidFloat: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: '0.5' },
          '25%':      { transform: 'translate(30px, -50px) scale(1.1) rotate(5deg)', opacity: '0.6' },
          '50%':      { transform: 'translate(-20px, -80px) scale(0.95) rotate(-3deg)', opacity: '0.45' },
          '75%':      { transform: 'translate(40px, -30px) scale(1.05) rotate(7deg)', opacity: '0.55' },
        },
        liquidFloat2: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: '0.4' },
          '33%':      { transform: 'translate(-40px, 30px) scale(1.15) rotate(-8deg)', opacity: '0.5' },
          '66%':      { transform: 'translate(50px, -40px) scale(0.9) rotate(4deg)', opacity: '0.35' },
        },
        liquidFloat3: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1) rotate(0deg)', opacity: '0.35' },
          '50%':      { transform: 'translate(-30px, 50px) scale(1.08) rotate(-5deg)', opacity: '0.5' },
        },
        glassShimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.8', transform: 'scale(1.05)' },
        },
      },
      animation: {
        'liquid-1':     'liquidFloat 18s ease-in-out infinite',
        'liquid-2':     'liquidFloat2 22s ease-in-out infinite',
        'liquid-3':     'liquidFloat3 15s ease-in-out infinite',
        'glass-shimmer':'glassShimmer 3s ease-in-out infinite',
        'fade-slide-up':'fadeSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in':      'fadeIn 0.4s ease-out both',
        'pulse-glow':   'pulseGlow 2s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
