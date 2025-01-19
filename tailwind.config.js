/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./views/**/*.{html,js,ejs}",
    "./public/**/*.{hmtl,js,css}"
  ],
  theme: {
    colors: {
      transparent: "transparent",
      currentColor: "currentColor",
      "black": "#08090aff",
      "carolina-blue": "#8fbfe0ff",
      "saffron": "#fac748ff",
      "davys-gray": "#575a5eff",
      "tea-green": "#cbeaa6ff"
    },
    extend: {},
  },
  plugins: [],
}

