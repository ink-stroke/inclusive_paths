// The QTE: 10-second timer, single button, inverted reward.
// Pressing Strike → standard ending. Letting the timer expire → auto-default.

import { startQTEDrone, endQTEDrone } from './audio.js';

const QTE_SECONDS = 10;

export function runQTE(stage, onStrike, onAutoDefault) {
  while (stage.firstChild) stage.removeChild(stage.firstChild);

  const silhouette = document.createElement('div');
  silhouette.className = 'silhouette';
  silhouette.textContent = '—';
  stage.appendChild(silhouette);

  const prompt = document.createElement('p');
  prompt.className = 'qte-prompt';
  prompt.textContent = 'A figure stands at the foot of your bed. They have not moved.';
  stage.appendChild(prompt);

  const timer = document.createElement('div');
  timer.className = 'qte-timer';
  stage.appendChild(timer);

  const button = document.createElement('button');
  button.className = 'strike';
  button.textContent = 'Strike';
  stage.appendChild(button);

  let remaining = QTE_SECONDS;
  let resolved = false;
  timer.textContent = String(remaining);

  startQTEDrone(QTE_SECONDS);

  const interval = setInterval(() => {
    remaining -= 1;
    timer.textContent = String(remaining);
    if (remaining <= 0 && !resolved) {
      resolved = true;
      clearInterval(interval);
      endQTEDrone();
      onAutoDefault();
    }
  }, 1000);

  button.addEventListener('click', () => {
    if (resolved) return;
    resolved = true;
    clearInterval(interval);
    endQTEDrone();
    onStrike();
  });
}
