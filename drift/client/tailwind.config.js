/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        drift: {
          orange: '#FCBB6D',
          pink: '#D8737F',
          mauve: '#AB6C82',
          purple: '#685D79',
          blue: '#475C7A',
        }
      }
    },
  },
  plugins: [],
} 