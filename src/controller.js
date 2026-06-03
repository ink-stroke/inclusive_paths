// Orchestrates the voxel world: render loop, proximity → verb commitment,
// encounter pacing, transition to QTE, ending.
//
// Telemetry, compositor, replay, misdirection, and audio carry over unchanged
// from the text version — only the surface inverted.

import { THREE, createRenderer, createScene, createCamera, onResize } from './three-setup.js';
import { buildWorld, fadeOutEncounter } from './world.js';
import { COMMIT_RADIUS, QTE_Z } from './encounters.js';
import { createPlayer, findClosestGlow } from './player.js';
import { Telemetry } from './telemetry.js';
import { startMisdirectionClock } from './misdirection.js';
import { runQTE, buildQTEFigure, placeFigureAheadOfCamera } from './qte.js';
import { standardEnding, autoDefaultEnding } from './endings.js';
import { initAudio } from './audio.js';
import { createHUD } from './hud.js';
import { showOnboarding } from './onboarding.js';
import { showTitleCard } from './title.js';
import { hasPlayedBefore } from './replay.js';
import { createTouchControls, isTouchDevice } from './touch.js';

const params = new URLSearchParams(window.location.search);
const FAST = params.get('fast') === '1';
const ADVERTISED_SECONDS = FAST ? 180 : 1200;

const canvas = document.getElementById('canvas');
const renderer = createRenderer(canvas);
const scene = createScene();
const camera = createCamera();
onResize(renderer, camera);

const hud = createHUD();
const telemetry = new Telemetry();
const { encounterHandles } = buildWorld(scene);

// QTE figure pre-allocated; positioned relative to camera at QTE-start.
const qteFigure = buildQTEFigure(scene);
qteFigure.visible = false;

const { controls, update: updatePlayer, setLockEnabled, setInputEnabled, setTouchControls } = createPlayer(camera, renderer.domElement);

const TOUCH = isTouchDevice();
if (TOUCH) {
  setTouchControls(createTouchControls(camera, renderer.domElement));
}

document.addEventListener('pointerlockchange', () => {
  if (document.pointerLockElement === renderer.domElement) {
    hud.prompt('');
  } else if (!gameEnded && pregameDone) {
    hud.prompt('Click to resume.');
  }
});

let pregameDone = false;

// Pregame sequence: (onboarding if first-time) → title (Scene 0) →
// player click to lock pointer → exploration begins.
const overlayHost = document.getElementById('overlay');

const pregame = hasPlayedBefore()
  ? Promise.resolve()
  : showOnboarding(overlayHost);

pregame
  .then(() => showTitleCard(overlayHost))
  .then((openingVerb) => {
    initAudio();
    telemetry.recordChoice(openingVerb);
    pregameDone = true;
    setInputEnabled(true);
    if (TOUCH) {
      hud.prompt('Drag the left half to walk. Drag the right half to look.');
      renderer.domElement.addEventListener('touchstart', () => { hud.prompt(''); }, { once: true });
    } else {
      setLockEnabled(true);
      hud.prompt('Click to begin. WASD to walk. Mouse to look.');
    }
  });

// Encounter state.
let activeEncounterIndex = -1;
let sceneTextShownFor = new Set();
let gameEnded = false;
let phase = 'exploring'; // 'exploring' | 'transitioning' | 'qte' | 'ending'

function tryCommitEncounter() {
  if (phase !== 'exploring') return;

  // Find which encounter the player is closest to.
  const playerZ = camera.position.z;
  let nearest = null;
  let nearestDist = Infinity;
  encounterHandles.forEach((h, i) => {
    if (h.committed) return;
    const d = Math.abs(h.encounter.npcZ - playerZ);
    if (d < nearestDist) { nearestDist = d; nearest = { h, i }; }
  });
  if (!nearest || nearestDist > 8) return;

  // Show scene text once per encounter as the player approaches.
  if (!sceneTextShownFor.has(nearest.i) && nearestDist < 6) {
    sceneTextShownFor.add(nearest.i);
    hud.sceneText(nearest.h.encounter.text);
  }

  // Check proximity to either glow.
  const glowList = Object.values(nearest.h.glows);
  const { glow } = findClosestGlow(camera, glowList, COMMIT_RADIUS);
  if (!glow) {
    hud.prompt('');
    return;
  }

  // Within commit radius — log the verb, fade encounter, allow advance.
  const verb = glow.userData.verb;
  telemetry.markSceneStart();
  telemetry.recordChoice(verb);
  nearest.h.committed = verb;
  fadeOutEncounter(nearest.h);
  hud.prompt('');

  // If this was the last encounter, transition to QTE.
  if (encounterHandles.every((h) => h.committed)) {
    queueQTETransition();
  }
}

function queueQTETransition() {
  phase = 'transitioning';
  // Brief pause to let last encounter fade, then surface the QTE figure.
  setTimeout(() => {
    placeFigureAheadOfCamera(qteFigure, camera);
    qteFigure.visible = true;
    // Orient camera to centre the figure's mid-body. Mouse-look afterward
    // moves relative to this anchor.
    camera.lookAt(qteFigure.position.x, 3.0, qteFigure.position.z);
    phase = 'qte';
    runQTE({
      camera,
      hud,
      onStrike: () => {
        phase = 'ending';
        gameEnded = true;
        standardEnding(scene, qteFigure, hud);
      },
      onAutoDefault: () => {
        phase = 'ending';
        gameEnded = true;
        autoDefaultEnding(scene, qteFigure, hud, telemetry);
      },
    });
  }, 1500);
}

// Render loop.
const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();
  updatePlayer(dt);

  // Gentle pulse on glow markers so they read as interactive.
  const t = performance.now() / 600;
  encounterHandles.forEach((h) => {
    if (h.committed) return;
    Object.values(h.glows).forEach((g, i) => {
      if (!g.visible) return;
      g.position.y = 1.5 + Math.sin(t + i) * 0.08;
      g.rotation.y += dt * 0.4;
    });
  });

  tryCommitEncounter();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

startMisdirectionClock(ADVERTISED_SECONDS);

// Debug hook: when ?debug=1, expose internals for headless verification.
// Lets test drivers teleport the camera without needing pointer-lock.
if (params.get('debug') === '1') {
  window.__tell = { THREE, scene, camera, telemetry, encounterHandles, controls };
}

animate();
