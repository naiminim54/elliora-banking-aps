/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        dark: "#18181A",
        primary: "#00BFA5",
        background: "#18181A",
      },
      backgroundColor: {
        DEFAULT: "#18181A",
      },
    },
  },
  plugins: [],
};
