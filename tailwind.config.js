/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#f85606", // Daraz Orange
          hover: "#d04205",
        },
        secondary: "#1a1a1a", // Dark Text
        accent: "#108ee9", // Links Blue
        background: "#eff0f5", // Light Gray Background
        surface: "#ffffff",
        danger: "#ef4444",
        success: "#22c55e",
        warning: "#eab308",
        rating: "#faca51", // Star color
      },
      fontFamily: {
        sans: ['Roboto', 'Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1188px', // Slightly narrower than standard container for dense look
        },
      },
      boxShadow: {
        'card': '0 2px 4px 0 rgba(0,0,0,.05)',
        'hover': '0 4px 12px 0 rgba(0,0,0,.15)',
      }
    },
  },
  plugins: [],
}
