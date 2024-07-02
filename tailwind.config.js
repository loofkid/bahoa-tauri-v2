/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')], //eslint-disable-line
  daisyui: {
    themes: ["light", "dark", "synthwave"],
  },
}

