# MyTrainer / Stratum

CS2 and VALORANT practice at https://robertsoumx.github.io/MyTrainer/.

Version 1.6 restores a flat **2D target range**. The original graphite/coral dashboard, optional light theme, settings, progress and shared leaderboard remain.

## Practice

- Move the mouse or trackpad pointer to aim. No drag, pointer lock or 3D camera is required.
- Click or press F to fire. Tap mode fires on a press; Hold mode follows the weapon's automatic cadence. Semi-automatic and explicit burst modes keep their own behavior.
- Touch: drag to aim, tap a target, or use the separate Fire button. Movement drills and rounds expose a movement stick.
- R reloads; right click / Alt fire changes the weapon's supported alternate mode. Free practice allows live weapon switching.
- Every drill opens a short brief, then fills the viewport. Native fullscreen is requested on a user action; the full-viewport layout remains available when the browser declines it.

Eight mechanical drills use flat circular targets: precision, flicks, tracking, ordered transitions, placement, stop-fire, recovery cadence and controlled exposure. They differ through target behavior and scoring. Three action-based rounds use a flat tactical board: move, aim, fire, call contact and use the objective. Eight standalone tactical skills use six decisions per drill.

There are no humanoid models, block scenery, viewmodels or 3D rendering dependencies in the active page. Historical renderer source remains in the repository for reference. Its geometry tests do not imply that the 2D release uses that renderer.

## Results

First use asks for controls, appearance, a public username and explicit public-score confirmation. Private history remains in local storage and can be exported. A public profile is owned by its browser's device key; it is not an email/password account.

A fixed benchmark is level 3 and 30 seconds. Adaptive sessions use levels 1–8. New mechanical contexts are `range2d1:<weapon>`; round evidence uses `round2d1:<weapon>`. Earlier 3D records stay in the backup and archive, separate from current baselines.

The public leaderboard uses a durable API, not a local mock. The 0–1000 composite averages the latest three accepted benchmarks for each of eight skills, with missing skills counting zero; complete three skills to appear. Games and mouse/trackpad/touch boards are separate. New 2D attempts use protocol `2d1`; old `v5` scores remain separate. The server binds results to timed, single-use attempts and validates measurements. Browser scores remain unverified and are not official game ranks.

The live API is https://mytrainer-public-board.qiuchitching.chatgpt.site. Its source is mirrored in `leaderboard-worker/`.

## Development and publication

```sh
npm ci
python3 scripts/fetch-assets.py --2d
npm run check
npm test
npm run build
npm run dev
```

The static entry is `dist/index.html`; play is implemented in `dist/range2d.js`. The 2D build verifies entry assets and skips the legacy graphics bundle. The asset restore skips models and textures. The dev server serves the static app plus a local SQLite-backed instance of the real leaderboard Worker; it applies tracked migrations without resetting existing data.

GitHub Actions verifies and deploys `dist/` to Pages after the default Pages publisher finishes. This preserves the existing deployment ordering. See `docs/2d-controls.md` for the interaction contract and `docs/review-v16.md` for release verification.

Movement, spread and recoil recovery are independent training approximations. The range does not embed either game's engine or reproduce its native graphics. Use the in-game follow-through for transfer practice. No game credentials or official-rank estimates are requested.
