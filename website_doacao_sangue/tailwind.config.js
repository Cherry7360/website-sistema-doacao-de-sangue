/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        azul:'#419AFF',
        primary:'#c3c304',
        verde:'#08D255',
        vermelho:'#AA2828',
        cinza:'#C5B4B4',
      },
    },
  },
  plugins: [],
}

