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
      },
      keyframes: {
        floating: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "25%": { transform: "translateY(-8px) rotate(1deg)" },
          "75%": { transform: "translateY(8px) rotate(-1deg)" },
        },
        waterPulse: {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 0.8 },
        },
      },
      animation: {
        floating: "floating 4s ease-in-out infinite",
        waterPulse: "waterPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
}