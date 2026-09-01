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
      }
    },
  },
  plugins: [],
}
