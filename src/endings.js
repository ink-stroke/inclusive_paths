// Endings in the voxel world.
//
// Standard ending: figure dissolves, "you walk on" overlay.
// Auto-default: figure rebuilds in front of the player as a composite —
// its silhouette literally assembled from the player's dominant verb's color,
// with hesitation-driven asymmetry baked in. Closing-line overlay narrates.

import { THREE } from './three-setup.js';
import { makeVoxelGroup } from './voxel.js';
import { composite } from './compositor.js';
import { hasPlayedBefore, markPlayed } from './replay.js';

const VERB_COLOR = {
  take:  0xd4a849,
  give:  0xa9d149,
  wait:  0x5b85b5,
  hide:  0x6a6a6a,
  push:  0xc25040,
  speak: 0xc9b58a,
  none:  0x9090a0,
};

export function standardEnding(scene, figure, hud) {
  // The figure simply falls — voxels offset downward, fade away.
  const start = performance.now();
  const dur = 1200;
  function tick() {
    const t = Math.min(1, (performance.now() - start) / dur);
    figure.position.y = 0.5 - t * 0.8;
    figure.traverse((o) => {
      if (o.material) { o.material.transparent = true; o.material.opacity = 1 - t; }
    });
    if (t < 1) requestAnimationFrame(tick);
    else { figure.visible = false; hud.standardEndingText('The figure offers no resistance. You strike. They are no one in particular. You walk on.'); markPlayed(); }
  }
  tick();
}

export function autoDefaultEnding(scene, figure, hud, telemetry) {
  // Replace the dark figure with the composite figure built from the player's tells.
  scene.remove(figure);

  const result = composite(telemetry.summary());
  const color = VERB_COLOR[result.dominantVerb] || VERB_COLOR.none;

  const hes = telemetry.summary().hesitations;
  const wobble = Math.min(2, hes);

  // A body wide enough to read as a body, not a stick.
  const cubes = [
    // Torso 3 wide × 3 tall
    [-1, 2, 0], [0, 2, 0], [1, 2, 0],
    [-1, 3, 0], [0, 3, 0], [1, 3, 0],
    [-1, 4, 0], [0, 4, 0], [1, 4, 0],
    // Legs
    [0, 0, 0], [0, 1, 0],
    // Neck
    [0, 5, 0],
    // Head (3-wide cap)
    [-1, 6, 0], [0, 6, 0], [1, 6, 0],
  ];
  // Outstretched arms grow with hesitation count.
  for (let i = 0; i <= wobble; i++) {
    cubes.push([-2 - i, 3, 0]);
    cubes.push([ 2 + i, 3, 0]);
  }
  // Decisive players' figures get a crown cube — they presented themselves.
  if (result.profile.endsWith('decisive')) {
    cubes.push([0, 7, 0]);
  }

  const compositeFigure = makeVoxelGroup({ [color]: cubes });
  // Unlit material so the climax reads vividly against the dark world.
  compositeFigure.traverse((obj) => {
    if (obj.material) {
      obj.material.dispose && obj.material.dispose();
      obj.material = new THREE.MeshBasicMaterial({ color });
    }
  });
  compositeFigure.position.set(figure.position.x, 0.5, figure.position.z);
  scene.add(compositeFigure);

  // Brief emerge animation: scale 0 → 1.
  const start = performance.now();
  const dur = 1400;
  compositeFigure.scale.set(0, 0, 0);
  function tick() {
    const t = Math.min(1, (performance.now() - start) / dur);
    const s = t * t * (3 - 2 * t);
    compositeFigure.scale.set(s, s, s);
    if (t < 1) requestAnimationFrame(tick);
    else {
      // Narrate after figure has fully formed.
      const lines = result.lines.slice();
      if (hasPlayedBefore()) {
        lines.push('You came back. There is no second tell — only the one you have now performed twice.');
      }
      hud.endingText(lines, { profile: result.profile, verb: result.dominantVerb });
      markPlayed();
    }
  }
  tick();

  return compositeFigure;
}
