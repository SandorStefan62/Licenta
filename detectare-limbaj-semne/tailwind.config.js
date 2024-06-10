/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-color': '#00D9E7',
        'secondary-color': '#56E39F',
        'background-color': 'rgba(137, 171, 245, 0.5)'
      }
    },
  },
  plugins: [],
}

