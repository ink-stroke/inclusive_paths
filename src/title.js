// Scene 0: the title card is itself a tell.
//   click → 'push'   (active, wordless engagement)
//   key   → 'speak'  (declaration)
//   timeout → 'wait' (patience)
// Latency is not recorded — figuring out the affordance isn't clean tempo data.
// The verb alone is the datum, and it feeds the same telemetry the encounters do.

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
      setTimeout(() => { card.remove(); resolve(verb); }, FADE_OUT_MS);
    }

    const onClick = () => finish('push');
    const onKey   = () => finish('speak');
    timer = setTimeout(() => finish('wait'), TIMEOUT_MS);

    window.addEventListener('click', onClick);
    window.addEventListener('keydown', onKey);
  });
}
