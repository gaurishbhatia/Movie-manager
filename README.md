# CineList 🎬

A minimal, offline-capable Progressive Web App (PWA) for managing movie watchlists classified by language (English & Hindi), styled with a Monkeytype-inspired **Spiderman dark monospace** aesthetic.

![Theme](https://img.shields.io/badge/theme-spiderman%20dark-e63946)
![PWA](https://img.shields.io/badge/pwa-offline%20ready-4e9af1)

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

## 🚀 Getting Started Locally

Open `index.html` directly in your browser or run any static server:

```bash
# Using npx http-server
npx http-server . -p 3000

# Or Python
python -m http.server 3000
```

---

## 📱 Deploying to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select `Deploy from a branch` and choose `main` / `(root)`.
4. Your PWA will be live at `https://<username>.github.io/<repo-name>/`.
