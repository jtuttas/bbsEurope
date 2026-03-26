/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#364152',
        secondary: '#637689',
        accent: '#f7b800',
      },
    },
  },
  plugins: [],
};
