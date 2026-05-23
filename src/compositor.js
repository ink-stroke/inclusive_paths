// Turns telemetry into the composite figure: the closing-line indictment,
// plus profile tags the renderer uses to embody the figure in typography.
// The figure has no form except the words the player wrote with their play.

const VERB_GERUND = {
  take:  'taking',
  give:  'giving',
  wait:  'waiting',
  push:  'pushing',
  hide:  'hiding',
  speak: 'speaking',
};

const TEMPO_PHRASE = {
  fast: 'The reflexes',
  slow: 'The deliberations',
};

const CERTAINTY_PHRASE = {
  decisive: 'the certainties',
  hesitant: 'the small reversals',
};

export function composite(summary) {
  const gerund    = VERB_GERUND[summary.dominantVerb] || 'choosing';
  const tempo     = summary.meanLatencyMs < 1500 ? 'fast' : 'slow';
  const certainty = summary.hesitations >= 2 ? 'hesitant' : 'decisive';

  return {
    profile: `${tempo}-${certainty}`,
    dominantVerb: summary.dominantVerb,
    lines: [
      `I trained ${gerund}.`,
      `${TEMPO_PHRASE[tempo]} and ${CERTAINTY_PHRASE[certainty]} I rehearsed in safety became the thing I could not face in earnest.`,
      `I must retreat from the form I made of myself, on the day it was born.`,
      `I was a fool to teach it everything I know.`,
    ],
  };
}
