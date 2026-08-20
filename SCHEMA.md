# SCHEMA — CineList State & Data Models

## Storage Strategy

All data is persisted to **`localStorage`** under a single key:

```
localStorage key: "cinelist_data"
value: JSON string of AppState
```

No external database, no IndexedDB, no server.

---

## Core Entities

### `Movie`

Represents a single movie entry in the watchlist.

```ts
interface Movie {
  id: string;          // UUID v4, generated at creation time
  title: string;       // User-entered movie name (trimmed)
  language: "english" | "hindi";
  watched: boolean;    // false = unwatched, true = watched
  addedAt: number;     // Unix timestamp (ms) — Date.now()
  watchedAt: number | null; // Unix timestamp when marked watched; null if not
}
```

**Field Notes:**
- `id` — Used as the stable React/DOM key; never reassigned
- `title` — Stored as-is; no normalization or deduplication enforced
- `language` — Determines which column the movie appears in
- `watched` — Controls sort position and visual state
- `addedAt` — Used as secondary sort key for unwatched movies (newer first)
- `watchedAt` — Used as secondary sort key for watched movies (more recently watched = higher in watched section)

---

### `AppState`

The root state object, serialized to localStorage.

```ts
interface AppState {
  movies: Movie[];  // All movies, both languages, flat array
  version: number;  // Schema version (currently: 1) for future migrations
}
```

**Default / initial state:**
```json
{
  "movies": [],
  "version": 1
}
```

---

## Derived / Computed State

These are **never stored** — computed at render time from `AppState.movies`.

### `EnglishMovies`
```ts
const englishMovies = movies
  .filter(m => m.language === "english")
  .sort(movieSortComparator);
```

### `HindiMovies`
```ts
const hindiMovies = movies
  .filter(m => m.language === "hindi")
  .sort(movieSortComparator);
```

### Sort Comparator
```ts
function movieSortComparator(a: Movie, b: Movie): number {
  // Unwatched always before watched
  if (a.watched !== b.watched) return a.watched ? 1 : -1;

  if (!a.watched) {
    // Both unwatched: newer added = higher (descending addedAt)
    return b.addedAt - a.addedAt;
  } else {
    // Both watched: more recently watched = higher (descending watchedAt)
    return (b.watchedAt ?? 0) - (a.watchedAt ?? 0);
  }
}
```

---

## UI State (in-memory only, not persisted)

### `ModalState`
Controls the Add Movie bottom sheet.

```ts
interface ModalState {
  open: boolean;
  selectedLanguage: "english" | "hindi";
  titleInput: string;
}
```

**Default:**
```ts
{ open: false, selectedLanguage: "english", titleInput: "" }
```

### `ActiveItemState`
Tracks which movie item has its action row expanded (tap to reveal).

```ts
interface ActiveItemState {
  movieId: string | null; // null = no item active
}
```

Only one item can be active at a time. Tapping the same item or anywhere else collapses it.

---

## LocalStorage Serialization

### Write (save)
```ts
function saveState(state: AppState): void {
  localStorage.setItem("cinelist_data", JSON.stringify(state));
}
```

### Read (load)
```ts
function loadState(): AppState {
  const raw = localStorage.getItem("cinelist_data");
  if (!raw) return { movies: [], version: 1 };
  try {
    const parsed = JSON.parse(raw);
    return migrateIfNeeded(parsed);
  } catch {
    return { movies: [], version: 1 };
  }
}
```

### Migration stub (for future schema changes)
```ts
function migrateIfNeeded(state: any): AppState {
  if (!state.version || state.version < 1) {
    // future: handle older schema formats
  }
  return state as AppState;
}
```

---

## Operation Definitions

| Operation | State Change |
|---|---|
| `addMovie(title, language)` | Push new `Movie` to `movies[]` |
| `markWatched(id)` | Set `watched = true`, `watchedAt = Date.now()` |
| `deleteMovie(id)` | Filter out movie with matching `id` |

All operations trigger an immediate `saveState()` call after mutation.

---

## Sample Stored Data

```json
{
  "version": 1,
  "movies": [
    {
      "id": "f3a2b1c4-...",
      "title": "Alien: Romulus",
      "language": "english",
      "watched": false,
      "addedAt": 1724092800000,
      "watchedAt": null
    },
    {
      "id": "a9e4d2f1-...",
      "title": "Stree 2",
      "language": "hindi",
      "watched": true,
      "addedAt": 1723900000000,
      "watchedAt": 1724006400000
    }
  ]
}
```
