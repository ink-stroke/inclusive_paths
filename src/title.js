// A breath before the first scene. The advertised clock starts ticking
// during the title, so the lie includes this moment — which is honest:
// the "twenty minutes" you were promised include everything you've seen.

export function showTitleCard(stage) {
  return new Promise((resolve) => {
    while (stage.firstChild) stage.removeChild(stage.firstChild);
    const t = document.createElement('div');
    t.className = 'title-card';
    t.textContent = 'Tell.';
    stage.appendChild(t);
    setTimeout(resolve, 5000);
  });
}
