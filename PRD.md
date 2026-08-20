# PRD — CineList (Movie Watchlist PWA)

## Overview

**CineList** is a minimal, offline-capable Progressive Web App (PWA) for tracking movies you want to watch, categorized by language. It is designed to feel authentic and intentional — not like a generic vibe-coded app — taking visual inspiration from the Monkeytype *Spiderman* theme: deep dark backgrounds, crimson/red accent typography, muted secondary tones, and a monospace-first design language.

---

## Goals

- Dead-simple movie note-taking, no account or login required
- Language-based separation (English | Hindi) as first-class UI concept
- Offline-first: works without internet (PWA + localStorage)
- Mobile-first layout, but graceful on desktop
- Feels crafted, not generated — every pixel intentional

---

## Non-Goals

- No movie search/autocomplete from external APIs (manual text entry only)
- No user accounts, cloud sync, or social features (v1)
- No ratings, reviews, or rich metadata fields

---

## Target Platforms

| Platform | Experience |
|---|---|
| Mobile (primary) | Two-column split, independent scroll per column |
| Desktop/tablet | Wider two-column layout, same feature set |
| PWA (installable) | Full offline support, home screen installable |

---

## Design Language — "Spiderman" Theme

| Token | Value | Usage |
|---|---|---|
| `--bg-base` | `#0d0d0d` | App background |
| `--bg-surface` | `#141414` | Card / panel surfaces |
| `--bg-elevated` | `#1c1c1c` | Modals, input fields |
| `--accent-red` | `#e63946` | Primary accent (movie titles, CTAs) |
| `--accent-red-dim` | `#9b2335` | Hover states, watched border |
| `--text-primary` | `#e8e8e8` | Main body text |
| `--text-muted` | `#555` | Timestamps, secondary labels |
| `--text-sub` | `#3a3a3a` | Dividers, faint borders |
| `--english-tag` | `#4e9af1` | English column accent (muted blue) |
| `--hindi-tag` | `#e63946` | Hindi column accent (crimson) |
| **Font** | `'JetBrains Mono', 'Roboto Mono', monospace` | All text |

**Visual Rules**
- No rounded corners beyond `4px` (sharp, minimal)
- No box shadows — use `1px` border lines instead
- Transitions: `120ms ease` only (snappy, not floaty)
- No gradients on interactive elements — solid fills only
- Watched movies: slightly dimmed opacity (`0.45`) + ✓ prefix in accent color

---

## Features

### F-01 — Dual-Column Homepage (Mobile)
- Left column: **English** movies (blue header label)
- Right column: **Hindi** movies (red header label)
- Each column is independently scrollable (no page-level scroll conflict)
- Column headers are sticky at the top within their respective column
- Columns are equal width (50vw each)

### F-02 — Add Movie
- Floating **+** button, fixed at bottom center of screen
- Tapping opens a bottom sheet / modal
- Input: plain text field (movie name)
- Language selector: two toggle buttons — `english` | `hindi`
- Submit adds movie to the top of the correct column's **unseen** list
- No character limit enforced (but placeholder text guides input)

### F-03 — Movie Item Actions (Tap)
- Tapping a movie item reveals two inline action options:
  - `watched it` — marks movie as seen
  - `delete` — removes from list permanently
- Actions appear as a small contextual row below the tapped item
- Tapping elsewhere collapses the actions (dismisses)

### F-04 — Watched State
- Watched movies display a `✓` prefix in the accent color
- Watched movies are visually dimmed (`opacity: 0.45`)
- Watched movies are sorted to the **bottom** of their column automatically
- Un-watched movies always appear above watched ones
- No separate "watched" tab — all in one list, sorted by status

### F-05 — Delete Movie
- Permanently removes movie from the list
- No confirmation dialog (matches the minimal, fast UX philosophy)
- Smooth removal animation (`height → 0` + `opacity → 0`)

### F-06 — Persistence
- All data stored in **localStorage** (key: `cinelist_data`)
- Data structure is JSON; survives page refresh and PWA reinstall
- No server, no database, no network calls

### F-07 — PWA / Offline Support
- `manifest.json` with name, icons, theme color
- Service Worker with cache-first strategy for all assets
- Installable to home screen on Android/iOS
- Works fully offline after first load

### F-08 — Empty States
- Each column shows a subtle empty state when no movies are present
- English empty state: `no english movies yet.`
- Hindi empty state: `no hindi movies yet.`
- Styled in muted monospace, centered in the column

---

## UX Micro-interactions

| Interaction | Behavior |
|---|---|
| Add button hover/press | Slight scale pulse (`scale(1.08)`) |
| Movie item tap | Reveal action row with a `120ms` slide-down |
| Watched toggle | ✓ fades in, item dims, then slides to bottom |
| Delete | Item collapses in height to `0` and fades out |
| Column scroll | Independent `overflow-y: scroll` per column, no bleed |

---

## Accessibility

- All interactive elements have `aria-label` attributes
- Color is never the sole indicator of state (✓ prefix used alongside dimming)
- Minimum touch target size: `44x44px`
- Focus visible styles on all interactive elements

---

## Out of Scope (v1)

- Movie poster images
- Genre tags or ratings
- Search/filter within lists
- Reordering (drag to rearrange)
- Multiple lists / custom categories
- Cloud backup / export
- Dark/light mode toggle (dark only)
