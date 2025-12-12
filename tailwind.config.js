/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: '#ccff00', // Lime Acid
        darkbg: '#0a0a0a',
        cardbg: '#121212',
      }
    },
  },
  plugins: [],
}