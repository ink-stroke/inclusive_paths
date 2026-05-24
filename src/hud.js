// Minimal DOM overlay layer over the canvas. Used for prompts the world
// can't speak on its own: interaction hints, QTE timer, ending text.

export function createHUD() {
  const hud = document.getElementById('hud');
  const overlay = document.getElementById('overlay');

  function clear() {
    while (hud.firstChild) hud.removeChild(hud.firstChild);
    while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
  }

  function prompt(text) {
    while (hud.firstChild) hud.removeChild(hud.firstChild);
    if (!text) return;
    const p = document.createElement('div');
    p.className = 'hud-prompt';
    p.textContent = text;
    hud.appendChild(p);
  }

  function sceneText(text) {
    const p = document.createElement('div');
    p.className = 'scene-banner';
    p.textContent = text;
    p.setAttribute('aria-live', 'polite');
    overlay.appendChild(p);
    setTimeout(() => p.classList.add('fade-out'), 4500);
    setTimeout(() => p.remove(), 5800);
  }

  let qteTimer = null;
  function show(text, seconds) {
    while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
    const wrap = document.createElement('div');
    wrap.className = 'qte-card';
    wrap.setAttribute('aria-live', 'assertive');

    const msg = document.createElement('div');
    msg.className = 'qte-msg';
    msg.textContent = text;
    wrap.appendChild(msg);

    qteTimer = document.createElement('div');
    qteTimer.className = 'qte-timer';
    qteTimer.textContent = String(seconds);
    wrap.appendChild(qteTimer);

    overlay.appendChild(wrap);
  }

  function tick(remaining) {
    if (qteTimer) qteTimer.textContent = String(remaining);
  }

  function hide() {
    while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
    qteTimer = null;
  }

  function endingText(lines, { profile = '', verb = '' } = {}) {
    while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
    document.body.classList.add(`composite-${profile}`, `verb-${verb}`);

    const wrap = document.createElement('div');
    wrap.className = 'ending-card';
    wrap.setAttribute('aria-live', 'polite');

    lines.forEach((line, i) => {
      const p = document.createElement('p');
      p.className = 'composite-line';
      p.textContent = line;
      p.style.animationDelay = `${i * 1.4}s`;
      wrap.appendChild(p);
    });

    const over = document.createElement('p');
    over.className = 'game-over';
    over.textContent = 'GAME OVER';
    over.style.animationDelay = `${lines.length * 1.4 + 0.8}s`;
    wrap.appendChild(over);

    overlay.appendChild(wrap);
  }

  function standardEndingText(text) {
    while (overlay.firstChild) overlay.removeChild(overlay.firstChild);
    const p = document.createElement('p');
    p.className = 'ending standalone';
    p.textContent = text;
    p.setAttribute('aria-live', 'polite');
    overlay.appendChild(p);
  }

  return { prompt, sceneText, show, tick, hide, endingText, standardEndingText, clear };
}
