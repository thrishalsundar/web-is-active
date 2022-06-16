/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'boat': "url('../public/bg.jpeg')"
      }
    },
  },
  plugins: [],
}
