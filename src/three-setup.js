// Three.js loaded as ES modules from a CDN — no build step.
// Pinned to a known-good version; bumping requires re-testing PointerLockControls.

import * as THREE from '../vendor/three/three.module.js';
import { PointerLockControls } from '../vendor/three/PointerLockControls.js';

export { THREE, PointerLockControls };

export function createRenderer(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x050505, 1);
  return renderer;
}

export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.028);

  const ambient = new THREE.AmbientLight(0x252535, 0.55);
  const moon = new THREE.DirectionalLight(0xb8c8e0, 0.55);
  moon.position.set(20, 30, 12);
  scene.add(ambient, moon);

  return scene;
}

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    72, window.innerWidth / window.innerHeight, 0.1, 200,
  );
  camera.position.set(0, 1.7, 5);
  return camera;
}

export function onResize(renderer, camera) {
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}
