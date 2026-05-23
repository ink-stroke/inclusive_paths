// Scene 0. The title is itself a tell.
//
// Resolution modes — each maps to one of the six verbs and gets logged
// into telemetry like any other scene:
//   click anywhere → 'push'   (active, wordless engagement)
//   any keystroke  → 'speak'  (declaration)
//   10s timeout    → 'wait'   (patience)
//
// Latency is deliberately NOT recorded — figuring out the affordance is
// not a clean tempo signal. The verb alone is the datum.

const TIMEOUT_MS = 10000;
const FADE_OUT_MS = 600;

export function showTitleCard(stage) {
  return new Promise((resolve) => {
    while (stage.firstChild) stage.removeChild(stage.firstChild);

    const card = document.createElement('div');
    card.className = 'title-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', 'Tell. Activate to begin.');

    const main = document.createElement('div');
    main.className = 'title-main';
    main.textContent = 'Tell.';

    const sub = document.createElement('div');
    sub.className = 'title-sub';
    sub.textContent = 'Do tell.';

    card.appendChild(main);
    card.appendChild(sub);
    stage.appendChild(card);

    // Fade in via transition (not animation) so JS-driven fade-out can take over.
    requestAnimationFrame(() => { card.style.opacity = '1'; });

    let resolved = false;
    let timer;

    function finish(verb) {
      if (resolved) return;
      resolved = true;
      window.removeEventListener('click', onClick);
      window.removeEventListener('keydown', onKey);
      clearTimeout(timer);
      card.style.opacity = '0';
      setTimeout(() => resolve(verb), FADE_OUT_MS);
    }

    const onClick = () => finish('push');
    const onKey   = () => finish('speak');
    timer = setTimeout(() => finish('wait'), TIMEOUT_MS);

    window.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
  });
}
