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
        cellBorderHover:"#00c39f",
        cellBorderActive:"#00c39f",
        cellBorderSelected:"#00c39f",
        cellMiss:"#9ffbfb",
        cellHit:"#ff0000",
        cellSunk:"#630000",
        cellHidden:"rgba(0,167,195,0.29)",
        cellRevealed:"#00a7c3",
        cellShip:"#292929",
        tagBg: "#003ba8",
        tagBgHover: "#1D00c3",
        actionBtnFire: "#ff0000",
        actionBtnMark: "#ffff00",
        actionBtnClear: "#00ff00",
      }      
    }
  },
  plugins: [],
}