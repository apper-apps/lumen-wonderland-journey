/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5B4E8C',
        secondary: '#8B7355',
        accent: '#E8A037',
        surface: '#F5F2ED',
        success: '#4A7C59',
        warning: '#E07A5F',
        error: '#CC444B',
        info: '#6B9BD1'
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [],
}