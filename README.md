# CineList 🎬

A minimal, offline-capable Progressive Web App (PWA) for managing movie watchlists classified by language (English & Hindi), styled with a Monkeytype-inspired **Spiderman dark monospace** aesthetic.

[![Live Demo](https://img.shields.io/badge/live%20demo-gaurish--cinelist.netlify.app-e63946?style=for-the-badge&logo=netlify)](https://gaurish-cinelist.netlify.app/)
[![Theme](https://img.shields.io/badge/theme-spiderman%20dark-141414?style=for-the-badge)](https://gaurish-cinelist.netlify.app/)
[![PWA Ready](https://img.shields.io/badge/pwa-offline%20ready-4e9af1?style=for-the-badge)](https://gaurish-cinelist.netlify.app/)

🔗 **Live App:** [https://gaurish-cinelist.netlify.app/](https://gaurish-cinelist.netlify.app/)

---

## ✨ Features

- **Dual-Column Layout**: English movies (blue accent) and Hindi movies (crimson accent) shown side-by-side.
- **Independent Column Scrolling**: Each language column scrolls independently on mobile and desktop without viewport conflicts.
- **Minimal Movie Entry**: Quick bottom-sheet modal to add movies and tag the language.
- **Watched & Delete Actions**: Tap any movie to mark as watched (`✓`) or delete it.
- **Smart Sorting**: Unwatched movies stay at the top; watched movies automatically sort to the bottom with dimmed opacity.
- **100% Offline & PWA**: Installs to your Android / iOS home screen with offline caching via Service Worker.
- **Local Persistence**: Data is saved to your device's `localStorage` — no login, no accounts, no external tracking.

---

## 🎨 Design Language

- **Background**: `#0d0d0d` (Deep black)
- **Primary Accent**: `#e63946` (Crimson red)
- **Secondary Accent**: `#4e9af1` (Muted electric blue)
- **Font**: `JetBrains Mono` (Monospace throughout)
- **Aesthetic**: Sharp edges (<=4px radius), 1px solid borders, no fuzzy drop-shadows, snappy 120ms transitions.

---

## 📱 How to Install on Mobile (PWA)

1. Open [https://gaurish-cinelist.netlify.app/](https://gaurish-cinelist.netlify.app/) in Chrome on Android (or Safari on iOS).
2. Tap the browser menu (**⋮** on Android / **Share** button on iOS).
3. Select **"Add to Home Screen"** or **"Install App"**.
4. Launch it directly from your home screen with full offline support.

---

## 🚀 Running Locally

Open `index.html` directly in your browser or run any static server:

```bash
# Using npx http-server
npx http-server . -p 3000

# Or Python
python -m http.server 3000
```
