import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/js/**/*.{js,jsx}", // React
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Figtree", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: "var(--color-primary)",
        text: "var(--color-text)",
        background: "var(--color-background)",
        secondary: "var(--color-secondary)",
      },
    },
  },
  plugins: [],
};
