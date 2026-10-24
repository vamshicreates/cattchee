/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        baba: {
          orange: '#FF5E00',
          darkOrange: '#E04800',
          amber: '#FF9500',
          brown: '#5C1D0D',
          cream: '#FFF7F0',
          maroon: '#421208',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        cursive: ['Caveat', 'Patrick Hand', 'cursive'],
        display: ['Montserrat', 'Inter', 'sans-serif']
      },
      keyframes: {
        'bounce-short': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' }
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px rgba(255, 94, 0, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(255, 94, 0, 0.8)' }
        },
        'squish': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.2, 0.8)' },
          '100%': { transform: 'scale(1)' }
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-6px)' },
          '40%, 80%': { transform: 'translateX(6px)' }
        }
      },
      animation: {
        'bounce-short': 'bounce-short 1.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'squish': 'squish 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'shake': 'shake 0.4s ease-in-out'
      }
    },
  },
  plugins: [],
}
