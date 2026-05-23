// Replay awareness. localStorage flag persists across sessions.
// The point: knowing the trick doesn't let you opt out of it.

const KEY = 'tell.played';

export function hasPlayedBefore() {
  try { return localStorage.getItem(KEY) === '1'; }
  catch { return false; }
}

export function markPlayed() {
  try { localStorage.setItem(KEY, '1'); }
  catch { /* private mode — ignore */ }
}
