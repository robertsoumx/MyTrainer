# MyTrainer / Stratum

CS2 and VALORANT practice: https://robertsoumx.github.io/MyTrainer/.

Version 1.7 restores the conventional first-person aim-trainer experience: a fixed center crosshair, mouse-look, shaded sphere targets, a textured training room, and detailed weapon-family viewmodels. The existing graphite/coral dashboard, optional light theme, first-run profile, progress and public leaderboard remain.

## Existing components used

- Three.js 0.180.0 and its actual PointerLockControls for captured mouse-look.
- Rapier 0.21.0 WASM and its maintained kinematic character controller for capsule collision, ground contact, wall sliding, jumping and gravity. Rapier ray queries resolve targets and occluding cover in world space.
- Non-overlapping target spawning adapted from Freddy Saez’s MIT [threejs-aim-trainer](https://github.com/freddysae0/threejs-aim-trainer), pinned to e28148a4de56809a1c0a6fbb7b3f6492fc85e3cb. The original algorithm and complete license are retained under third_party/.
- Existing licensed GLB weapon models and CC0 PBR surface textures; complete attribution remains in dist/assets/credits.json. Additional engine/trainer notices are in dist/assets/engine-licenses.txt.

## Controls

Mouse movement rotates the viewpoint; the crosshair stays centered. Click or F fires. Tap responds to one press; Hold follows the selected weapon’s automatic cadence. Semi-auto, explicit burst, reload and alternate fire retain their profiles. Fire does not add camera recoil or a second view kick. If mouse capture is declined, unpressed pointer movement still rotates the view; Capture mouse retries capture. Touch drags rotate the view, with separate Fire and movement controls.

WASD moves; Space jumps; Ctrl crouches; R reloads; right click / Alt fire changes supported alternate modes. Free practice supports live weapon switching. A short brief precedes every drill. The range fills the viewport and requests native fullscreen from a user action.

The scored timer starts after the physics and weapon model finish loading. Graphics/asset failures show an actionable error and do not start a scored attempt. The range requires WebGL 2; it never silently falls back to the rejected 2D dot field.

## Scores

Eight mechanical drills, eight tactical decision skills, and three operated rounds retain the adaptive training structure. New full-drill contexts use fpsnative1 and rounds use roundfps1. Earlier contexts remain preserved in backups. Public standard benchmarks use a separate fps1 protocol; old v5 and 2d1 composites remain separate.

The durable public API at https://mytrainer-public-board.qiuchitching.chatgpt.site validates server-timed, single-use benchmark attempts. The composite remains 0–1000: average the latest three accepted level-3 benchmarks per eight skills, counting missing skills as zero. Three skills are needed to appear. Games and mouse/trackpad/touch boards are separate. Default weapon and 64° FOV are required. Browser results remain unverified and do not imply official game ranks.

Private history stays in this browser and can be exported. Public names and benchmarks require explicit confirmation. The profile is owned by its browser device key.

## Development

```sh
npm ci
python3 scripts/fetch-assets.py
npm run check
npm test
npm run build
npm run dev
```

The entry is dist/index.html. src/fps-engine.js bundles Three.js and the Rapier WASM runtime into dist/fps-engine.js; dist/range-fps.js integrates the drills, firing and UI. src/fps-physics.mjs is also exercised directly in Node using the real engine. The local API uses SQLite and the same Worker source as production. GitHub Actions builds and publishes dist/ to Pages.

Movement tuning and recoil are trainer profiles, not a reproduction of native CS2/VALORANT internals. See docs/fps-controls.md and docs/review-v17.md for behavior and verification boundaries.
