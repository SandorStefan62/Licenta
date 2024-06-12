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
        'tertiary-color': 'rgba(4, 110, 143, 0.2)',
        'background-color': 'rgba(137, 171, 245, 0.5)',
      },
      spacing: {
        '80': '20rem',
        '104': '26rem',
        '128': '32rem',
      }
    },
  },
  plugins: [],
}

