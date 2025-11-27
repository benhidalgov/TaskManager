/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        // Dark Neon Palette
        brand: {
          DEFAULT: '#8b5cf6', // Violet-500
          hover: '#7c3aed',   // Violet-600
          light: '#a78bfa',   // Violet-400
          glow: '#8b5cf6',    // For shadows
        },
        accent: {
          DEFAULT: '#d946ef', // Fuchsia-500
          hover: '#c026d3',   // Fuchsia-600
        },
        dark: {
          bg: '#050505',      // Almost black
          surface: '#121212', // Dark gray
          card: '#18181b',    // Zinc-900
          border: '#27272a',  // Zinc-800
        },
        text: {
          primary: '#f4f4f5',   // Zinc-100
          secondary: '#a1a1aa', // Zinc-400
          tertiary: '#52525b',  // Zinc-600
        }
      },
      boxShadow: {
        'neon': '0 0 20px -5px rgba(139, 92, 246, 0.5)',
        'neon-hover': '0 0 30px -5px rgba(139, 92, 246, 0.7)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.7), 0 4px 6px -2px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #8b5cf6, #d946ef)',
        'gradient-dark': 'linear-gradient(to bottom, #121212, #050505)',
      }
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}