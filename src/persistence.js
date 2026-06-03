// Mid-game save state, separate from the tell.played completion flag.
// Versioned so future schema changes can ignore stale blobs.
// Expires after 72 hours — abandoned saves don't haunt forever.

const KEY = 'tell.state';
const VERSION = 1;
const MAX_AGE_MS = 72 * 60 * 60 * 1000;

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify({
      ...state,
      version: VERSION,
      timestamp: Date.now(),
    }));
  } catch { /* quota / private mode */ }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw);
    if (s.version !== VERSION) return null;
    if (Date.now() - s.timestamp > MAX_AGE_MS) return null;
    return s;
  } catch {
    return null;
  }
}

export function clearState() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}
