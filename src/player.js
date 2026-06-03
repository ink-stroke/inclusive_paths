// First-person controls, input-agnostic.
//
// Desktop: PointerLockControls for mouse-look + WASD keys.
// Touch:   external touch module rotates the camera + provides a joystick
//          vector consumed in update(); pointer-lock is unused.
//
// Movement is gated by inputEnabled. The same update() works for both
// input modes — it adds keyboard + touch direction vectors and integrates.

import { THREE, PointerLockControls } from './three-setup.js';

const SPEED = 5.5;

export function createPlayer(camera, domElement) {
  const controls = new PointerLockControls(camera, domElement);

  const keys = {};
  window.addEventListener('keydown', (e) => { keys[e.code] = true; });
  window.addEventListener('keyup',   (e) => { keys[e.code] = false; });

  let inputEnabled = false;
  let touchControls = null;
  let lockEnabled = false;

  domElement.addEventListener('click', () => {
    if (!lockEnabled || !inputEnabled) return;
    if (!controls.isLocked) controls.lock();
  });

  const direction = new THREE.Vector3();
  const forward = new THREE.Vector3();
  const right = new THREE.Vector3();
  const UP = new THREE.Vector3(0, 1, 0);

  function update(dt) {
    if (!inputEnabled) return;

    direction.set(0, 0, 0);
    if (keys['KeyW'] || keys['ArrowUp'])    direction.z -= 1;
    if (keys['KeyS'] || keys['ArrowDown'])  direction.z += 1;
    if (keys['KeyA'] || keys['ArrowLeft'])  direction.x -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) direction.x += 1;

    if (touchControls) {
      const m = touchControls.getMovement();
      direction.x += m.x;
      direction.z += m.z;
    }

    if (direction.lengthSq() > 0) direction.normalize();

    const dx = direction.x * SPEED * dt;
    const dz = direction.z * SPEED * dt;

    // Move along the camera's horizontal forward/right basis. Works whether
    // PointerLockControls owns rotation (desktop) or touch does (mobile).
    camera.getWorldDirection(forward);
    forward.y = 0;
    if (forward.lengthSq() > 0) forward.normalize();
    right.crossVectors(forward, UP).normalize();

    camera.position.addScaledVector(forward, -dz);
    camera.position.addScaledVector(right,    dx);
    camera.position.y = 1.7;
  }

  function setLockEnabled(b) { lockEnabled = b; }
  function setInputEnabled(b) { inputEnabled = b; }
  function setTouchControls(t) { touchControls = t; }

  return { controls, update, setLockEnabled, setInputEnabled, setTouchControls };
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
