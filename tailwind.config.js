/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        BgA: "#003578",
        BgB: "#003ba8",
        Text: "#fff",
        Border: "#fff",
        btnBg: "#0045c3",
        btnBgHover: "#1D00c3",
        btnBgActive: "#00a7c3",
        btnBorder:"#000",
        btnBorderHover:"#000",
        btnBorderActive:"#000",
        btnTxt:"#fff",
        btnTxtHover:"#fff",
        btnTxtActive:"#fff",
        inputBgA:"#001c4b",
        cellNormal:"#003ba8",
        cellHover:"#00a7c3",
        cellActive:"#1D00c3",
        cellBorder:"#1D00c3",
        cellBorderHover:"#1D00c3",
        cellBorderActive:"#1D00c3",
        tagBg: "#003ba8",
        tagBgHover: "#1D00c3",
      }      
    }
  },
  plugins: [],
}