// Ten encounters along a path. Each is a clearing: an NPC in the centre,
// two coloured glow markers floating on either side. The player commits a
// verb by walking close to one marker.
//
// Spacing: every 24 units along -Z. QTE waits past the last encounter.

import {
  makeSleepingTraveler,
  makeChild,
  makeStrangersPair,
  makeVendor,
  makeTavernPatrons,
  makeGuard,
  makeOldWoman,
  makeStruckDog,
  makeMerchant,
  makeDoorAndBed,
} from './npc.js';

export const COMMIT_RADIUS = 1.8;

// Verb colours — mirror the original design tells.
const COLOR_TAKE  = 0xd4a849;
const COLOR_GIVE  = 0xa9d149;
const COLOR_WAIT  = 0x5b85b5;
const COLOR_HIDE  = 0x6a6a6a;
const COLOR_PUSH  = 0xc25040;
const COLOR_SPEAK = 0xc9b58a;

const SPACING = 24;
const FIRST_Z = -16;

function z(n) { return FIRST_Z - (n - 1) * SPACING; }

export const ENCOUNTERS = [
  {
    id: 'traveler',
    npcZ: z(1),
    text: 'A traveler sleeps by the road, a coin purse open in their lap.',
    npcFactory: makeSleepingTraveler,
    npcOffset: { x: -1.5, y: 0.5, z: 0 },
    choices: {
      take: { color: COLOR_TAKE, pos: [1.5, 1.5, z(1)] },
      wait: { color: COLOR_WAIT, pos: [-4, 1.5, z(1)] },
    },
  },
  {
    id: 'child',
    npcZ: z(2),
    text: 'A child sits crying. You carry a small wooden bird.',
    npcFactory: makeChild,
    npcOffset: { x: 0, y: 0, z: 0 },
    choices: {
      give: { color: COLOR_GIVE, pos: [0.5, 1.5, z(2)] },
      hide: { color: COLOR_HIDE, pos: [3.5, 1.5, z(2) + 2] },
    },
  },
  {
    id: 'bridge',
    npcZ: z(3),
    text: 'Two strangers argue in low voices on the narrow bridge.',
    npcFactory: makeStrangersPair,
    npcOffset: { x: -1, y: 0.5, z: 0 },
    choices: {
      push:  { color: COLOR_PUSH,  pos: [1, 1.5, z(3)] },
      speak: { color: COLOR_SPEAK, pos: [-3, 1.5, z(3)] },
    },
  },
  {
    id: 'vendor',
    npcZ: z(4),
    text: 'A vendor has dropped a basket of fruit. The town gate is twenty paces ahead.',
    npcFactory: makeVendor,
    npcOffset: { x: -1, y: 0.5, z: 0 },
    choices: {
      give: { color: COLOR_GIVE, pos: [1.5, 1.5, z(4)] },
      take: { color: COLOR_TAKE, pos: [-3.5, 1.5, z(4) - 2] },
    },
  },
  {
    id: 'tavern',
    npcZ: z(5),
    text: 'You overhear a quarrel inside a tavern as you pass the open door.',
    npcFactory: makeTavernPatrons,
    npcOffset: { x: -2, y: 0.5, z: -1 },
    choices: {
      wait: { color: COLOR_WAIT, pos: [-1.5, 1.5, z(5)] },
      hide: { color: COLOR_HIDE, pos: [3, 1.5, z(5) + 1] },
    },
  },
  {
    id: 'guard',
    npcZ: z(6),
    text: 'A guard demands to see what is in your pack.',
    npcFactory: makeGuard,
    npcOffset: { x: 0, y: 0.5, z: 0 },
    choices: {
      push:  { color: COLOR_PUSH,  pos: [-3, 1.5, z(6) - 1] },
      speak: { color: COLOR_SPEAK, pos: [2.5, 1.5, z(6)] },
    },
  },
  {
    id: 'old-woman',
    npcZ: z(7),
    text: 'An old woman asks if you have walked far. Her hands shake holding a cup of water she has poured for you.',
    npcFactory: makeOldWoman,
    npcOffset: { x: -1, y: 0.5, z: 0 },
    choices: {
      give: { color: COLOR_GIVE, pos: [1.5, 1.5, z(7)] },
      wait: { color: COLOR_WAIT, pos: [-3.5, 1.5, z(7) + 1] },
    },
  },
  {
    id: 'dog',
    npcZ: z(8),
    text: 'A dog has been struck by a cart. It is breathing fast. The driver is already twenty steps gone.',
    npcFactory: makeStruckDog,
    npcOffset: { x: 0, y: 0.5, z: 0 },
    choices: {
      hide: { color: COLOR_HIDE, pos: [3, 1.5, z(8) - 2] },
      take: { color: COLOR_TAKE, pos: [-2.5, 1.5, z(8)] },
    },
  },
  {
    id: 'merchant',
    npcZ: z(9),
    text: 'A merchant offers silver to carry a sealed letter to the next town. He will not say what is inside.',
    npcFactory: makeMerchant,
    npcOffset: { x: -1, y: 0.5, z: 0 },
    choices: {
      push: { color: COLOR_PUSH, pos: [3, 1.5, z(9) - 2] },
      give: { color: COLOR_GIVE, pos: [-2, 1.5, z(9)] },
    },
  },
  {
    id: 'night-door',
    npcZ: z(10),
    text: 'In the dark, you wake to a sound at the door. Someone is trying the latch.',
    npcFactory: makeDoorAndBed,
    npcOffset: { x: 1, y: 0.5, z: 0 },
    choices: {
      speak: { color: COLOR_SPEAK, pos: [2, 1.5, z(10)] },
      wait:  { color: COLOR_WAIT,  pos: [-3, 1.5, z(10)] },
    },
  },
];

export const QTE_Z = z(10) - SPACING;
