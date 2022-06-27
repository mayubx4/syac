module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xxl': '1650px'
      },
    },
  },
  plugins: [
    // require('tailwind-scrollbar')
  ],
  variants: {
    // scrollbar: ['rounded']
  }
}
