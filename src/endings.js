// Three endings: standard (button press), auto-default (timer expiry),
// and a replay-aware coda that lands only on second+ playthroughs.

import { composite } from './compositor.js';
import { hasPlayedBefore, markPlayed } from './replay.js';

function clear(stage) {
  while (stage.firstChild) stage.removeChild(stage.firstChild);
}

export function standardEnding(stage) {
  clear(stage);
  const p = document.createElement('p');
  p.className = 'ending';
  p.textContent = 'The figure offers no resistance. You strike. They are no one in particular. You walk on.';
  stage.appendChild(p);
  markPlayed();
}

export function autoDefaultEnding(stage, telemetry) {
  clear(stage);

  const knownAlready = hasPlayedBefore();
  const result = composite(telemetry.summary());

  document.body.classList.add(
    `composite-${result.profile}`,
    `verb-${result.dominantVerb}`,
  );

  result.lines.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 'composite-line';
    p.textContent = line;
    p.style.animationDelay = `${i * 1.4}s`;
    stage.appendChild(p);
  });

  const over = document.createElement('p');
  over.className = 'game-over';
  over.textContent = 'GAME OVER';
  over.style.animationDelay = `${result.lines.length * 1.4 + 0.8}s`;
  stage.appendChild(over);

  if (knownAlready) {
    const coda = document.createElement('p');
    coda.className = 'replay-coda';
    coda.textContent = 'You came back. There is no second tell — only the one you have now performed twice.';
    coda.style.animationDelay = `${result.lines.length * 1.4 + 3.0}s`;
    stage.appendChild(coda);
  }

  markPlayed();
}
