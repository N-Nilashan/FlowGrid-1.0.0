/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
      },
      textColor: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
      },
      colors: {
        'background': 'var(--background)',
        'foreground': 'var(--foreground)',
      }
    },
  },
  plugins: [],
}
