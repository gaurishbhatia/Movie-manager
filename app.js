/* ============================================================
   CineList — Application Logic
   ============================================================ */

// ---- State ----
const STORAGE_KEY = 'cinelist_data';
const DEFAULT_STATE = { movies: [], version: 1 };

let appState = loadState();
let activeItemId = null;
let modalState = { open: false, selectedLanguage: 'english', titleInput: '' };

// ---- UUID ----
function generateId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ---- Persistence ----
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.movies)) return { ...DEFAULT_STATE };
    return parsed;
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

// ---- Sort ----
function movieSortComparator(a, b) {
  // Unwatched always before watched
  if (a.watched !== b.watched) return a.watched ? 1 : -1;
  if (!a.watched) {
    // Both unwatched: newer first
    return b.addedAt - a.addedAt;
  } else {
    // Both watched: recently watched first
    return (b.watchedAt || 0) - (a.watchedAt || 0);
  }
}

function getMoviesByLanguage(language) {
  return appState.movies
    .filter(m => m.language === language)
    .sort(movieSortComparator);
}

// ---- Operations ----
function addMovie(title, language) {
  const trimmed = title.trim();
  if (!trimmed) return;

  const movie = {
    id: generateId(),
    title: trimmed,
    language,
    watched: false,
    addedAt: Date.now(),
    watchedAt: null,
  };

  appState.movies.push(movie);
  saveState();
  renderColumn(language);
  return movie;
}

function markWatched(id) {
  const movie = appState.movies.find(m => m.id === id);
  if (!movie || movie.watched) return;

  movie.watched = true;
  movie.watchedAt = Date.now();
  activeItemId = null;
  saveState();
  renderColumn(movie.language);
}

function deleteMovie(id) {
  const movie = appState.movies.find(m => m.id === id);
  if (!movie) return;

  const lang = movie.language;
  const el = document.querySelector(`[data-movie-id="${id}"]`);

  if (el) {
    el.classList.add('removing');
    el.addEventListener('transitionend', () => {
      appState.movies = appState.movies.filter(m => m.id !== id);
      activeItemId = null;
      saveState();
      renderColumn(lang);
    }, { once: true });
    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
      appState.movies = appState.movies.filter(m => m.id !== id);
      activeItemId = null;
      saveState();
      renderColumn(lang);
    }, 400);
  } else {
    appState.movies = appState.movies.filter(m => m.id !== id);
    activeItemId = null;
    saveState();
    renderColumn(lang);
  }
}

// ---- Rendering ----
function createMovieElement(movie) {
  const li = document.createElement('li');
  li.className = 'movie-item' + (movie.watched ? ' watched' : '');
  if (movie.id === activeItemId) li.classList.add('active');
  li.dataset.movieId = movie.id;
  li.setAttribute('role', 'button');
  li.setAttribute('aria-label', `${movie.title}${movie.watched ? ' (watched)' : ''}`);
  li.tabIndex = 0;

  // Content row
  const content = document.createElement('div');
  content.className = 'movie-item-content';

  const check = document.createElement('span');
  check.className = 'check-icon';
  check.textContent = '✓';
  check.setAttribute('aria-hidden', 'true');

  const title = document.createElement('span');
  title.className = 'movie-title';
  title.textContent = movie.title;

  content.appendChild(check);
  content.appendChild(title);
  li.appendChild(content);

  // Action row
  const actionRow = document.createElement('div');
  actionRow.className = 'action-row';

  if (!movie.watched) {
    const watchBtn = document.createElement('button');
    watchBtn.className = 'action-btn btn-watched';
    watchBtn.textContent = 'watched it';
    watchBtn.setAttribute('aria-label', `Mark ${movie.title} as watched`);
    watchBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      markWatched(movie.id);
    });
    actionRow.appendChild(watchBtn);
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-btn btn-delete';
  deleteBtn.textContent = 'delete';
  deleteBtn.setAttribute('aria-label', `Delete ${movie.title}`);
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    deleteMovie(movie.id);
  });
  actionRow.appendChild(deleteBtn);

  li.appendChild(actionRow);

  // Tap handler
  li.addEventListener('click', () => {
    if (activeItemId === movie.id) {
      activeItemId = null;
    } else {
      activeItemId = movie.id;
    }
    renderColumn('english');
    renderColumn('hindi');
  });

  // Keyboard support
  li.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      li.click();
    }
  });

  return li;
}

