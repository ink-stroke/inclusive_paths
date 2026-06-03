// Resume prompt — shown only when a non-completed mid-game save exists.
// Two options: Continue (restore + skip pregame) or Start anew (clear save + normal flow).
//
// Returns 'continue' or 'restart'.

export function showResumePrompt(stage, savedState) {
  return new Promise((resolve) => {
    while (stage.firstChild) stage.removeChild(stage.firstChild);

    const card = document.createElement('div');
    card.className = 'resume-card';
    card.setAttribute('aria-live', 'polite');

    const pre = document.createElement('p');
    pre.className = 'resume-pre';
    pre.textContent = 'You were here before.';
    card.appendChild(pre);

    const stats = document.createElement('p');
    stats.className = 'resume-stats';
    const n = (savedState.committedEncounters || []).length;
    stats.textContent = `${n} of 10.`;
    card.appendChild(stats);

    const actions = document.createElement('div');
    actions.className = 'resume-actions';

    const cont = document.createElement('button');
    cont.className = 'resume-btn resume-continue';
    cont.textContent = 'Continue';

    const anew = document.createElement('button');
    anew.className = 'resume-btn resume-restart';
    anew.textContent = 'Start anew';

    actions.appendChild(cont);
    actions.appendChild(anew);
    card.appendChild(actions);

    stage.appendChild(card);
    requestAnimationFrame(() => { card.style.opacity = '1'; });

    function finish(choice) {
      card.style.opacity = '0';
      setTimeout(() => { card.remove(); resolve(choice); }, 400);
    }

    cont.addEventListener('click', () => finish('continue'));
    anew.addEventListener('click', () => finish('restart'));
  });
}
