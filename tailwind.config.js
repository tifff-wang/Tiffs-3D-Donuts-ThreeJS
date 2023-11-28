/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./client/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        yummy: ["yummy"],
      },
      maxHeight: {
        650: "650px",
      },
    },
  },
  plugins: [],
};
