// State machine: scene phase → QTE phase → ending phase.
// Audio context is lazy-initialized on first click so autoplay policies
// don't block the QTE drone. Query param ?fast=1 compresses timing for testing.

import { Telemetry } from './telemetry.js';
import { scenes } from './scenes.js';
import { startMisdirectionClock } from './misdirection.js';
import { runQTE } from './qte.js';
import { standardEnding, autoDefaultEnding } from './endings.js';
import { initAudio } from './audio.js';
import { showTitleCard } from './title.js';

const params = new URLSearchParams(window.location.search);
const FAST = params.get('fast') === '1';
// Fast mode buffer is generous on purpose: a human-paced 10-scene + QTE run
// takes ~110-130s, and the misdirection collapses if the clock hits 0:00
// during gameplay. 180s leaves headroom for slower readers.
const ADVERTISED_SECONDS = FAST ? 180 : 1200;

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
    btn.addEventListener('focus',      () => { hoveredVerb = option.verb; });
    btn.addEventListener('click', () => {
      initAudio();
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
    runQTE(
      stage,
      () => standardEnding(stage),
      () => autoDefaultEnding(stage, telemetry),
    );
  }
}

startMisdirectionClock(ADVERTISED_SECONDS);
showTitleCard(stage).then(() => renderScene(scenes[sceneIndex]));
