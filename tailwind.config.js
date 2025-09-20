/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/flowbite-react/lib/esm/**/*.js",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        success: {
          50: "var(--success-50)",
          500: "var(--success-500)",
          600: "var(--success-600)",
        },
        error: {
          50: "var(--error-50)",
          500: "var(--error-500)",
          600: "var(--error-600)",
        },
        warning: {
          50: "var(--warning-50)",
          500: "var(--warning-500)",
          600: "var(--warning-600)",
        },
        info: {
          50: "var(--info-50)",
          500: "var(--info-500)",
          600: "var(--info-600)",
        },
      },
      spacing: {
        "spacing-xs": "var(--spacing-xs)",
        "spacing-sm": "var(--spacing-sm)",
        "spacing-md": "var(--spacing-md)",
        "spacing-lg": "var(--spacing-lg)",
        "spacing-xl": "var(--spacing-xl)",
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
