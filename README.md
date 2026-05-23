# Tell.

> *Do Tell.*

## Context

This design emerged from a conversation about a structural game-design pattern: synthesize every frame with maximum complexity, end-user value, and respectful engagement, inside a fixed time budget — and aim the engineered climax somewhere it earns its weight.

The initial pitch (filed: **Example, Category: Evil**) aimed the climax at the player's newborn daughter as a forced-inaction QTE. The structural mechanics were strong; the target was not. This design keeps the mechanic stack and redirects the climax at the only target that makes it land honestly: **the player themselves.**

The phrase that crystallized the redirect — "**Self-con**fronting is a self-con story-cycle" — is the design's thesis. The game is a confidence trick the player runs on themselves. The title is the warning, hidden in plain sight.

## Title

**Tell.**

Four simultaneous readings:

| Layer | Reading |
|---|---|
| Surface (marketing) | "Tell me a story." Invitation to narrative. |
| Poker | The involuntary betrayal — what you do without knowing you're doing it. |
| Con | *Self-con*: the cycle of confronting yourself by being conned by yourself. |
| Imperative | "Do Tell." — the post-climax indictment. The game has been waiting for the player to tell on themselves, and they did. |

## Runtime

- **Advertised**: 20 minutes.
- **True**: 10 minutes.
- The first 10 minutes are performative — quest markers, dialogue trees, optimization surfaces. None of it is the game.
- The actual game is the surveillance underneath: every input is being read as a tell.

## The 10-minute arc

**Minutes 0–10 — Tell-gathering.**
A small set of verbs (tunable; principle is they map cleanly onto temperament — e.g. *take, give, wait, push, hide, speak*). Objectives look narrative-shaped but are instrumentation. The systems track *patterns*, not choices: hoarding vs. spending, hesitation vs. snap, charm vs. force, deferral vs. confrontation. Diegetic dialogue may misdirect ("you have 20 minutes to reach the summit"), reinforcing the false runtime. Nothing in the UI suggests anything is being watched.

**The pivot (~minute 10).**
A QTE surfaces. 10-second timer. The opponent silhouette is unresolved — the player reads it as the expected antagonist.

**The trophy condition: inaction.**
Any button press during the timer triggers a normal-intensity resolution and a standard ending. Letting the timer expire triggers the auto-default at maximum intensity — and only the auto-default unlocks the true ending. This inverts the grammar of games (press = progress). The player's reflex to engage is the thing being read. Letting the timer run is the only honest response, because honesty here is *being seen without intervening to shape what's seen.*

**The reveal.**
The opponent resolves, at the moment of impact, into a composite figure built from the player's first 10 minutes of patterns. Not a child. Not a third party. The player's own play, embodied.

Closing line (structurally faithful to the original pitch, redirected in target):

> *"I trained this. The patterns I rehearsed in safety became the thing I could not face in earnest. I must retreat from the form I made of myself, on the day it was born. I was a fool to teach it everything I know."*

**GAME OVER.**

## What this design refuses

- **No child-as-target, no third-party victim.** The structural power of the mechanic stack does not require, and is weakened by, pointing it outward.
- **No second playthrough that "wins."** Replaying with foreknowledge produces a different ending acknowledging the player now knows the trick. There is no optimal run. The first run is the run.
- **No achievement guide.** The trophy ("Do Tell.") cannot be searched-for without spoiling itself. Players who look it up have already chosen the surface reading of the title.

## Critical systems (when implementation begins)

This design precedes any code. The architecturally load-bearing pieces will be:

- **Telemetry layer** — pattern detection across the first 10 minutes. Not choice-tracking; *tendency*-tracking. A small statistical model over input cadence, verb preference, and hesitation.
- **Climax compositor** — turns the telemetry into the silhouette, voice, and posture of the auto-default opponent. The load-bearing scene; everything else feeds it.
- **Timer / auto-default controller** — the QTE with the inverted reward. Trivial code, most carefully tested system in the game.
- **Runtime misdirection layer** — diegetic clocks, dialogue, and UI cues that sell the 20-minute lie without ever stating it as a system fact.

## Verification

End-to-end test, when there is something to test:

1. **The misdirection holds.** Naive playtesters, post-session, believe the game was 20 minutes.
2. **The trophy is unguessable.** Playtesters who reach the climax press a button. If they don't, retune — the inversion only lands if the reflex is real.
3. **The composite is recognizable.** Playtesters who reach the auto-default ending recognize themselves in the opponent. If they don't, the telemetry layer is reading the wrong signal.
4. **The closing line lands.** Playtesters describe the ending as *about them*, not *about the character*. If they describe the character, the redirect failed.

## Running

Serve the repo: `python3 -m http.server`, then open `http://localhost:8000/`.

- Default: production timing — 20:00 advertised, ~10:00 real, 10s QTE.
- Add `?fast=1` to compress to 2:00 / ~1:00 / 10s for testing.
- To unlock the true ending: let the QTE timer expire. Pressing **Strike** gives the standard ending.

## Controller schema

Three verbs, total. Everything maps to one of them:

- **Choose.** Click / tap / Tab-then-Enter on an option.
- **Reconsider.** Hover one option then commit to another (mouse), or Tab between options before pressing Enter (keyboard). Touch can't reliably express this.
- **Wait.** Do nothing. Time is also a verb.

First-time players see an onboarding card that adapts these descriptions to their detected input device (mouse / touch / keyboard via `matchMedia`). Returning players skip it — the `tell.played` flag in localStorage gates both the onboarding and the replay coda.

## Architecture

| File | System |
|---|---|
| `src/onboarding.js` | First-time controller-schema tutorial; device-adaptive copy |
| `src/title.js` | Scene 0 — interactive title; click/key/timeout map to push/speak/wait |
| `src/telemetry.js` | Verb counts, latency, hesitation |
| `src/compositor.js` | Telemetry → closing-line indictment + profile tags |
| `src/scenes.js` | Ten scenes: public → social → intimate |
| `src/qte.js` | The 10-second QTE with inverted reward |
| `src/audio.js` | Procedural sine drone for the QTE |
| `src/endings.js` | Standard, auto-default, replay-aware coda |
| `src/replay.js` | localStorage flag — onboarding and coda both gate on it |
| `src/misdirection.js` | The advertised clock; post-credits tick to 0:00 |
| `src/controller.js` | State machine wiring it all together |
| `index.html`, `style.css` | Entry, presentation, telemetry-driven typography |

## Embodiment

The composite figure has no separate form — the letters of its line *are* its body. Telemetry tags become `body.composite-{tempo}-{certainty}` classes; CSS reshapes the closing line accordingly. Hesitant players' indictments tremor. Decisive players' indictments sit still and sharp. The figure is what the player wrote.

"Twenty" is woven diegetically into two scenes (the gate, the cart driver). The misdirection clock keeps running past GAME OVER and surfaces a final line — *"Your twenty minutes are up."* — at 0:00, long after the game has ended.

## Status

Design realized. The Good Example, authored as a redirect of the Evil Example: same mechanic stack, target turned inward.
