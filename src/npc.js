// Voxel NPCs and props. Each factory returns a Group positioned at origin;
// the caller sets its world position. Style: stylized stacks of cubes —
// not realistic, but distinct enough that each encounter reads.

import { makeVoxelGroup } from './voxel.js';

const SKIN     = 0xc6a48a;
const HAIR_DK  = 0x3a2e22;
const HAIR_GR  = 0x9a9a9a;
const TUNIC_A  = 0x4a4a5a;
const TUNIC_B  = 0x6a5a3a;
const TUNIC_C  = 0x55556a;
const ROBE     = 0x55556a;
const APRON    = 0x7a5a3a;
const ARMOR    = 0x6a7080;
const HELM     = 0x808088;
const FUR      = 0x3a2a18;
const WOOD     = 0x6a4a26;
const STONE    = 0x303034;
const CLOTH    = 0x88665a;

export function makeSleepingTraveler() {
  return makeVoxelGroup({
    [HAIR_DK]: [[0, 0, 0]],
    [SKIN]:    [[0, 0, 1]],
    [TUNIC_A]: [[1, 0, 0], [1, 0, 1], [2, 0, 0], [2, 0, 1], [3, 0, 0], [3, 0, 1]],
  });
}

export function makeChild() {
  return makeVoxelGroup({
    [HAIR_DK]: [[0, 2, 0]],
    [SKIN]:    [[0, 1, 0]],
    [TUNIC_B]: [[0, 0, 0]],
  });
}

export function makeStrangersPair() {
  const a = makeVoxelGroup({
    [HAIR_DK]: [[0, 3, 0]],
    [SKIN]:    [[0, 2, 0]],
    [ROBE]:    [[0, 1, 0], [0, 0, 0]],
  });
  const b = makeVoxelGroup({
    [HAIR_DK]: [[2, 3, 0]],
    [SKIN]:    [[2, 2, 0]],
    [TUNIC_A]: [[2, 1, 0], [2, 0, 0]],
  });
  a.add(b);
  return a;
}

export function makeVendor() {
  // Standing figure beside a tumbled basket of fruit.
  const figure = makeVoxelGroup({
    [HAIR_DK]: [[0, 5, 0]],
    [SKIN]:    [[0, 4, 0]],
    [APRON]:   [[0, 3, 0], [0, 2, 0], [-1, 3, 0], [1, 3, 0]],
    [TUNIC_B]: [[0, 1, 0], [-1, 0, 0], [1, 0, 0]],
  });
  const fruit = makeVoxelGroup({
    [0xa83030]: [[2, 0, 0], [2, 0, 1]],   // apples
    [0xd87020]: [[3, 0, 0]],              // peach
    [WOOD]:     [[2, 0, -1], [3, 0, -1]], // basket
  });
  figure.add(fruit);
  return figure;
}

export function makeTavernPatrons() {
  // Two figures slumped at a table — the quarrel inside.
  const a = makeVoxelGroup({
    [HAIR_GR]: [[0, 2, 0]],
    [SKIN]:    [[0, 1, 0]],
    [TUNIC_A]: [[0, 0, 0]],
  });
  const b = makeVoxelGroup({
    [HAIR_DK]: [[2, 2, 0]],
    [SKIN]:    [[2, 1, 0]],
    [TUNIC_B]: [[2, 0, 0]],
  });
  const table = makeVoxelGroup({
    [WOOD]: [[1, 0, 0], [1, 1, 0]],
  });
  a.add(b); a.add(table);
  return a;
}

export function makeGuard() {
  return makeVoxelGroup({
    [HELM]:   [[0, 6, 0]],
    [SKIN]:   [[0, 5, 0]],
    [ARMOR]:  [[0, 4, 0], [0, 3, 0], [0, 2, 0], [-1, 4, 0], [1, 4, 0], [-1, 3, 0], [1, 3, 0]],
    [TUNIC_C]:[[0, 1, 0], [-1, 0, 0], [1, 0, 0]],
  });
}

export function makeOldWoman() {
  // Bent, small. A cup floats beside her hand.
  const figure = makeVoxelGroup({
    [HAIR_GR]: [[0, 3, 0]],
    [SKIN]:    [[0, 2, 0]],
    [CLOTH]:   [[0, 1, 0], [-1, 1, 0], [0, 0, 0]],
  });
  const cup = makeVoxelGroup({
    [WOOD]: [[1, 1, 0]],
  });
  figure.add(cup);
  return figure;
}

export function makeStruckDog() {
  // Small low animal, lying on its side. Smaller than the humanoids.
  return makeVoxelGroup({
    [FUR]:  [[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0]],
    [SKIN]: [[0, 0, 1]], // pink tongue
  });
}

export function makeMerchant() {
  // Standing figure with a satchel of letters.
  const figure = makeVoxelGroup({
    [HAIR_DK]: [[0, 5, 0]],
    [SKIN]:    [[0, 4, 0]],
    [ROBE]:    [[0, 3, 0], [0, 2, 0], [-1, 3, 0], [1, 3, 0]],
    [TUNIC_C]: [[0, 1, 0], [-1, 0, 0], [1, 0, 0]],
  });
  const satchel = makeVoxelGroup({
    [CLOTH]:    [[1, 2, 0]],
    [0xe8d8b0]: [[1, 3, 0]], // letter peeking out
  });
  figure.add(satchel);
  return figure;
}

export function makeDoorAndBed() {
  // Interior scene: a doorway voxel frame on one side, a bed voxel mass on the other.
  // Player stands between them when the encounter activates.
  const door = makeVoxelGroup({
    [WOOD]: [
      [0, 0, 0], [0, 1, 0], [0, 2, 0], [0, 3, 0], [0, 4, 0],
      [2, 0, 0], [2, 1, 0], [2, 2, 0], [2, 3, 0], [2, 4, 0],
      [1, 4, 0],
    ],
  });
  const bed = makeVoxelGroup({
    [WOOD]:  [[-5, 0, 0], [-5, 0, 1], [-4, 0, 0], [-4, 0, 1], [-3, 0, 0], [-3, 0, 1]],
    [CLOTH]: [[-5, 1, 0], [-5, 1, 1], [-4, 1, 0], [-4, 1, 1], [-3, 1, 0], [-3, 1, 1]],
  });
  door.add(bed);
  return door;
}
