# MyTrainer / Stratum

A static tactical performance lab for Counter-Strike 2 and VALORANT. The application is branded Stratum; its GitHub Pages source target is [robertsoumx/MyTrainer](https://github.com/robertsoumx/MyTrainer). Serve the generated `dist/` directory over HTTPS. No API keys or game-account access are required. The graphics library, licensed models, textures, and selector images are local at runtime.

Source is maintained in [MyTrainer](https://github.com/robertsoumx/MyTrainer). The build publishes `dist/` through GitHub Actions. See [deployment status and setup](docs/github-pages.md).

## Experience

Sixteen individual skill modules cover micro precision, flick acquisition, moving-target tracking, ordered transitions, crosshair placement, stop-fire timing, trigger restraint, angle clearing, utility purpose, economy, rotation information, trading, positioning, objective clocks, communication, and round reset.

Eight mechanical modules run in navigable first-person 3D practice spaces. CS2 retains **Courtyard 04**, an original connected map with an entry hall, courtyard, west alley, ramp, and elevated catwalk. VALORANT uses **The Pavilion**, a separate original open practice space with target lanes, a dedicated teal HUD and elimination panel, a cool grayscale weapon/arm treatment, and rounded training targets. A moving camera, solid cover, elevation where present, and camera-aligned shot rays determine what the player sees and can hit. Neither space is an official game map.

The workspace defaults to light mode for new profiles, with a global light/dark toggle and locally hosted Inter typography. Customize offers Coral, Rose, Jade, and Lilac accents or a custom color, comfortable/compact density, soft or Square / Metro corners, HUD scale, and weapon-motion control. Existing saved preferences remain available. The world stays prominent while the dashboard retains its training and progress workflow.

The catalog contains **54 firearm profiles: 34 CS2 and 20 VALORANT**, using an October 24, 2026 source snapshot. Profiles drive magazines/reserves, fire rate, reload/equip timing, damage, ADS/scopes, and movement values, with explicitly approximate recoil and accuracy integration. Seven licensed model families represent the catalog; six include gloved arms. They are not 54 exact official weapon meshes. The official Riot Public Content Catalog supplies 19 committed 2D PNGs, including melee; 18 firearm thumbnails are used in the informational Armory selector. These images do not supply official 3D gun models. Warden is explicitly labeled as an API listing. See [weapon sources](docs/weapon-sources.md), [asset sources](docs/assets-sources.md), and the [catalog manifest](dist/assets/catalog/valorant/manifest.json).

The bundled Three.js renderer uses WebGL2, local color/normal/roughness maps, environment lighting, and shadows. When WebGL2 is unavailable, a CPU perspective renderer uses the same moving camera and collision world, with a cached projection of the actual GLB weapon. That viewmodel uses a fixed pose with procedural sway, reload, and equip motion. GPU muzzle flashes and wall-impact marks are implemented; optional audio is synthesized. See [rendering details and limits](docs/realistic-rendering.md).

Eight tactical modules use scored decisions and explanations. Higher tactical levels introduce multiple constraints and procedural clock/budget situations. Three branching rounds now run entirely in a connected 3D site: **The retake**, **Trade the entry**, and **Hold, then rotate**. Players move, shoot, call contact and use the objective; the review grades those actions and shows what caused each judgment. Mistakes can introduce a recovery branch. These are scripted exercises, not full matches. Component results are saved separately without double-counting practice time. **Free practice** offers an untimed map walk without saving a score.

Every drill has a brief before entry: three steps, what counts, duration, weapon and controls. **Start** opens a full-viewport practice view and requests browser fullscreen when supported. Mechanical drills have distinct world-space guides and live coaching cues. Pause and Exit remain visible. See [playable drills](docs/playable-drills.md).

**Train in game** opens guidance for practice in the installed game. CS2 includes a `steam://run/730` launch link; VALORANT provides Riot Client / Practice / The Range directions. These actions do not link game telemetry or automatically score native practice. The requested native Source 2/Riot engine, exact official 3D models, and exact game gun motion are **not achieved by the browser trainer**: its movement, family meshes, maps, recoil, and animation remain independently implemented approximations.

## Measurement

Each full skill starts at a fixed L3 benchmark. Range benchmarks last 30 seconds; decision benchmarks have six situations with a 25-second deadline each. Adaptive runs use L1–L8. At least eight mechanical trials, fifty tracking samples, or six decisions are required to change difficulty. Quality >=85% increases the next level and quality <50% decreases it.

Trainer score = quality × (0.5 + 0.5 × level/8), rounded. Recent proficiency weights the last five structured drill scores from oldest to newest with weights 1 through N. Scenario action results are shown as limited evidence in history, and do not establish a full proficiency baseline. Prioritization assesses unmeasured skills first, then current proficiency, sparse evidence, and time since practice.

Games, input profiles, and interaction methods keep separate histories. Mechanical results now use `:world3d4:<weapon-id>` after the recoil-timing changes. Earlier contexts remain in the profile backup and prior-results archive; they do not contribute to v4 proficiency. Playable rounds use `:round3d1:<weapon-id>` and remain limited scenario evidence, separate from full-skill baselines. Benchmark repeats should use the same weapon, device, orientation, viewport, field of view, and control settings. The app shows comparison limitations. Its internal score is not a validated player percentile or proof of transfer to match performance.

No equivalent competitive rank is invented. The game-level card shows an explicitly self-reported rank and the reason a validated rank equivalence is unavailable. A real estimator would require protocol-matched, independently validated rank-linked data. Reference sources are available in the application's measurement dialog.

## Controls and data

- Move with W/A/S/D. Space jumps, Ctrl crouches, Shift walks, and R reloads.
- Look with captured mouse movement in FPS camera mode, or drag the world in drag camera mode. If mouse capture is unavailable, drag look remains available.
- Aim with the centered crosshair. Hold captured left click, F, or Fire for automatic weapons; semi-automatic weapons require a new press. Without mouse capture, a click/tap with no drag fires on release. Shots stop at walls and bodies; wall penetration is not simulated. Tracking measures crosshair dwell without firing.
- Right click or **Aim / Alt** uses the weapon's ADS, scope cycle, or alternate mode/fire. Reload transfers reserve ammunition; shell-loading weapons insert rounds individually.
- Choose a firearm in **Armory [B]** or **Customize → Practice weapon**. Explore permits live switching with 1/2 for primary/sidearm, Q for the previous weapon, or the wheel over the world. Each weapon retains its magazine and reserve during switching. Scored attempts keep their starting weapon.
- Touch uses a left movement stick, drag look, and Fire, Jump, Crouch, Reload, and Aim / Alt buttons. Hold Fire for automatic fire; Crouch toggles.
- Trigger inputs use event-time synchronization and separate ownership for keyboard and pointers. Releasing the movement stick does not release another pointer's held Fire action. Browser-generated click events do not repeat a pointer-fired shot.
- Escape pauses. Hidden tabs, loss of focus, and release of mouse capture pause the drill. Drills start full-viewport; **Windowed view** returns to the workspace.
- Playable rounds: hold E / Use at the objective in the retake, or C / Call to report visible contact in Hold, then rotate.
- Decisions: select an option or press 1–4. Timeouts count as missed decisions.
- Customization: crosshair shape, color, size, gap, stroke, sensitivity, vertical field of view (50–85°), light/dark theme, accent/presets, density, corners, HUD scale (0.8–1.3), weapon motion (0–1), sound, reduced decorative motion, duration, and input profile.
- Results stay in this browser's local storage. JSON export/import transfers the profile; import is validated and replacement is confirmed. There is no cloud synchronization. Export a backup before moving from the previous host to GitHub Pages, then import it on the new host; browser storage does not move between hosts automatically.

See [3D controls](docs/3d-controls.md) for the full control reference and map walkthrough.

Every drill includes an actionable in-game follow-through. This trainer does not reproduce either game's exact official maps, weapon meshes, recoil curves, animations, engine, wall penetration, audio, or network conditions. Source values are a dated snapshot and browser integration remains approximate. Exact weapon patterns and utility landings need validation in the game itself. No competitive-rank equivalence or measured live-game transfer is claimed.

## Development verification

Version **1.4.0**. Use Node 20.19+ or Node 22.12+; install locked development dependencies with `npm ci`, restore assets with `python3 scripts/fetch-assets.py`, then run `npm run check`, `npm test`, and `npm run build`. The suite includes four movement checks, 15 weapon checks, seven round-rule checks, seven 3D geometry checks, and 46 application/DOM/controller checks, for **79 total**. The application harness executes the real source in jsdom with deterministic canvas and timing adapters; it is not a substitute for real-browser rendering, physical device testing, or live gameplay validation.

`scripts/fetch-assets.py` restores **23 pinned files** from GitHub revisions in `scripts/asset-downloads.json`: 21 model/material/arm-texture files plus the Inter variable font and its OFL license. It verifies SHA-256 hashes and reuses matching local files. All 21 original model/texture remote payload hashes were verified for this migration; the browser font check also confirmed Inter loaded. The official catalog PNGs are committed source assets. `npm run build` bundles `src/realistic-renderer.js` and its graphics dependencies into generated `dist/graphics.js`; rerun it after graphics-source changes. Other application modules are served directly from `dist/`.

`.github/workflows/pages.yml` runs on pushes to `main` or manual dispatch: it installs dependencies, restores assets, checks syntax, runs tests, builds graphics, uploads `dist/`, and deploys with GitHub Pages. The repository must use **Settings → Pages → Build and deployment → Source → GitHub Actions**. Workflow preparation is not evidence of a successful hosted deployment. See [GitHub Pages setup](docs/github-pages.md).

See [QA.md](QA.md) for the five historical refinement passes and dated updates. The October 27 checks cover recoil timing, preflight guidance, full-viewport entry, action-based rounds, result persistence and responsive layouts. Browser visuals exercise the CPU compatibility renderer because WebGL2 was unavailable. GPU appearance, physical multi-touch, native fullscreen, device performance and live-game parity remain unverified.
