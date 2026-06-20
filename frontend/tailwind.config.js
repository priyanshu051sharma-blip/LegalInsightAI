/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'legal-blue': '#003d82',
        'legal-gold': '#d4a373',
        'legal-gray': '#f5f5f5',
      },
      backgroundImage: {
        'gradient-legal': 'linear-gradient(135deg, #003d82 0%, #004fa3 100%)',
      },
    },
  },
  plugins: [],
}
