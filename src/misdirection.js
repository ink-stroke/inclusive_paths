// The advertised clock. Counts down independently of game state.
// Default: 20:00 (production). With ?fast=1: 2:00 (test).
// Keeps ticking after GAME OVER. When it hits 0:00, the lie shows itself.

export function startMisdirectionClock(seconds) {
  const clock = document.querySelector('#clock');
  let remaining = seconds;
  let zeroed = false;

  const render = () => {
    const m = Math.floor(remaining / 60);
    const s = String(remaining % 60).padStart(2, '0');
    clock.textContent = `${m}:${s}`;
  };

  render();

  const interval = setInterval(() => {
    if (remaining > 0) {
      remaining -= 1;
      render();
      if (remaining === 0 && !zeroed) {
        zeroed = true;
        clearInterval(interval);
        showPostCredits();
      }
    }
  }, 1000);
}

function showPostCredits() {
  // Only land if the game has actually ended. If the clock zeroes out
  // mid-play (mistuned timing), staying silent preserves the misdirection
  // better than announcing the lie out loud.
  const ended = document.querySelector('.game-over, .ending');
  if (!ended) return;

  const post = document.createElement('div');
  post.id = 'post-credits';
  post.textContent = 'Your twenty minutes are up.';
  document.body.appendChild(post);
}
