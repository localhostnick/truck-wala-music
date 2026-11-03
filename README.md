# 🚛 Truck Wala Music — Indian Truck Driver Playlist

<p align="center">
  <img src="https://img.shields.io/badge/Status-Live-success.svg?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React-19-61dafb.svg?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF.svg?style=for-the-badge&logo=vite" alt="Vite 8" />
  <img src="https://img.shields.io/badge/Playlist-Punjabi_%26_Bollywood_Highway-ff0000.svg?style=for-the-badge&logo=youtube" alt="Highway Playlist" />
</p>

<p align="center">
  <strong>The free Indian truck driver playlist website. Play Punjabi, Hindi, and Bhojpuri highway songs heard in truck cabins and roadside dhabas across India. No signup—open and press play.</strong>
</p>

---

## 🎧 Features

- **🚛 Authentic Indian Highway Atmosphere:** Hand-painted Indian cargo truck backdrop with golden hour aesthetic and custom Hindi typography (*Baloo 2*).
- **🎵 Stream Direct from YouTube Music:** Powered by YouTube IFrame Player API using the official highway truck driver playlist (`PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy`).
- **🎛️ Minimalist Glassmorphic Player Pill:**
  - Spinning vinyl album art disk during playback.
  - Auto-scrolling title marquee for long track names.
  - Full playback controls: Previous, Play/Pause, Next.
  - Interactive smooth seek rail with hover knob and time counter.
- **🕒 Real-Time IST Clock & Live Listeners:** Realistic diurnal listener calculation reflecting Indian time of day with live green pulsing indicator.
- **✨ Interactive Truck Shayari:** Tap to cycle through iconic highway slogans like *"बुरी नज़र वाले तेरा मुंह काला"*, *"हंस मत पगली प्यार हो जाएगा"*, *"दम है तो क्रॉस कर वरना बर्दाश्त कर"*, and *"फासला रखो - Horn OK Please"*.
- **⌨️ Keyboard Navigation:**
  - `Space` or `K`: Toggle Play / Pause.
  - `Left Arrow` / `Right Arrow`: Seek backward/forward 5 seconds.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/localhostnick/truck-wala-music.git
cd truck-wala-music
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```
Generates production-ready static assets in `dist/`.

---

## 🌐 Deploy Free

- **Vercel:** `npx vercel`
- **Netlify:** `npx netlify deploy --prod --dir=dist`
- **GitHub Pages:** Add `.github/workflows/deploy.yml` and enable Pages in repo settings.

---

## 📜 Credits & License

- Built by [localhostnick](https://github.com/localhostnick)
- Inspired by [truckdrivermusic.in](https://www.truckdrivermusic.in)
- Licensed under [MIT](LICENSE)
