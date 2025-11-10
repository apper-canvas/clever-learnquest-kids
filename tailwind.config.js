/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF6B9D',
        secondary: '#4ECDC4',
        accent: '#FFD93D',
        surface: '#FFFFFF',
        background: '#F7F9FC',
        success: '#6BCF7F',
        warning: '#FFB347',
        error: '#FF6B9D',
        info: '#6BA3FF'
      },
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        body: ['Poppins', 'sans-serif']
      },
      fontSize: {
        'display-lg': ['3rem', { lineHeight: '1.1' }],
        'display-md': ['2.5rem', { lineHeight: '1.1' }],
        'display-sm': ['2rem', { lineHeight: '1.2' }],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem'
      },
      boxShadow: {
        'soft': '0 4px 12px rgba(0, 0, 0, 0.1)',
        'lift': '0 8px 24px rgba(0, 0, 0, 0.12)'
      }
    },
  },
  plugins: [],
}