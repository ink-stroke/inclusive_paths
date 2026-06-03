# Tell.

> *Do Tell.*

## Context

A 10-minute self-confrontation game inside an advertised 20-minute frame. The player walks a dark voxel path, makes choices by walking toward what they choose, and at the end stands before a figure that turns out to be assembled from their own play. The trophy unlocks only by letting the QTE timer expire — by not striking.

Originally pitched (filed: **Example, Category: Evil**) with the climax aimed at the player's newborn daughter as a forced-inaction QTE. The structural mechanics were strong; the target was not. This implementation keeps the mechanic stack and aims the climax at the only target that earns its weight: **the player themselves.**

## Running

Serve the repo: `python3 -m http.server`, then open `http://localhost:8000/`.

- `?fast=1` compresses the misdirection clock to 3:00 for testing.
- `?debug=1` exposes `window.__tell` for headless drivers.

## Controller schema

Three actions, all spatial:

- **Walk** — WASD or arrow keys, or the left-half virtual joystick on touch.
- **Look** — mouse with pointer-lock on desktop, or drag the right half on touch.
- **Choose** — walk into one of the two glowing markers in a clearing. No button to press.

At the QTE: **E to Strike.** Or do nothing.

## Lifecycle

| State | What happens |
|---|---|
| First-time cold start | Onboarding (device-adaptive) → Title (Scene 0) → 10 encounters → QTE → ending. |
| Returning, never finished | Resume prompt: *Continue* (jump back in at the saved position) or *Start anew* (clear save). |
| Returning, finished | No onboarding. Title. Game. Composite ending lands with the replay coda. |
| Mid-game close & reopen | Save state was written on every commit + every 5s + on `beforeunload`. Continue restores camera, telemetry, and committed encounters. |
| After GAME OVER | "Begin again." button on the ending overlay. |

## What the game reads

| Signal | Source |
|---|---|
| Verb distribution | Which marker the player walked into, per encounter (10 verbs) plus the Scene 0 title resolution (1 verb). |
| Tempo (mean latency) | Time from a scene's first reveal to the player's commit, per encounter. |
| Hesitation | Number of encounters in which the player approached two markers (within 2.5 units of each) before committing. |

These feed the compositor, which produces a closing-line indictment parameterised by dominant verb (colour of the composite voxel figure), tempo (fast/slow), and certainty (decisive/hesitant — typography reflects this).

## Architecture

| File | System |
|---|---|
| `vendor/three/` | Three.js r160 + PointerLockControls (vendored, offline) |
| `src/three-setup.js` | Renderer, scene, camera, fog, lighting |
| `src/voxel.js` | InstancedMesh-based voxel primitives |
| `src/npc.js` | Voxel figure factories (10 distinct NPCs + door+bed) |
| `src/world.js` | Builds ground, path, clearings; fadeOutEncounter with chosen-marker flash |
| `src/encounters.js` | The 10 spatial encounters + verb→colour mapping |
| `src/player.js` | WASD + pointer-lock OR touch; movement along camera basis |
| `src/touch.js` | Virtual joystick + drag-camera, gated on `(pointer: coarse)` |
| `src/qte.js` | The QTE — figure placed ahead of camera, E to Strike, 10s timer |
| `src/endings.js` | Standard ending + auto-default composite voxel figure |
| `src/hud.js` | DOM overlay: prompts, scene banner, QTE card, ending card, saved-toast |
| `src/onboarding.js` | First-time controller-schema tutorial; device-adaptive copy |
| `src/title.js` | Scene 0: "Tell." / "Do tell." — click/key/timeout map to verbs |
| `src/resume.js` | Resume prompt for non-completed mid-game saves |
| `src/persistence.js` | Versioned localStorage save/load/clear, 72h expiry |
| `src/replay.js` | `tell.played` flag — gates onboarding and replay coda |
| `src/telemetry.js` | Verb counts, latency, hesitation; toJSON/fromJSON for save |
| `src/compositor.js` | Telemetry → closing-line indictment + profile tags |
| `src/audio.js` | Procedural sine drone for the QTE |
| `src/misdirection.js` | The advertised clock; post-credits at 0:00 if game has ended |
| `src/controller.js` | State machine wiring the above |

## Status

The voxel realisation is complete to its design. All 10 encounters playable. Lifecycle (start / return / continue / start anew / restart-after-completion) wired end-to-end. Touch + mouse/keyboard both work. Spatial hesitation tracks. Save persists. Composite figure renders parameterised by verbs and hesitation.

## What this design refuses

- **No child-as-target, no third-party victim.** The structural power of the mechanic stack does not require, and is weakened by, pointing it outward.
- **No second playthrough that "wins."** Replaying with foreknowledge produces a different ending acknowledging the player now knows the trick. There is no optimal run.
- **No achievement guide.** The trophy ("Do Tell.") cannot be searched-for without spoiling itself.

The original text version remains in the git history. Branch HEAD is the voxel realisation.
