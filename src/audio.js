// Procedural QTE drone. Lazy-init on first user gesture so browsers'
// autoplay policies don't block it. Sine wave, frequency and gain
// ramp upward across the 10-second window; clean cutoff on resolve.

let ctx = null;
let osc = null;
let gain = null;

export function initAudio() {
  if (!ctx) {
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    } catch {
      ctx = null;
      return;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
}

export function startQTEDrone(seconds = 10) {
  if (!ctx) return;
  osc = ctx.createOscillator();
  gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(80, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + seconds);

  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + seconds);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
}

export function endQTEDrone() {
  if (!ctx || !osc) return;
  const now = ctx.currentTime;
  gain.gain.cancelScheduledValues(now);
  gain.gain.setValueAtTime(gain.gain.value, now);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  osc.stop(now + 0.5);
  osc = null;
  gain = null;
}
