// Turns telemetry into the composite figure: the closing-line indictment.
// Every output is parameterized by what the player actually did.

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
  const gerund = VERB_GERUND[summary.dominantVerb] || 'choosing';
  const tempo = summary.meanLatencyMs < 1500 ? 'fast' : 'slow';
  const certainty = summary.hesitations >= 2 ? 'hesitant' : 'decisive';

  const tempoPhrase = TEMPO_PHRASE[tempo];
  const certaintyPhrase = CERTAINTY_PHRASE[certainty];

  return [
    `I trained ${gerund}.`,
    `${tempoPhrase} and ${certaintyPhrase} I rehearsed in safety became the thing I could not face in earnest.`,
    `I must retreat from the form I made of myself, on the day it was born.`,
    `I was a fool to teach it everything I know.`,
  ];
}
