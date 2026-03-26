module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
        success: "#34c759",
        warning: "#f59e0b",
        error: "#ef4444",
      },
      typography: {
        DEFAULT: {
          css: {
            color: "#374151",
            a: {
              color: "#3b82f6",
              "&:hover": {
                color: "#2c6ff6",
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};