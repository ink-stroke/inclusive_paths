// Drives scenes, then the QTE, then the ending.
// Trophy condition: do NOT press. The auto-default fires the composite.

import { Telemetry } from './telemetry.js';
import { composite } from './compositor.js';
import { scenes } from './scenes.js';
import { startMisdirectionClock } from './misdirection.js';

const QTE_SECONDS = 10;
const ADVERTISED_SECONDS = 120;

const stage = document.querySelector('#stage');
const telemetry = new Telemetry();
let sceneIndex = 0;

function clearStage() {
  while (stage.firstChild) stage.removeChild(stage.firstChild);
}

function renderScene(scene) {
  telemetry.markSceneStart();
  clearStage();

  const text = document.createElement('p');
  text.className = 'scene-text';
  text.textContent = scene.text;
  stage.appendChild(text);

  let hoveredVerb = null;
  scene.options.forEach((option) => {
    const btn = document.createElement('button');
    btn.className = 'choice';
    btn.textContent = option.label;
    btn.addEventListener('mouseenter', () => { hoveredVerb = option.verb; });
    btn.addEventListener('click', () => {
      if (hoveredVerb && hoveredVerb !== option.verb) {
        telemetry.recordHesitation();
      }
      telemetry.recordChoice(option.verb);
      advance();
    });
    stage.appendChild(btn);
  });
}

function advance() {
  sceneIndex += 1;
  if (sceneIndex < scenes.length) {
    renderScene(scenes[sceneIndex]);
  } else {
    runQTE();
  }
}

function runQTE() {
  clearStage();

  const silhouette = document.createElement('div');
  silhouette.className = 'silhouette';
  silhouette.textContent = '—';
  stage.appendChild(silhouette);

  const prompt = document.createElement('p');
  prompt.className = 'qte-prompt';
  prompt.textContent = 'A figure stands before you.';
  stage.appendChild(prompt);

  const timer = document.createElement('div');
  timer.className = 'qte-timer';
  stage.appendChild(timer);

  const button = document.createElement('button');
  button.className = 'strike';
  button.textContent = 'Strike';
  stage.appendChild(button);

  let remaining = QTE_SECONDS;
  timer.textContent = String(remaining);

  const interval = setInterval(() => {
    remaining -= 1;
    timer.textContent = String(remaining);
    if (remaining <= 0) {
      clearInterval(interval);
      autoDefault();
    }
  }, 1000);

  button.addEventListener('click', () => {
    clearInterval(interval);
    standardEnding();
  });
}

function standardEnding() {
  clearStage();
  const p = document.createElement('p');
  p.className = 'ending';
  p.textContent = 'It is done. You walk on.';
  stage.appendChild(p);
}

function autoDefault() {
  clearStage();

  const lines = composite(telemetry.summary());
  lines.forEach((line, i) => {
    const p = document.createElement('p');
    p.className = 'composite-line';
    p.textContent = line;
    p.style.animationDelay = `${i * 1.4}s`;
    stage.appendChild(p);
  });

  const over = document.createElement('p');
  over.className = 'game-over';
  over.textContent = 'GAME OVER';
  over.style.animationDelay = `${lines.length * 1.4 + 0.8}s`;
  stage.appendChild(over);
}

startMisdirectionClock(ADVERTISED_SECONDS);
renderScene(scenes[sceneIndex]);
