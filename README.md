# Tell.

> *Do Tell.*

## Context

A 10-minute self-confrontation game inside an advertised 20-minute frame. The player walks a dark path through a voxel world, makes choices by walking toward what they choose, and at the end stands before a figure that turns out to be assembled from their own play. The trophy unlocks only by letting the QTE timer expire — by not striking.

Originally pitched (filed: **Example, Category: Evil**) with the climax aimed at the player's newborn daughter as a forced-inaction QTE. The structural mechanics were strong; the target was not. This implementation keeps the mechanic stack and aims the climax at the only target that earns its weight: **the player themselves.**

## Running

Serve the repo: `python3 -m http.server`, then open `http://localhost:8000/`.

- `?fast=1` compresses the misdirection clock to 3:00 for testing.
- `?debug=1` exposes `window.__tell` (THREE, scene, camera, telemetry, controls) for headless drivers.

## Controller schema

Three actions, all spatial:

- **Walk** — WASD or arrow keys.
- **Look** — mouse (click canvas to lock pointer).
- **Choose** — walk into one of the two glowing markers in a clearing. That's it. There's no button to press.

At the QTE: **E to Strike.** Or do nothing.

## How the world maps onto the design

Each encounter is a clearing along a path. An NPC sits in the centre; two glowing markers float on either side, each a different colour and a different verb. The player commits by walking close to one. The other fades. The NPC fades. The path forward opens up. After the last encounter, a dark figure rises ahead of the player — the QTE. After the QTE auto-default, the same position is taken by a **composite voxel figure** whose colour and shape are determined by the player's verb distribution and hesitation count. Gold for *take*-dominant, soft green for *give*, blue for *wait*, red for *push*, grey for *hide*, warm for *speak*. The figure is the player's play, embodied in cubes. The closing line narrates over the silhouette.

## Architecture

| File | System |
|---|---|
| `vendor/three/` | Vendored Three.js r160 + PointerLockControls (offline) |
| `src/three-setup.js` | Renderer, scene, camera, fog, lighting |
| `src/voxel.js` | InstancedMesh-based voxel primitives |
| `src/npc.js` | Voxel humanoid factories (sleeping traveler, child, strangers) |
| `src/world.js` | Builds ground, path, encounter clearings with NPCs + glows |
| `src/encounters.js` | The 3 spatial encounters (data + verb→colour mapping) |
| `src/player.js` | PointerLockControls, WASD, proximity helper |
| `src/qte.js` | The QTE — figure placed ahead of camera, E to Strike, 10s timer |
| `src/endings.js` | Standard ending (figure falls) + auto-default (composite voxel figure) |
| `src/hud.js` | DOM overlay for prompts, scene text, QTE card, closing-line card |
| `src/telemetry.js` | Verb counts, latency, hesitation (carried from text version) |
| `src/compositor.js` | Telemetry → closing-line indictment + profile tags |
| `src/misdirection.js` | The advertised clock; post-credits at 0:00 if game has ended |
| `src/audio.js` | Procedural sine drone for the QTE |
| `src/replay.js` | localStorage flag — second auto-defaults get the coda |
| `src/controller.js` | Render loop, encounter pacing, QTE transition, ending |

## Status

Vertical slice landed. 3 of 10 encounters fully playable in 3D; QTE in 3D works; voxel composite figure renders at the climax; standard ending path also works.

**Deferred to next push:**
- 7 remaining encounters (vendor with fruit, tavern, guard, old woman, dog struck by cart, merchant with letter, door at night)
- Onboarding card port from text version (current prompt is a single HUD line)
- Title card port (no in-world title yet)
- Replay coda visible in voxel composite (logic wired; needs visual)
- Touch input (current is mouse/keyboard only)
- Misdirection clock as diegetic moon-arc instead of HUD numeral

## What this design refuses

- **No child-as-target, no third-party victim.** The structural power of the mechanic stack does not require, and is weakened by, pointing it outward.
- **No second playthrough that "wins."** Replaying with foreknowledge produces a different ending acknowledging the player now knows the trick. The first run is the run.
- **No achievement guide.** The trophy ("Do Tell.") cannot be searched-for without spoiling itself.

The 10 of the original text version remain in the git history; this branch's HEAD is the voxel realisation.
