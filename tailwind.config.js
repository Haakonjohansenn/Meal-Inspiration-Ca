/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      'nav-color': '#A7C957',
      'my-black': '#000814',
      'eggshell': '#EEEBD3',
      'white': '#FFFFFF',
      'success-green': '#5cb85c',
      'not-success-red': '#ff3333',
      'my-gray': '#eaeaea',
    },
  },
  plugins: [],
}
