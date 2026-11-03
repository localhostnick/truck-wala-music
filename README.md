# 🚛 Truck Wala Music — Indian Truck Driver Highway Playlist

<p align="center">
  <a href="https://localhostnick.github.io/truck-wala-music/"><img src="https://img.shields.io/badge/Live_Site-Visit_Now-success.svg?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live Demo" /></a>
  <img src="https://img.shields.io/badge/React-19-61dafb.svg?style=for-the-badge&logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF.svg?style=for-the-badge&logo=vite" alt="Vite 8" />
  <a href="https://music.youtube.com/playlist?list=PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy"><img src="https://img.shields.io/badge/YouTube_Music-Playlist-ff0000.svg?style=for-the-badge&logo=youtubemusic" alt="YouTube Music Playlist" /></a>
</p>

<p align="center">
  <strong>The free Indian truck driver playlist website. Stream non-stop Punjabi, Hindi, and Bhojpuri highway bangers heard in truck cabins and roadside dhabas across India. No login, no ads—open and press play.</strong>
</p>

---

## 🎧 Features

- **🚛 Authentic Indian Highway Atmosphere:** Hand-painted Indian cargo truck backdrop with golden hour aesthetic and custom Hindi truck typography (*Baloo 2*).
- **🎵 Seamless Streaming from YouTube Music:** Powered by YouTube IFrame Player API using the official highway truck driver playlist (`PLgObA3pAqvOh87Z03QG8Z4xE-uqlAWSBy`).
- **🎛️ Minimalist Coverless Glassy Player:**
  - Modern glassy card aesthetic with smooth blur and border glows.
  - Track titles & artists displayed in bold highway-style ALL CAPS.
  - Auto-scrolling title marquee for longer song titles.
  - Interactive smooth seekbar with hover scrubber and live time counters.
  - Instant, glitch-free song switching (zero latency on skip).
- **👥 Real-Time Peer Presence:**
  - Live tab-to-tab peer counting via `BroadcastChannel` with `LISTENING` status and pulsing indicator.
- **🕒 Real-Time IST Clock:** Always accurate Indian Standard Time display in the top navigation bar.
- **✨ Auto-Cycling Highway Shayari:**
  - Automatically rotates legendary Indian truck slogans every 10 seconds:
    - *"बुरी नज़र वाले तेरा मुंह काला"*
    - *"हंस मत पगली प्यार हो जाएगा"*
    - *"दम है तो क्रॉस कर, वरना बर्दाश्त कर"*
    - *"फासला रखो — HORN OK PLEASE"*
    - *"धीरे चलोगे तो बार-बार मिलेंगे, तेज़ चलोगे तो हरिद्वार मिलेंगे"*
  - Can also be clicked manually anytime to skip to the next shayari.
- **⌨️ Keyboard Shortcuts:**
  - `Space` / `K`: Toggle Play / Pause.
  - `Left Arrow` / `Right Arrow`: Seek backward / forward 5 seconds.

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

### 3. Build & Lint
```bash
npm run build
npm run lint
```
Builds production-ready static bundles into `dist/`.

---

## 🌐 Deployment

The project is hosted and deployed automatically via **GitHub Actions** on **GitHub Pages**:
- **Live URL:** [https://localhostnick.github.io/truck-wala-music/](https://localhostnick.github.io/truck-wala-music/)
- Workflow configuration is located in `.github/workflows/deploy.yml`.

---

## 📜 Credits & License

- Built with ❤️ by [localhostnick](https://github.com/localhostnick)
- Inspired by [truckdrivermusic.in](https://www.truckdrivermusic.in)
- Licensed under [MIT](LICENSE)
