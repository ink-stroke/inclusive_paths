// QTE in 3D. When the player commits the last verb, a tall dark figure
// rises ahead of them — placed relative to the camera so it's always
// dead-centre in their view. Ten seconds. Press E to Strike.
// Pressing E → onStrike(). Letting the timer expire → onAutoDefault().

import { THREE } from './three-setup.js';
import { makeVoxelGroup } from './voxel.js';
import { startQTEDrone, endQTEDrone } from './audio.js';

const QTE_SECONDS = 10;
const FIGURE_DISTANCE = 6;

export function buildQTEFigure(scene) {
  // Tall, dark, unresolved silhouette. Six cubes high, narrow.
  const cubes = [];
  for (let y = 0; y < 6; y++) cubes.push([0, y, 0]);
  cubes.push([-1, 3, 0]); cubes.push([1, 3, 0]); // arms hint
  const figure = makeVoxelGroup({ [0x141416]: cubes });
  figure.position.set(0, 0.5, -200); // off-stage initial
  scene.add(figure);
  return figure;
}

export function placeFigureAheadOfCamera(figure, camera) {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  dir.y = 0;
  dir.normalize();
  figure.position.set(
    camera.position.x + dir.x * FIGURE_DISTANCE,
    0.5,
    camera.position.z + dir.z * FIGURE_DISTANCE,
  );
  // Rotate figure to face camera.
  figure.lookAt(camera.position.x, 0.5, camera.position.z);
}

export function runQTE({ camera, hud, onStrike, onAutoDefault }) {
  hud.show('A figure stands before you. Press E to Strike.', QTE_SECONDS);

  let remaining = QTE_SECONDS;
  let resolved = false;
  startQTEDrone(QTE_SECONDS);

  const interval = setInterval(() => {
    remaining -= 1;
    hud.tick(remaining);
    if (remaining <= 0 && !resolved) {
      resolved = true;
      clearInterval(interval);
      endQTEDrone();
      window.removeEventListener('keydown', onKey);
      hud.hide();
      onAutoDefault();
    }
  }, 1000);

  const onKey = (e) => {
    if (resolved) return;
    if (e.code !== 'KeyE') return;
    resolved = true;
    clearInterval(interval);
    endQTEDrone();
    window.removeEventListener('keydown', onKey);
    hud.hide();
    onStrike();
  };
  window.addEventListener('keydown', onKey);
}
