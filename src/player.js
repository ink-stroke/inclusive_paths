// First-person controls: WASD walk, mouse look (PointerLockControls), no jump.
// Pointer-lock activates on first click; the harness handles re-lock-on-blur.
//
// Also exposes a per-frame update + a proximity check for encounter glows.

import { THREE, PointerLockControls } from './three-setup.js';

const SPEED = 5.5;

export function createPlayer(camera, domElement) {
  const controls = new PointerLockControls(camera, domElement);

  const keys = {};
  window.addEventListener('keydown', (e) => { keys[e.code] = true; });
  window.addEventListener('keyup',   (e) => { keys[e.code] = false; });

  let lockEnabled = false;
  domElement.addEventListener('click', () => {
    if (lockEnabled && !controls.isLocked) controls.lock();
  });

  const velocity = new THREE.Vector3();
  const direction = new THREE.Vector3();

  function update(dt) {
    if (!controls.isLocked) return;
    direction.set(0, 0, 0);
    if (keys['KeyW'] || keys['ArrowUp'])    direction.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown'])  direction.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft'])  direction.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) direction.x += 1;
    if (direction.lengthSq() > 0) direction.normalize();

    velocity.x = direction.x * SPEED * dt;
    velocity.z = direction.z * SPEED * dt;
    controls.moveRight(velocity.x);
    controls.moveForward(-velocity.z);

    // Clamp y to a fixed walking height.
    camera.position.y = 1.7;
  }

  function setLockEnabled(b) { lockEnabled = b; }

  return { controls, update, setLockEnabled };
}

export function findClosestGlow(camera, glowsArray, maxDist) {
  let best = null;
  let bestDist = maxDist;
  const cp = camera.position;
  for (const g of glowsArray) {
    if (!g.visible) continue;
    const dx = g.position.x - cp.x;
    const dz = g.position.z - cp.z;
    const d  = Math.hypot(dx, dz);
    if (d < bestDist) { bestDist = d; best = g; }
  }
  return { glow: best, dist: bestDist };
}
