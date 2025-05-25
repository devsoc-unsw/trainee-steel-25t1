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
        windDrift: {
          "0%, 100%": { transform: "translateY(0px) translateX(0px) rotate(0deg)" },
          "15%": { transform: "translateY(-5px) translateX(4px) rotate(1.5deg)" },
          "30%": { transform: "translateY(-10px) translateX(2px) rotate(0.5deg)" },
          "45%": { transform: "translateY(-6px) translateX(6px) rotate(2deg)" },
          "60%": { transform: "translateY(2px) translateX(4px) rotate(-0.5deg)" },
          "75%": { transform: "translateY(6px) translateX(-2px) rotate(-1.5deg)" },
          "90%": { transform: "translateY(3px) translateX(-5px) rotate(-1deg)" },
        },
        waterPulse: {
          "0%, 100%": { opacity: 0.3 },
          "50%": { opacity: 0.8 },
        },
        reflectionFloat: {
          "0%, 100%": { transform: "translateY(0px) scaleX(0.9) rotate(0deg)", opacity: 0.5 },
          "25%": { transform: "translateY(8px) scaleX(0.92) rotate(-1deg)", opacity: 0.6 },
          "75%": { transform: "translateY(-8px) scaleX(0.88) rotate(1deg)", opacity: 0.4 },
        },
        reflectionWind: {
          "0%, 100%": { transform: "translateY(0px) scaleX(0.9) rotate(0deg) skewX(0deg)", opacity: 0.4 },
          "15%": { transform: "translateY(5px) scaleX(0.92) rotate(-1.5deg) skewX(1deg)", opacity: 0.45 },
          "30%": { transform: "translateY(10px) scaleX(0.91) rotate(-0.5deg) skewX(0.5deg)", opacity: 0.5 },
          "45%": { transform: "translateY(6px) scaleX(0.93) rotate(-2deg) skewX(2deg)", opacity: 0.45 },
          "60%": { transform: "translateY(-2px) scaleX(0.9) rotate(0.5deg) skewX(1deg)", opacity: 0.4 },
          "75%": { transform: "translateY(-6px) scaleX(0.88) rotate(1.5deg) skewX(-0.5deg)", opacity: 0.35 },
          "90%": { transform: "translateY(-3px) scaleX(0.89) rotate(1deg) skewX(-1deg)", opacity: 0.4 },
        },
        ripple: {
          "0%": { transform: "scaleX(1) scaleY(1)", opacity: 0.7 },
          "100%": { transform: "scaleX(1.2) scaleY(1)", opacity: 0 },
        },
        rippleAlt: {
          "0%": { transform: "scaleX(0.8)", opacity: 0.4 },
          "100%": { transform: "scaleX(1.3)", opacity: 0 },
        },
        waveSlowA: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        waveSlowB: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        waveFast: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        waveMed: {
          "0%": { transform: "translateX(-80%)", opacity: 0.3 },
          "50%": { opacity: 0.7 },
          "100%": { transform: "translateX(80%)", opacity: 0.3 },
        },
        tinyWave1: {
          "0%": { opacity: 0, transform: "scaleX(0.7)" },
          "50%": { opacity: 1, transform: "scaleX(1.2)" },
          "100%": { opacity: 0, transform: "scaleX(0.7)" },
        },
        tinyWave2: {
          "0%": { opacity: 0.2, transform: "scaleX(1)" },
          "50%": { opacity: 0.8, transform: "scaleX(1.4)" },
          "100%": { opacity: 0.2, transform: "scaleX(1)" },
        },
        glisten1: {
          "0%": { opacity: 0.2, transform: "scale(0.6)" },
          "50%": { opacity: 1, transform: "scale(1.2)" },
          "100%": { opacity: 0.2, transform: "scale(0.6)" },
        },
        glisten2: {
          "0%": { opacity: 0.4, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.5)" },
          "100%": { opacity: 0.4, transform: "scale(1)" },
        },
        windGust1: {
          "0%": { opacity: 0, transform: "translateX(-100%) scaleY(0.5)" },
          "50%": { opacity: 0.3, transform: "translateX(20%) scaleY(1)" },
          "100%": { opacity: 0, transform: "translateX(100%) scaleY(0.5)" },
        },
        windGust2: {
          "0%": { opacity: 0, transform: "translateX(-30%) scaleY(0.5)" },
          "50%": { opacity: 0.2, transform: "translateX(30%) scaleY(1.2)" },
          "100%": { opacity: 0, transform: "translateX(120%) scaleY(0.5)" },
        },
        windGust3: {
          "0%": { opacity: 0, transform: "translateX(-80%) scaleY(0.7)" },
          "50%": { opacity: 0.25, transform: "translateX(0%) scaleY(1)" },
          "100%": { opacity: 0, transform: "translateX(80%) scaleY(0.7)" },
        },
        magicalFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg) scale(1)" },
          "20%": { transform: "translateY(-4px) rotate(1deg) scale(0.99)" },
          "40%": { transform: "translateY(-1px) rotate(-0.5deg) scale(1.01)" },
          "60%": { transform: "translateY(3px) rotate(-1deg) scale(1)" },
          "80%": { transform: "translateY(5px) rotate(0.5deg) scale(0.98)" },
        },
        glow: {
          "0%, 100%": { opacity: 0.5, transform: "scale(1)" },
          "50%": { opacity: 0.7, transform: "scale(1.05)" },
        },
        sparkle1: {
          "0%, 100%": { opacity: 0, transform: "translate(0, 0) scale(0)" },
          "50%": { opacity: 0.8, transform: "translate(-5px, -8px) scale(1)" },
        },
        sparkle2: {
          "0%, 100%": { opacity: 0, transform: "translate(0, 0) scale(0)" },
          "50%": { opacity: 1, transform: "translate(5px, -10px) scale(1.2)" },
        },
        sparkle3: {
          "0%, 100%": { opacity: 0, transform: "translate(0, 0) scale(0)" },
          "65%": { opacity: 0.9, transform: "translate(8px, 5px) scale(1.1)" },
        },
      },
      animation: {
        floating: "floating 4s ease-in-out infinite",
        windDrift: "windDrift 10s ease-in-out infinite",
        waterPulse: "waterPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        reflectionFloat: "reflectionFloat 4s ease-in-out infinite",
        reflectionWind: "reflectionWind 10s ease-in-out infinite",
        ripple: "ripple 2s ease-out infinite",
        rippleAlt: "rippleAlt 2.5s ease-out infinite 0.7s",
        waveSlowA: "waveSlowA 8s linear infinite",
        waveSlowB: "waveSlowB 10s linear infinite",
        waveFast: "waveFast 5s linear infinite",
        waveMed: "waveMed 7s ease-in-out infinite",
        tinyWave1: "tinyWave1 3s ease-in-out infinite",
        tinyWave2: "tinyWave2 4s ease-in-out infinite 1s",
        glisten1: "glisten1 4s ease-in-out infinite 0.5s",
        glisten2: "glisten2 3s ease-in-out infinite 1.2s",
        windGust1: "windGust1 7s ease-in-out infinite",
        windGust2: "windGust2 9s ease-in-out infinite 2s",
        windGust3: "windGust3 8s ease-in-out infinite 4s",
        magicalFloat: "magicalFloat 6s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        sparkle1: "sparkle1 4s ease-out infinite 0.5s",
        sparkle2: "sparkle2 5s ease-out infinite 1.2s",
        sparkle3: "sparkle3 4.5s ease-out infinite 2s",
      },
    },
  },
  plugins: [],
}