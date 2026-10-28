# MyTrainer / Stratum

[Open the app](https://robertsoumx.github.io/MyTrainer/). Version 1.5 restores the original graphite/coral dashboard and drill cards, with a quieter playing view and shorter instructions.

## Practice

Sixteen skills cover aim, mechanics, tactical judgment and team play. Eight mechanical drills use a light 2.5D rendering of connected 3D maps, with a visible licensed weapon model. Three branching rounds grade movement, shots, calls and objective use. The eight standalone tactical modules use decisions.

On first use, choose a public username, game, device, trigger behavior, aim speed and theme. Explicitly confirm the username and benchmark scores will be public. The app remembers this setup. Private practice history remains on the device; the public profile is linked to that browser. Customize includes profile removal and private-history backup/import.

Opening a drill fills the viewport and shows one instruction before Start. The browser's native fullscreen is requested on user activation; the fixed full-viewport layout remains available if it declines. Mouse capture, trackpad drag-look and touch controls are supported. Esc, focus loss and hidden tabs pause play. Touch uses separate movement, look and Fire zones.

**Tap** fires one trigger event per press, even if held. **Hold** repeats at the selected automatic weapon's rate; semi-automatic and burst modes keep their weapon behavior. Keyboard and pointer inputs have separate ownership. Recoil changes the ballistic/crosshair offset without pitching the camera. A single small viewmodel impulse returns monotonically. Movement uses bounded substeps and independent acceleration/braking profiles. The trainer does not embed either game's engine or claim exact native physics.

Weapon preparation completes before the scored clock starts. Up to four viewmodel poses are cached. The world avoids the expensive perspective-texture subdivision path during play. Exposure deadlines use active real time, and tracking does not manufacture repeated samples from one delayed frame. New mechanical results use `world3d5`; earlier data stays archived and exportable.

## Public leaderboard

The leaderboard is shared through a separate Worker API and D1 database, not local storage. It refreshes every 30 seconds and on demand. No players or scores are seeded.

For each of eight mechanical skills, average the latest three accepted **level 3, 30-second** benchmark quality values. Missing skills count as zero. The composite is the sum of those eight values divided by eight, multiplied by ten: **0–1000**. A player appears after three skills. CS2 and VALORANT, and mouse, trackpad and touch, each have separate boards. Public attempts use the default AK-47 / Vandal and 64° vertical FOV. Adaptive drills and imported results do not enter the board.

The server issues timed, single-use attempts, validates measurements, checks device ownership and calculates composites itself. Results remain **unverified browser benchmarks**; these checks are not anti-cheat or a game-rank estimator. Usernames are case-insensitively unique. Public profiles can be removed in Customize. No email or game-account credentials are collected; device keys are stored hashed on the server.

API source and migration tests are in `leaderboard-worker/`. The live API is a separate Sites deployment with `d1: "DB"`; the frontend stays on GitHub Pages. The original private Site's audience is unchanged.

## Development

```sh
npm ci
python3 scripts/fetch-assets.py
npm run check
npm test
npm run build
```

Node 22.13+ is required for the SQLite-backed API tests. The suite has **94 checks** covering movement, weapons, round rules, geometry, application inputs, first-run setup, loading order, public consent, replay protection and score calculations. `npm run dev` serves the application and the same API against a separate local SQLite database for review. Production assets are served from `dist/`; generated graphics and licensed binary models are restored/built by CI.

The firearm snapshot contains 54 profiles represented by seven licensed model families; these are not 54 exact official meshes. Official Riot PNGs are Armory reference images. Keep [asset credits](docs/assets-sources.md), licenses and the pinned asset manifest. See [QA.md](QA.md) for the five version-1.5 review passes, and [deployment details](docs/github-pages.md).
