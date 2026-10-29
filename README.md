# MyTrainer / Stratum

https://robertsoumx.github.io/MyTrainer/

Version 1.8 replaces the large catalog with **four physical drills**:

- Precision: small, static targets for fine control.
- Target switching: acquire the bright target and transition to the next.
- Tracking: hold fire and follow a moving sphere.
- Move & shoot: move, settle on the ground, then hit the target.

Decision quizzes, tactical rounds, weapon viewmodels, reloads, ammunition and random recoil are absent from the active app. The 3D range is a matte blue training room with smooth luminous spheres, restrained bloom, antialiased architecture and a fixed center crosshair. The graphite/coral application retains a light theme, compact settings, first-run username consent, local progress and the shared leaderboard.

## Gameplay

Mouse movement turns the viewpoint without dragging. Click or F fires one deterministic, recoil-free center ray. Tap mode produces one shot per press; Hold mode fires at 10 Hz. Repeated events and simultaneous input sources never double-fire. Tracking requires holding fire and samples on-target time at 10 Hz. Each valid movement shot requires another 0.65 m of travel, a grounded stop, and 65 ms settled; jumping or firing while moving cannot count.

Touch uses drag-to-look, short tap-to-fire, a separate held Fire pad and a movement stick only for the movement drill. Mouse capture can be retried; declined capture leaves free mouse-look. Keyboard movement applies only in Move & shoot. Each entry gives one instruction, expands to the full viewport, requests browser fullscreen and counts down before scoring. Pause releases all input and excludes inactive time.

Three.js 0.180 and its PointerLockControls render/control the range. Rapier 0.21 WASM owns capsule contacts, gravity, wall sliding and world ray hits. Spawning adapts the MIT target generator from [Freddy Saez’s aim trainer](https://github.com/freddysae0/threejs-aim-trainer), pinned to e28148a4de56809a1c0a6fbb7b3f6492fc85e3cb. Original source and licenses are retained in third_party/ and dist/assets/engine-licenses.txt. No external model or material downloads are needed for current gameplay.

## Scores and data

Local practice adapts between levels 1–8. Aim quality is accuracy × (0.5 + 0.5 × capped pace), where pace compares successful hits/second with the drill/level target. Tracking quality is the share of samples on target while fire is held. Local skill scores weight difficulty; current progress weights the latest five results and preserves the first recorded result as the baseline.

The new **focus4** public protocol fixes level 3, 30 seconds and 64° FOV. Composite score is the mean quality of all four drills × 10, using the latest three accepted results per drill. All four are required to appear. Games and mouse/trackpad/touch boards stay separate. Previous protocols and old local sessions remain preserved, without entering the new score. Scores are browser-reported trainer measurements, not official CS2/VALORANT ranks.

The existing public Worker/D1 backend validates consent, hashes device keys, issues timed single-use attempts and supports public-profile withdrawal. Export/import retains local and historical progress; public device keys are not exported.

## Development

```sh
npm ci
python3 scripts/fetch-assets.py --fonts-only
npm run check
npm test
npm run build
npm run dev
```

The app entry is dist/index.html. The engine bundles from src/fps-engine.js; no legacy decision, weapon or round scripts are loaded. GitHub Actions verifies and builds dist/ before publishing to Pages. Source for the separately hosted API is mirrored in leaderboard-worker/.

See docs/focus4-controls.md and docs/review-v18.md for current behavior and verification limits. Earlier release documents describe historical implementations. The provided cloud browser disables GPU rendering: current UI and direct engine/controller tests can be reviewed, but GPU appearance and hardware performance cannot be visually certified there.
