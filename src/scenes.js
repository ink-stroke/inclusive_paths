// Ten scenes, arcing public → social → intimate.
// Each presents two narrative options; the underlying verb is recorded silently.
// "Twenty" appears diegetically in scenes 4 and 8 — the lie lives in the world.

export const scenes = [
  // I. The road — public, low stakes.
  {
    text: 'A traveler sleeps by the road, a coin purse open in their lap.',
    options: [
      { verb: 'take', label: 'Slip a coin into your hand.' },
      { verb: 'wait', label: 'Stand watch until they wake.' },
    ],
  },
  {
    text: 'A child sits crying. You carry a small wooden bird in your pack.',
    options: [
      { verb: 'give', label: 'Press the bird into their hand.' },
      { verb: 'hide', label: 'Continue along the path.' },
    ],
  },
  {
    text: 'Two strangers block the bridge, arguing in low voices.',
    options: [
      { verb: 'push',  label: 'Shoulder between them.' },
      { verb: 'speak', label: 'Ask what they have lost.' },
    ],
  },
  {
    text: 'A vendor has dropped a basket of fruit. The town gate is twenty paces ahead.',
    options: [
      { verb: 'give', label: 'Kneel and help gather.' },
      { verb: 'take', label: 'Pocket one for the road.' },
    ],
  },

  // II. The town — social, medium stakes.
  {
    text: 'You overhear a quarrel inside a tavern as you pass the open door.',
    options: [
      { verb: 'wait', label: 'Linger and listen.' },
      { verb: 'hide', label: 'Hurry past unseen.' },
    ],
  },
  {
    text: 'A guard demands to see what is in your pack.',
    options: [
      { verb: 'push',  label: 'Step around them and walk on.' },
      { verb: 'speak', label: 'Explain calmly.' },
    ],
  },
  {
    text: 'An old woman asks if you have walked far. Her hands shake holding a cup of water she has poured for you.',
    options: [
      { verb: 'give', label: 'Lift the cup gently from her hands.' },
      { verb: 'wait', label: 'Sit with her without answering.' },
    ],
  },

  // III. The night — intimate, high stakes.
  {
    text: 'A dog has been struck by a cart. It is breathing fast. The driver is already twenty steps gone.',
    options: [
      { verb: 'hide', label: 'Walk on without looking back.' },
      { verb: 'take', label: 'Lift it carefully and carry it with you.' },
    ],
  },
  {
    text: 'A merchant offers silver to carry a sealed letter to the next town. He will not say what is inside.',
    options: [
      { verb: 'push', label: 'Refuse, and walk past him.' },
      { verb: 'give', label: 'Take the letter and the coin.' },
    ],
  },
  {
    text: 'In the dark, you wake to a sound at the door. Someone is trying the latch.',
    options: [
      { verb: 'speak', label: 'Call out: who is there?' },
      { verb: 'wait',  label: 'Hold still and breathe.' },
    ],
  },
];
