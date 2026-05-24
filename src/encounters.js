// Three encounters, arranged along the -Z axis. Each is a "clearing"
// the player walks into: an NPC (visual), two glowing choice objects,
// and a fallback verb if the player exits without committing.
//
// Spatial choice: walking within COMMIT_RADIUS of a glow commits that verb.
// The other glow fades. The path forward becomes visible past the clearing.

import { makeSleepingTraveler, makeChild, makeStrangersPair } from './npc.js';

export const COMMIT_RADIUS = 1.8;

// Verb colors mirror the original design tells.
const COLOR_TAKE  = 0xd4a849;  // gold — coin
const COLOR_GIVE  = 0xa9d149;  // soft green — care
const COLOR_WAIT  = 0x5b85b5;  // pale blue — patience
const COLOR_HIDE  = 0x6a6a6a;  // grey — passing through
const COLOR_PUSH  = 0xc25040;  // red — force
const COLOR_SPEAK = 0xc9b58a;  // warm — voice

export const ENCOUNTERS = [
  {
    id: 'traveler',
    npcZ: -16,
    text: 'A traveler sleeps by the road, a coin purse open in their lap.',
    npcFactory: makeSleepingTraveler,
    npcOffset: { x: -1.5, y: 0.5, z: 0 },
    choices: {
      take: { color: COLOR_TAKE, pos: [1.5, 1.5, -16], label: 'a coin purse' },
      wait: { color: COLOR_WAIT, pos: [-4, 1.5, -16], label: 'a thinning tree' },
    },
  },
  {
    id: 'child',
    npcZ: -40,
    text: 'A child sits crying. You carry a small wooden bird.',
    npcFactory: makeChild,
    npcOffset: { x: 0, y: 0, z: 0 },
    choices: {
      give: { color: COLOR_GIVE, pos: [0.5, 1.5, -40], label: 'the wooden bird' },
      hide: { color: COLOR_HIDE, pos: [3.5, 1.5, -42], label: 'the path beyond' },
    },
  },
  {
    id: 'bridge',
    npcZ: -64,
    text: 'Two strangers argue in low voices on the narrow bridge.',
    npcFactory: makeStrangersPair,
    npcOffset: { x: -1, y: 0.5, z: 0 },
    choices: {
      push:  { color: COLOR_PUSH,  pos: [1, 1.5, -64], label: 'shoulder through' },
      speak: { color: COLOR_SPEAK, pos: [-3, 1.5, -64], label: 'address them' },
    },
  },
];

// After the last encounter, the QTE waits at this Z.
export const QTE_Z = -84;
