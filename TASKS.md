# TASKS — CineList Build Checklist

> Implementation plan for the CineList Movie Watchlist PWA.  
> Each task is atomic and independently completable.  
> Follow phases in order — later phases depend on earlier ones.

---

## Phase 1 — Project Scaffold

- [ ] **T-01** Create project directory `C:\Movie Manager\` with `index.html`, `style.css`, `app.js`
- [ ] **T-02** Add `manifest.json` with app name `CineList`, `background_color`, `theme_color: #0d0d0d`, display: `standalone`
- [ ] **T-03** Create `sw.js` (Service Worker) with a cache-first strategy caching all app shell assets
- [ ] **T-04** Register the service worker in `app.js` with `navigator.serviceWorker.register('./sw.js')`
- [ ] **T-05** Add Google Fonts import for `JetBrains Mono` (weights 400, 500, 700) in `index.html`
- [ ] **T-06** Add `<meta name="viewport">`, `<meta name="theme-color" content="#0d0d0d">`, and PWA meta tags to `index.html`
- [ ] **T-07** Generate PWA icon set (192×192 and 512×512) and link in `manifest.json`

---

## Phase 2 — Design System & CSS Tokens

- [ ] **T-08** Define all CSS custom properties (design tokens) in `:root` block in `style.css`:
  - `--bg-base`, `--bg-surface`, `--bg-elevated`
  - `--accent-red`, `--accent-red-dim`
  - `--english-tag`, `--hindi-tag`
  - `--text-primary`, `--text-muted`, `--text-sub`
  - `--font-mono`, `--transition-snappy`
- [ ] **T-09** Set global reset styles: `box-sizing: border-box`, `margin: 0`, `padding: 0`, `font-family: var(--font-mono)`
- [ ] **T-10** Set `body` background to `var(--bg-base)`, color to `var(--text-primary)`, `height: 100dvh`, `overflow: hidden`
- [ ] **T-11** Define `.btn` base styles: no border-radius beyond `4px`, `1px solid` borders, solid fill, `120ms ease` transitions
- [ ] **T-12** Define utility classes: `.text-muted`, `.text-accent-red`, `.text-accent-blue`, `.sr-only`

---

## Phase 3 — Core Layout

- [ ] **T-13** Build `#app-header`: fixed top bar with app name `cinelist_` in monospace, minimal height (~36px), `1px` bottom border
- [ ] **T-14** Build `#columns-container`: flex row, `height: calc(100dvh - 36px - 56px)` (viewport minus header and FAB zone)
- [ ] **T-15** Build `#col-english`: left column, `width: 50%`, `overflow-y: scroll`, `-webkit-overflow-scrolling: touch`
- [ ] **T-16** Build `#col-hindi`: right column, `width: 50%`, `overflow-y: scroll`, `-webkit-overflow-scrolling: touch`, `border-left: 1px solid var(--text-sub)`
- [ ] **T-17** Build `.col-header`: sticky column header (`position: sticky; top: 0`), shows language label styled in its accent color (`english` in blue, `hindi` in red), count badge showing total items
- [ ] **T-18** Build `.empty-state`: centered empty column message in `var(--text-muted)` monospace text
- [ ] **T-19** Build `#fab`: fixed `+` button at `bottom: 16px; left: 50%; transform: translateX(-50%)`, `44×44px`, circular, `var(--accent-red)` background

---

## Phase 4 — State Management (app.js)

- [ ] **T-20** Define `AppState` object in JS: `{ movies: [], version: 1 }`
- [ ] **T-21** Implement `loadState()`: reads `cinelist_data` from localStorage, parses JSON, returns default state on failure
- [ ] **T-22** Implement `saveState()`: serializes `AppState` to JSON and writes to localStorage
- [ ] **T-23** Implement `movieSortComparator(a, b)`: unwatched first, then sort by `addedAt` desc; watched section sorted by `watchedAt` desc
- [ ] **T-24** Implement `getEnglishMovies()` and `getHindiMovies()`: filter + sort from `AppState.movies`
- [ ] **T-25** Implement `generateId()`: returns a UUID v4 string using `crypto.randomUUID()` (with fallback)
- [ ] **T-26** Call `loadState()` on app init; wire all state mutations to immediately call `saveState()` and re-render

---

## Phase 5 — Movie Operations & UI Logic

