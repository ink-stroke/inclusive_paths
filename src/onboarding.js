// Pre-title onboarding for first-time players. Teaches the limited
// controller schema honestly and adapts to the player's input device.
//
// Schema (three verbs, total):
//   Choose      — primary commit input
//   Reconsider  — secondary "almost-did" input
//   Wait        — null input, time passing
//
// The card itself responds to any of the three: click, key, or timeout.
// Onboarding deliberately does NOT count in telemetry. It is teaching,
// not testing. The first telemetry datum is the title card (Scene 0).

const TIMEOUT_MS = 14000;
const FADE_OUT_MS = 600;

function describeControls() {
  const hover  = window.matchMedia('(hover: hover)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;

  if (coarse) {
    return {
      device: 'touch',
      choose:     'Tap an option.',
      reconsider: 'Reconsider is harder on touch; mouse and keyboard read it better.',
      wait:       'Do nothing. Time passing is its own answer.',
    };
  }
  if (hover) {
    return {
      device: 'mouse',
      choose:     'Click an option.',
      reconsider: 'Hover one option, then click another. The change is read.',
      wait:       'Do nothing. Time passing is its own answer.',
    };
  }
  return {
    device: 'keyboard',
    choose:     'Tab to an option, then press Enter.',
    reconsider: 'Tab between options before committing. The indecision is read.',
    wait:       'Do nothing. Time passing is its own answer.',
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
      setTimeout(resolve, FADE_OUT_MS);
    }

    const onAny = () => finish();
    timer = setTimeout(finish, TIMEOUT_MS);

    window.addEventListener('click', onAny);
    window.addEventListener('keydown', onAny);
  });
}
