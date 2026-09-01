/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          1: '#05070C',
          2: '#0A0D12',
          3: '#0F131C',
          4: '#161D2B',
          5: '#1E2636',
        },
        accent: {
          primary: '#38BDF8',
          muted: '#1E40AF',
        }
      },
      borderRadius: {
        pill: '999px',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'spin': 'spin 1s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(56, 189, 248, 0.15)',
        'glow-lg': '0 0 40px rgba(56, 189, 248, 0.2)',
      }
    },
  },
  plugins: [],
}