- [ ] **T-27** Implement `addMovie(title, language)`: create `Movie` object, push to `AppState.movies`, save, re-render column
- [ ] **T-28** Implement `markWatched(id)`: find movie by id, set `watched = true`, `watchedAt = Date.now()`, save, re-render column
- [ ] **T-29** Implement `deleteMovie(id)`: filter out movie by id, save, animate item removal then re-render
- [ ] **T-30** Build `renderMovieItem(movie)` function: returns a DOM element representing one movie row
  - Unwatched: plain title in `var(--text-primary)`
  - Watched: `✓ title` with `opacity: 0.45`, `✓` in `var(--accent-red)`
- [ ] **T-31** Build action row reveal: clicking a `.movie-item` sets it as `activeItemId`; renders two inline buttons `watched it` / `delete` below the item in a `120ms` slide-down
  - Clicking outside any `.movie-item` clears `activeItemId`
  - Only one item can be active at a time
- [ ] **T-32** Wire `watched it` button to call `markWatched(id)`, collapse action row, animate item to new position
- [ ] **T-33** Wire `delete` button to call `deleteMovie(id)` with collapse animation (`max-height: 0`, `opacity: 0`) before DOM removal
- [ ] **T-34** Implement `renderColumn(language)`: generates full column content (header + movie items + empty state) and updates the DOM
- [ ] **T-35** Implement column count badge update: header shows `(n)` count of total movies, or `(n unseen)` if any watched exist

---

## Phase 6 — Add Movie Modal

- [ ] **T-36** Build `#add-modal` bottom sheet overlay: hidden by default, slides up from bottom on FAB tap (`transform: translateY(100%)` → `translateY(0)`)
- [ ] **T-37** Style modal: `background: var(--bg-elevated)`, `border-top: 1px solid var(--text-sub)`, `padding: 20px`, no rounded corners beyond `4px`
- [ ] **T-38** Build modal input: `#movie-title-input`, full-width, monospace, dark background, `1px` border, placeholder `movie name...`
- [ ] **T-39** Build language toggle: two buttons `english` and `hindi`, only one selected at a time; selected state highlighted with respective accent color border + text
- [ ] **T-40** Build modal submit: `add` button, disabled if `titleInput.trim() === ""`, calls `addMovie()` then closes modal and clears input
- [ ] **T-41** Add backdrop: semi-transparent overlay behind modal, tapping it closes the modal
- [ ] **T-42** Auto-focus `#movie-title-input` when modal opens; close modal on `Escape` key
- [ ] **T-43** Implement `openModal()` and `closeModal()` functions; FAB click calls `openModal()`

---

## Phase 7 — PWA, Polish & QA

- [ ] **T-44** Verify `manifest.json` passes Chrome DevTools PWA installability checklist
- [ ] **T-45** Verify service worker caches `index.html`, `style.css`, `app.js`, fonts, and icons correctly
- [ ] **T-46** Test independent column scrolling: scroll English column, verify Hindi column does not move, and vice versa
- [ ] **T-47** Test action row: tap movie → actions appear; tap elsewhere → actions collapse; tap same movie → toggle
- [ ] **T-48** Test sort order: add 3 movies, mark middle one watched → verify it moves below the other two
- [ ] **T-49** Test localStorage persistence: add movies, refresh page, verify all data reloads correctly
- [ ] **T-50** Test empty states: both columns start empty; removing all movies from a column shows empty state
- [ ] **T-51** Test on real mobile (or Chrome DevTools mobile emulation) at 375px, 390px, 414px widths
- [ ] **T-52** Add `touch-action: manipulation` to buttons/items to prevent 300ms tap delay on mobile
- [ ] **T-53** Verify all interactive elements meet 44×44px minimum touch target
- [ ] **T-54** Run Lighthouse audit (PWA + Performance + Accessibility) — target 90+ on all categories
- [ ] **T-55** Final visual pass: confirm no box-shadows, no rounded corners > 4px, no off-brand colors

---

## Summary

| Phase | Tasks | Scope |
|---|---|---|
| 1 — Scaffold | T-01 → T-07 | Project structure, PWA shell |
| 2 — Design System | T-08 → T-12 | CSS tokens, global styles |
| 3 — Layout | T-13 → T-19 | App skeleton, columns, FAB |
| 4 — State | T-20 → T-26 | localStorage, sort logic |
| 5 — Operations | T-27 → T-35 | CRUD, render, actions |
| 6 — Modal | T-36 → T-43 | Add movie bottom sheet |
| 7 — Polish/QA | T-44 → T-55 | PWA audit, mobile testing |

**Total: 55 tasks**
