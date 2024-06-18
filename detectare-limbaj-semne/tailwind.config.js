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
        'background-color-lower-alpha': 'rgba(137, 171, 245, 0.2)',
      },
      spacing: {
        '80': '20rem',
        '104': '26rem',
        '128': '32rem',
      },
      height: {
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
      },
      width: {
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
      },
      minHeight: {
        '1/10': '10%',
        '2/10': '20%',
        '3/10': '30%',
        '4/10': '40%',
        '5/10': '50%',
        '6/10': '60%',
        '7/10': '70%',
        '8/10': '80%',
        '9/10': '90%',
      },
      screens: {
        "tall": {
          'raw': '(min-height: 769px)',
        }
      }
    },
  },
  plugins: [],
}

