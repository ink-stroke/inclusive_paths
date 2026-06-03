// Touch controls for mobile / tablet.
// Left half of the screen → virtual joystick (movement).
// Right half → drag camera (look).
// Multitouch: both can run simultaneously, tracked by touch.identifier.
//
// Visual joystick anchor + thumb appears at the start position of the
// left-half touch and follows the finger.

import { THREE } from './three-setup.js';

const JOYSTICK_RADIUS = 80;
const CAMERA_SENSITIVITY = 0.0042;

export function isTouchDevice() {
  return window.matchMedia('(pointer: coarse)').matches;
}

export function createTouchControls(camera, domElement) {
  // Visual elements.
  const anchor = document.createElement('div');
  anchor.className = 'joystick-anchor';
  const thumb = document.createElement('div');
  thumb.className = 'joystick-thumb';
  document.body.appendChild(anchor);
  document.body.appendChild(thumb);

  let joyId = null;
  let joyAX = 0, joyAY = 0;
  let joyX = 0, joyZ = 0;

  let camId = null;
  let camLX = 0, camLY = 0;

  function showJoystick(active, ax, ay, tx, ty) {
    if (active) {
      anchor.style.opacity = '0.35';
      anchor.style.left = `${ax - 60}px`;
      anchor.style.top  = `${ay - 60}px`;
      thumb.style.opacity = '0.6';
      thumb.style.left = `${tx - 22}px`;
      thumb.style.top  = `${ty - 22}px`;
    } else {
      anchor.style.opacity = '0';
      thumb.style.opacity = '0';
    }
  }

  function start(e) {
    for (const t of e.changedTouches) {
      const half = window.innerWidth / 2;
      if (t.clientX < half && joyId === null) {
        joyId = t.identifier;
        joyAX = t.clientX; joyAY = t.clientY;
        joyX = 0; joyZ = 0;
        showJoystick(true, joyAX, joyAY, joyAX, joyAY);
      } else if (t.clientX >= half && camId === null) {
        camId = t.identifier;
        camLX = t.clientX; camLY = t.clientY;
      }
    }
  }

  const euler = new THREE.Euler(0, 0, 0, 'YXZ');
  const PITCH_LIMIT = Math.PI / 2 - 0.01;

  function move(e) {
    e.preventDefault();
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) {
        const dx = t.clientX - joyAX;
        const dy = t.clientY - joyAY;
        const dist = Math.hypot(dx, dy);
        const clamped = Math.min(dist, JOYSTICK_RADIUS);
        const nx = dist ? dx / dist : 0;
        const ny = dist ? dy / dist : 0;
        const scale = clamped / JOYSTICK_RADIUS;
        joyX = nx * scale;
        joyZ = ny * scale;
        showJoystick(true, joyAX, joyAY, joyAX + nx * clamped, joyAY + ny * clamped);
      } else if (t.identifier === camId) {
        const dx = t.clientX - camLX;
        const dy = t.clientY - camLY;
        camLX = t.clientX; camLY = t.clientY;
        euler.setFromQuaternion(camera.quaternion, 'YXZ');
        euler.y -= dx * CAMERA_SENSITIVITY;
        euler.x -= dy * CAMERA_SENSITIVITY;
        euler.x = Math.max(-PITCH_LIMIT, Math.min(PITCH_LIMIT, euler.x));
        camera.quaternion.setFromEuler(euler);
      }
    }
  }

  function end(e) {
    for (const t of e.changedTouches) {
      if (t.identifier === joyId) {
        joyId = null;
        joyX = 0; joyZ = 0;
        showJoystick(false);
      } else if (t.identifier === camId) {
        camId = null;
      }
    }
  }

  domElement.addEventListener('touchstart', start, { passive: false });
  domElement.addEventListener('touchmove',  move,  { passive: false });
  domElement.addEventListener('touchend',   end);
  domElement.addEventListener('touchcancel', end);

  return {
    getMovement: () => ({ x: joyX, z: joyZ }),
    setVisible: (v) => {
      anchor.style.display = v ? '' : 'none';
      thumb.style.display  = v ? '' : 'none';
    },
  };
}
