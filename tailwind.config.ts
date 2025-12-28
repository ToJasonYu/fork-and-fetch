import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-jakarta)', 'sans-serif'],
        heading: ['var(--font-outfit)', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#FFF7ED',  // Soft Peach/Cream (Background)
          100: '#FFEDD5', // Light Orange
          200: '#FED7AA',
          500: '#F97316', // Main Orange Button
          600: '#EA580C', // Darker Orange Hover
          900: '#431407', // Dark Brown/Black Text
        }
      },
    },
  },
  plugins: [],
} satisfies Config;