// The advertised clock. Counts down independently of game state.
// Prototype: 120s. Production design calls for 20:00.
// The clock keeps ticking after GAME OVER — that's where the lie shows.

export function startMisdirectionClock(seconds) {
  const clock = document.querySelector('#clock');
  let remaining = seconds;

  const render = () => {
    const m = Math.floor(remaining / 60);
    const s = String(remaining % 60).padStart(2, '0');
    clock.textContent = `${m}:${s}`;
  };

  render();
  setInterval(() => {
    if (remaining > 0) {
      remaining -= 1;
      render();
    }
  }, 1000);
}
