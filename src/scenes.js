// Six scenes. Each presents two narrative options whose underlying verbs
// the telemetry records silently. Across the six, each of the six verbs
// (take, give, wait, push, hide, speak) is offered twice.

export const scenes = [
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
    text: 'A vendor has dropped a basket of fruit. None of it is yours.',
    options: [
      { verb: 'give', label: 'Kneel and help gather.' },
      { verb: 'take', label: 'Pocket one for the road.' },
    ],
  },
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
      { verb: 'speak', label: 'Explain calmly.' },
      { verb: 'push',  label: 'Step around them and walk on.' },
    ],
  },
];
