/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'navy-900': '#0a192f',
        'navy-800': '#112240',
        'accent-blue': '#2563eb',
        'grad-start': '#0f172a',
        'grad-end': '#1e3a8a'
      },
      borderRadius: {
        '2xl': '1rem'
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft-lg': '0 10px 30px rgba(2,6,23,0.6), 0 2px 6px rgba(2,6,23,0.4)'
      }
    }
  },
  plugins: [],
}
