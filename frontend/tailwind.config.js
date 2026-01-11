/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // esto habilita modo oscuro por clase
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
