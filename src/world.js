// Builds the world: ground, path stones, encounter clearings, glow markers.
// Returns handles for the controller to drive (encounter activation, glow fades).

import { THREE } from './three-setup.js';
import { makeVoxelGroup, makeGlow } from './voxel.js';
import { ENCOUNTERS, QTE_Z } from './encounters.js';

const GROUND_COLOR  = 0x18181c;
const PATH_COLOR    = 0x2a261e;
const GRASS_COLORS  = [0x1a2218, 0x1c2a1c, 0x222a1e];

export function buildWorld(scene) {
  // Ground: a long strip of dark voxel cells with some grass texture variation.
  const groundCells = { [GROUND_COLOR]: [] };
  for (const c of GRASS_COLORS) groundCells[c] = [];
  for (let x = -20; x <= 20; x++) {
    for (let z = 5; z >= QTE_Z - 8; z--) {
      // Path is two voxels wide centered on x=0.
      if (Math.abs(x) <= 1) continue; // skip path region
      const variant = Math.abs((x * 7 + z * 3) % 11);
      if (variant < 2) groundCells[GRASS_COLORS[0]].push([x, -0.5, z]);
      else if (variant < 4) groundCells[GRASS_COLORS[1]].push([x, -0.5, z]);
      else if (variant < 6) groundCells[GRASS_COLORS[2]].push([x, -0.5, z]);
      else groundCells[GROUND_COLOR].push([x, -0.5, z]);
    }
  }
  scene.add(makeVoxelGroup(groundCells));

  // Path: a strip of warmer voxels down the middle.
  const pathCells = { [PATH_COLOR]: [] };
  for (let z = 5; z >= QTE_Z - 8; z--) {
    for (let x = -1; x <= 1; x++) {
      pathCells[PATH_COLOR].push([x, -0.5, z]);
    }
  }
  scene.add(makeVoxelGroup(pathCells));

  // Encounters: NPCs + glow markers.
  const encounterHandles = ENCOUNTERS.map((enc) => {
    const npc = enc.npcFactory();
    npc.position.set(enc.npcOffset.x, enc.npcOffset.y, enc.npcZ + enc.npcOffset.z);
    scene.add(npc);

    const glows = {};
    for (const [verb, choice] of Object.entries(enc.choices)) {
      const glow = makeGlow(choice.color);
      glow.position.set(choice.pos[0], choice.pos[1], choice.pos[2]);
      glow.userData = { verb, encounterId: enc.id, label: choice.label };
      scene.add(glow);
      glows[verb] = glow;
    }

    return { encounter: enc, npc, glows, committed: null };
  });

  return { encounterHandles };
}

export function fadeOutEncounter(handle) {
  // Quickly fade NPC and remaining glow once a verb is committed.
  const targets = [handle.npc, ...Object.values(handle.glows)];
  const start = performance.now();
  const duration = 800;

  function tick() {
    const t = Math.min(1, (performance.now() - start) / duration);
    targets.forEach((obj) => {
      obj.traverse((o) => {
        if (o.material) {
          o.material.transparent = true;
          o.material.opacity = 1 - t;
        }
      });
    });
    if (t < 1) requestAnimationFrame(tick);
    else targets.forEach((o) => o.visible = false);
  }
  tick();
}
