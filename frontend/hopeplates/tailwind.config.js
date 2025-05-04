/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"], // Adjust paths if needed
  theme: {
    extend: {
      colors: {
        primary: "#B7AEB7",   // Custom light purple
        secondary: "#410c31", // Custom dark parple
        accent: "#0e2843",    // Custom blue
      },
    },
  },
  plugins: [],
};
