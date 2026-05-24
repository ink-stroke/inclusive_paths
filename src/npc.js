// Voxel humanoids: tiny figures stacked from cubes.
// Each "kind" returns a Group placed at the origin; the caller positions it.

import { makeVoxelGroup } from './voxel.js';

const SKIN     = 0xc6a48a;
const HAIR     = 0x3a2e22;
const TUNIC_A  = 0x4a4a5a;
const TUNIC_B  = 0x6a5a3a;
const ROBE     = 0x55556a;

export function makeSleepingTraveler() {
  // Lying on their side along +X, head at x=0.
  return makeVoxelGroup({
    [HAIR]:    [[0, 0, 0]],
    [SKIN]:    [[0, 0, 1]],
    [TUNIC_A]: [[1, 0, 0], [1, 0, 1], [2, 0, 0], [2, 0, 1], [3, 0, 0], [3, 0, 1]],
  });
}

export function makeChild() {
  // Sitting, head dropped forward.
  return makeVoxelGroup({
    [HAIR]:   [[0, 2, 0]],
    [SKIN]:   [[0, 1, 0]],
    [TUNIC_B]: [[0, 0, 0]],
  });
}

export function makeStrangersPair() {
  // Two figures facing each other across a one-cube gap.
  const a = makeVoxelGroup({
    [HAIR]:   [[0, 3, 0]],
    [SKIN]:   [[0, 2, 0]],
    [ROBE]:   [[0, 1, 0], [0, 0, 0]],
  });
  const b = makeVoxelGroup({
    [HAIR]:   [[2, 3, 0]],
    [SKIN]:   [[2, 2, 0]],
    [TUNIC_A]: [[2, 1, 0], [2, 0, 0]],
  });
  a.add(b);
  return a;
}
