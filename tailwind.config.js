/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  // 1. Set dark mode to 'class' to work with your theme hook
  darkMode: "class",

  // 2. Point Tailwind to all files that use its classes
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Matches your project structure
  ],

  theme: {
    extend: {
      // 3. Set Montserrat as the default "sans" font
      // (as defined in your index.css)
      fontFamily: {
        sans: ["Montserrat", "sans-serif"],
      },

      // 4. Add a "primary" color palette. This is a modern best practice.
      // You can now use classes like `bg-primary-500` or `text-primary-700`
      colors: {
        primary: colors.blue, // Uses the built-in Tailwind blue as "primary"
      },

      // 5. Define the "animation" keyframes
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)", // Starts 16px down
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)", // Ends in its original position
          },
        },
        "subtle-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },

      // 6. Make the keyframes usable with animation utility classes
      animation: {
        // Use with `className="animate-fade-in"`
        "fade-in": "fade-in 0.5s ease-out",

        // Use with `className="animate-slide-up"`
        // This is a great alternative to your Framer Motion HOC
        "slide-up":
          "slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // A nice "ease-out" curve
        
        // Use with `className="animate-subtle-pulse"`
        "subtle-pulse": "subtle-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },

  // 7. Add plugins. `@tailwindcss/forms` is perfect for your file uploads
  plugins: [
    require("@tailwindcss/forms"),
  ],
};