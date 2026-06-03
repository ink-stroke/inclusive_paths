// First-time controller-schema tutorial, adapted for the voxel build.
// Detects input device via matchMedia. Resolves on click/key/timeout.
// Does NOT count in telemetry — this is teaching, not testing.

const TIMEOUT_MS = 16000;
const FADE_OUT_MS = 600;

function describeControls() {
  const hover  = window.matchMedia('(hover: hover)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  if (coarse) {
    return {
      move:       'Drag the left half of the screen to walk. Drag the right half to look.',
      choose:     'Walk into a glowing marker.',
      reconsider: 'Walk toward one marker, then turn and walk to the other.',
      wait:       'Stand still. Time passing is its own answer.',
    };
  }
  if (hover) {
    return {
      move:       'WASD to walk. Mouse to look. Click to lock the cursor.',
      choose:     'Walk into a glowing marker.',
      reconsider: 'Walk toward one marker, then turn and walk to the other.',
      wait:       'Stand still. Time passing is its own answer.',
    };
  }
  return {
    move:       'WASD or arrow keys to walk. Mouse to look.',
    choose:     'Walk into a glowing marker.',
    reconsider: 'Walk toward one marker, then turn and walk to the other.',
    wait:       'Stand still. Time passing is its own answer.',
  };
}

export function showOnboarding(stage) {
  return new Promise((resolve) => {
    while (stage.firstChild) stage.removeChild(stage.firstChild);

    const ctrl = describeControls();

    const card = document.createElement('div');
    card.className = 'onboarding';
    card.setAttribute('aria-live', 'polite');

    const pre = document.createElement('p');
    pre.className = 'onboarding-pre';
    pre.textContent = 'Before you begin.';
    card.appendChild(pre);

    const move = document.createElement('p');
    move.className = 'onboarding-move';
    move.textContent = ctrl.move;
    card.appendChild(move);

    const list = document.createElement('ul');
    list.className = 'onboarding-verbs';
    [
      ['Choose.',     ctrl.choose],
      ['Reconsider.', ctrl.reconsider],
      ['Wait.',       ctrl.wait],
    ].forEach(([label, desc]) => {
      const li = document.createElement('li');
      const b  = document.createElement('strong');
      b.textContent = label;
      li.appendChild(b);
      li.appendChild(document.createTextNode(' ' + desc));
      list.appendChild(li);
    });
    card.appendChild(list);

    const thesis = document.createElement('p');
    thesis.className = 'onboarding-thesis';
    thesis.textContent = 'The game reads what you do, when you do it, and what you nearly did instead. Time itself is a verb.';
    card.appendChild(thesis);

    const cta = document.createElement('p');
    cta.className = 'onboarding-cta';
    cta.textContent = 'Choose, reconsider, or wait. Any of those, here, begins.';
    card.appendChild(cta);

    stage.appendChild(card);
    requestAnimationFrame(() => { card.style.opacity = '1'; });

    let resolved = false;
    let timer;

    function finish() {
      if (resolved) return;
      resolved = true;
      window.removeEventListener('click', onAny);
      window.removeEventListener('keydown', onAny);
      clearTimeout(timer);
      card.style.opacity = '0';
      setTimeout(() => { card.remove(); resolve(); }, FADE_OUT_MS);
    }

    const onAny = () => finish();
    timer = setTimeout(finish, TIMEOUT_MS);

    window.addEventListener('click', onAny);
    window.addEventListener('keydown', onAny);
  });
}
