// Records the player's tells across the first act:
// verb distribution, choice latency, hesitation (hover then pick different).

export class Telemetry {
  constructor() {
    this.verbs = {};
    this.latencies = [];
    this.hesitations = 0;
    this.sceneStartedAt = null;
  }

  markSceneStart() {
    this.sceneStartedAt = performance.now();
  }

  recordChoice(verb) {
    this.verbs[verb] = (this.verbs[verb] || 0) + 1;
    if (this.sceneStartedAt != null) {
      this.latencies.push(performance.now() - this.sceneStartedAt);
    }
  }

  recordHesitation() {
    this.hesitations += 1;
  }

  summary() {
    const total = Object.values(this.verbs).reduce((a, b) => a + b, 0) || 1;
    const sorted = Object.entries(this.verbs).sort((a, b) => b[1] - a[1]);
    const dominant = sorted[0] || ['none', 0];
    const meanLatency = this.latencies.length
      ? this.latencies.reduce((a, b) => a + b, 0) / this.latencies.length
      : 0;
    return {
      dominantVerb: dominant[0],
      dominantShare: dominant[1] / total,
      meanLatencyMs: meanLatency,
      hesitations: this.hesitations,
      verbs: { ...this.verbs },
    };
  }

  toJSON() {
    return {
      verbs: { ...this.verbs },
      latencies: [...this.latencies],
      hesitations: this.hesitations,
    };
  }

  fromJSON(data) {
    if (!data) return;
    this.verbs = { ...(data.verbs || {}) };
    this.latencies = Array.isArray(data.latencies) ? [...data.latencies] : [];
    this.hesitations = data.hesitations || 0;
  }
}