function renderColumn(language) {
  const colId = language === 'english' ? 'col-english' : 'col-hindi';
  const col = document.getElementById(colId);
  if (!col) return;

  // Save scroll position
  const scrollTop = col.scrollTop;

  const movies = getMoviesByLanguage(language);
  const unwatched = movies.filter(m => !m.watched);
  const watched = movies.filter(m => m.watched);
  const total = movies.length;

  // Header
  const accentClass = language;
  const langIcon = language === 'english' ? '◈' : '◈';
  const langLabel = language;

  let countText = '';
  if (total === 0) {
    countText = '';
  } else if (watched.length > 0) {
    countText = `${unwatched.length} unseen · ${total}`;
  } else {
    countText = `${total}`;
  }

  // Build HTML
  let html = `
    <div class="col-header ${accentClass}">
      <span class="lang-icon">${langIcon}</span>
      <span class="lang-label">${langLabel}</span>
      <span class="count-badge">${countText}</span>
    </div>
  `;

  if (total === 0) {
    html += `
      <div class="empty-state">
        <span class="empty-icon">◇</span>
        <span class="empty-text">no ${language} movies yet.</span>
      </div>
    `;
  }

  col.innerHTML = html;

  if (total > 0) {
    const list = document.createElement('ul');
    list.className = 'movie-list';
    list.setAttribute('role', 'list');

    movies.forEach(movie => {
      list.appendChild(createMovieElement(movie));
    });

    col.appendChild(list);
  }

  // Restore scroll position
  col.scrollTop = scrollTop;
}

function renderAll() {
  renderColumn('english');
  renderColumn('hindi');
}

// ---- Modal ----
function openModal() {
  modalState.open = true;
  modalState.titleInput = '';
  modalState.selectedLanguage = 'english';

  const modal = document.getElementById('add-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const fab = document.getElementById('fab');
  const input = document.getElementById('movie-title-input');
  const submitBtn = document.getElementById('modal-submit');

  modal.classList.add('open');
  backdrop.classList.add('visible');
  fab.classList.add('modal-open');

  updateLangToggle();
  input.value = '';
  submitBtn.disabled = true;

  // Focus input after transition
  setTimeout(() => input.focus(), 260);
}

function closeModal() {
  modalState.open = false;

  const modal = document.getElementById('add-modal');
  const backdrop = document.getElementById('modal-backdrop');
  const fab = document.getElementById('fab');
  const input = document.getElementById('movie-title-input');

  modal.classList.remove('open');
  backdrop.classList.remove('visible');
  fab.classList.remove('modal-open');

  input.blur();
}

function updateLangToggle() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    const lang = btn.dataset.lang;
    btn.classList.toggle('selected', lang === modalState.selectedLanguage);
  });
}

function handleSubmit() {
  const title = modalState.titleInput.trim();
  if (!title) return;

  const newMovie = addMovie(title, modalState.selectedLanguage);
  if (newMovie) {
    closeModal();
    // Brief delay then highlight the new item
    setTimeout(() => {
      const el = document.querySelector(`[data-movie-id="${newMovie.id}"]`);
      if (el) el.classList.add('entering');
    }, 50);
  }
}

// ---- Event Wiring ----
function init() {
  // Render initial state
  renderAll();

  // FAB
  const fab = document.getElementById('fab');
  fab.addEventListener('click', () => {
    if (modalState.open) {
      closeModal();
    } else {
      openModal();
    }
  });

  // Backdrop
  const backdrop = document.getElementById('modal-backdrop');
  backdrop.addEventListener('click', closeModal);

  // Language toggle buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalState.selectedLanguage = btn.dataset.lang;
      updateLangToggle();
    });
  });

  // Title input
  const input = document.getElementById('movie-title-input');
  const submitBtn = document.getElementById('modal-submit');

  input.addEventListener('input', (e) => {
    modalState.titleInput = e.target.value;
    submitBtn.disabled = !e.target.value.trim();
  });

  // Submit button
  submitBtn.addEventListener('click', handleSubmit);

  // Enter key to submit
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && modalState.titleInput.trim()) {
      handleSubmit();
    }
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // Escape to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalState.open) {
      closeModal();
    }
  });

  // Click outside movie items to deselect
  document.addEventListener('click', (e) => {
    if (activeItemId && !e.target.closest('.movie-item')) {
      activeItemId = null;
      renderAll();
    }
  });

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration failed:', err);
    });
  }
}

// ---- Start ----
document.addEventListener('DOMContentLoaded', init);
