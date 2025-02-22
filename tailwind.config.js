/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        white: "#fff",
        black: "#000",
        primary: "#FF6F00", // Custom primary color
        prilight: "#FFD2B0", // Custom primary color
        secondary: "#FFF1E6", // Custom secondary color
        accent: "#FBBF24", // Custom accent color
        active: "#00FF00",
        expired: "#FF0000",
        pending: "#FFFF00",
        // Add more custom colors as needed
      },
    },
  },
  plugins: [],
};
