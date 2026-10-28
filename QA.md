# Five review and refinement passes

## 1 — Scoring, baselines, and data integrity

Reviewed every score boundary, separate game/input/method contexts, weighted recency, import validation, and true empty states. Corrected negative-zero confidence interval output. Fixed the test fixture to distinguish expired-target penalties from valid shots. Verified all 16 modules and scenario graph reachability. No sample performance or invented competitive rank is shipped.

## 2 — Drill behavior and measurement

Excluded paused decision time, prevented sparse attempts from promoting difficulty, kept single scenario decisions from establishing a full baseline, and removed duplicated aim time from scenario totals. Differentiated micro-target size and made the crosshair studio consistent with range rendering. Verified invalid moving shots, cover conditions, trigger reset, target order, tracking samples, and the unavailable-canvas error.

## 3 — Difficulty and practical transfer

Added higher-level combined constraints for every tactical module, randomized timing/budget calculations, and game-specific follow-through for all 16 techniques. Fixed benchmarks retain the same level, duration, question bank, and deadlines. Reviewed explanations to distinguish provided scenario values from live game timers and prices.

## 4 — Responsive controls, accessibility, and clear state

Added a small-screen game selector after identifying that the collapsed sidebar hid game switching. Retained touch movement pads and a dedicated relative-look fire action. Added labeled collapsed navigation, numeric decision shortcuts, automatic pause for dialogs, explicit save errors, complete empty/error states, safe imported content, visible match-journal notes, contrast-aware custom colors, and reduced-motion support. Optimized combined-stage instructions for small screens and removed an unnecessary stylesheet import.

## 5 — Full application flows and combination drills

Unified dashboard focus order and adaptive queue prioritization. Added simultaneous aim plus movement/exposure conditions to live scenario stages with separately measured components, without double-counting practice time. Exercised both wrong-branch recovery and full successful paths, saving, reload validation, game isolation, global help pause/resume, search, theme/crosshair persistence, and error recovery. Checked JavaScript syntax, stylesheet syntax, asset completeness, and absence of external runtime dependencies. Final source review also resolved the compact landscape navigation rail and prevented firing from reseeding a tracking target.

## Original verification boundary

This boundary describes the five passes above. The dated update below records the later 3D work and browser checks.

Automated logic/DOM/canvas-adapter checks pass. Real-browser visual QA was unavailable because the required browser-control capability was not exposed; no substitute browser was installed or started. Physical mouse/touch behavior, layout appearance on real screens, pointer-lock support, actual game transfer, and game-rank calibration still require real-world validation. Deployment is independently verified by the Sites deployment result.

## October 22, 2026 — Navigable 3D correction

The mechanical surface now uses an actual moving first-person camera with position, yaw, pitch, and perspective projection. Courtyard 04 is an original connected map: an entry hall opens into the courtyard, routes pass around solid cover, and a continuous ramp reaches the raised catwalk. Movement collides with map geometry. Centered shot rays test walls, head volumes, and bodies in depth order. The same map supports individual mechanical drills, an unscored untimed Explore mode, and scenario live stages with scenario-specific starting positions.

Desktop controls are W/A/S/D movement, captured mouse or drag look, click/F/Fire shooting, Space jump, Ctrl crouch, Shift walk, and R reload. Touch uses a movement stick, drag look, and Fire/Jump/Crouch/Reload controls; touch crouch toggles. Crosshair and theme settings are retained, with a vertical field-of-view setting from 50° to 85°. The full control reference is in [docs/3d-controls.md](docs/3d-controls.md).

WebGL uses 3D meshes, a perspective camera, and depth testing. When WebGL is unavailable, a software renderer projects the same 3D map geometry from the same camera. It is a compatibility path for the 3D world. Mechanical scores now use the `:world3d1` context. Earlier 2D results remain archived and exportable, and are excluded from the new 3D baseline.

| Area | Evidence and boundary |
| --- | --- |
| Geometry | Seven automated checks pass: camera direction; swept wall collision; connected doorway/side passage; continuous ramp/catwalk elevation; cover and side-step sight lines; ray intersections; and camera translation with perspective. |
| Application | 37 application/DOM/controller checks pass, for 44 checks in total with geometry. Coverage includes actual saved results, pause behavior, combined live stages, movement conditions, unscored Explore mode, retained 2D data excluded from 3D baselines, and keyboard movement that changes world coordinates. A controller-model check confirms the touch movement vector stays active while a camera-look pointer changes yaw; pause then resets the movement vector and releases the look pointer. These use deterministic adapters; the model check does not establish physical multi-touch behavior. |
| Desktop browser | Navigation was exercised through the entry doorway. The reported world position changed from `(0, 0, 14)` to `(-2.048, 0, 0.991)`. This confirms movement through the connected map in the browser. See [desktop capture](docs/3d-range.jpg). |
| Small-screen layout | A real 390 CSS-pixel iframe viewport was used, with the Touch input profile selected manually. Review identified a collapsed expanded stage. CSS now gives the expanded panel a definite `100dvh` height and `align-self: stretch`. The verified expanded panel measures 390 × 844 CSS pixels; the 3D world, joystick, Fire, Jump, Crouch, Reload, and Exit expanded view are visible. See [small-screen capture](docs/3d-mobile.jpg). This is responsive browser QA, not physical mobile testing. |
| Touch-profile gestures | Dragging the movement stick changed position from `(0, 0, 14)` to `(0, 0, 8.560)`. A separate drag on the world changed yaw from `0` to `-0.180`. The gestures were verified separately; the browser could not synthesize simultaneous physical multi-touch. |
| Renderer coverage | WebGL was unavailable in the cloud browser, so the browser checks exercised the software 3D renderer. GPU WebGL rendering remains to be visually checked in a compatible browser. |
| Browser runtime | No application runtime errors were observed in the browser checks. Unrelated browser-extension metadata errors were not attributed to the app. |

Physical mouse/touch behavior, supported-browser mouse capture, and performance on physical devices still need real-device validation. Game-specific movement and weapon timings remain approximations. No identical game maps, recoil, engines, competitive-rank equivalence, or measured transfer to live matches is claimed. This update does not establish a new deployment result.

`DESIGN.md` and `PRODUCT.md` were absent before this extension. That pre-existing documentation drift remains; this scoped update preserves the existing visual system and documents the 3D behavior and evidence.

## October 24, 2026 — Weapon profiles and rendering extension

Version 1.2.0 preserves the graphite/coral dashboard and the existing training application while giving the first-person world the full training column. A visible weapon, compact HUD, Armory, ADS/alternate action, magazines/reserves, and weapon-specific mechanical baselines extend the original Courtyard 04 experience. The map remains an original connected practice environment.

The catalog contains 54 source-backed firearm profiles: 34 CS2 and 20 VALORANT. Rates, capacities, reload/equip values, damage fields, ADS/scopes, and movement values come from the dated source snapshot, with derived and approximate fields identified in [docs/weapon-sources.md](docs/weapon-sources.md). Warden is present in the retrieved community API but absent from the retrieved official arsenal page; its profile and source notes make that discrepancy explicit. This is an October 24 snapshot, not independently verified live-patch parity.

Seven licensed model families cover the catalog; six include gloved arms, with both external shared arm textures shipped locally. The GPU renderer uses Three.js/WebGL2, color/normal/roughness material maps, shadows, environment lighting, muzzle flashes, and wall-impact marks. When WebGL2 is unavailable, the compatibility path projects the same 3D world and caches a textured projection of the actual GLB weapon at a fixed pose. Its sway, reload, equip, and ADS motion are procedural, not exact game animation. Optional weapon/hit audio is synthesized. [Asset sources](docs/assets-sources.md) and [rendering details](docs/realistic-rendering.md) describe licensing and path differences.

Armory and Customize select the firearm. Explore allows live switching through Armory, 1/2 slots, Q for the last weapon, and the wheel; each weapon retains its magazine and reserve during the session. Scored attempts keep their starting weapon. Held automatic fire, semi-automatic trigger edges, bursts, supported secondary pellets, magazine/reserve transfer, shell-by-shell reload where supplied, equip delay, and scope/ADS behavior run through the weapon simulation. Damage and movement use source fields with approximate browser integration; recoil/accuracy behavior is explicitly approximate.

New mechanical results use `:world3d2:<weapon-id>` within the game/input/camera-control context. Prior 2D and `:world3d1` results remain importable, archived, and exportable, and do not enter the new weapon-specific baseline. Full current controls are in [docs/3d-controls.md](docs/3d-controls.md).

| Area | Evidence and boundary |
| --- | --- |
| Automated verification | All 59 checks pass: 12 weapon simulation/data checks, seven 3D geometry checks, and 40 application/DOM/controller checks. Weapon coverage includes held-fire cadence across frame rates, semi-automatic trigger edges, burst completion, secondary pellets, reload/reserve transfer, shell reload interruption, retained ammunition during switching, equip delay, scopes, silencers, damage, and accuracy/recoil recovery. Application checks include the frame-loop integration, weapon-specific baselines with old results retained, and Armory selection with scored-weapon locking. Deterministic adapters do not establish physical input or visual rendering quality. |
| Build and syntax | `npm run check` and `npm run build` pass. The graphics source is now bundled; `npm run build` is required after changes to `src/realistic-renderer.js`. Successful compilation does not visually verify GPU rendering. |
| Desktop browser | The actual equipped profile was switched to AWP and its family viewmodel was visible. Firing changed the ammunition DOM value from 5 to 4; movement changed the reported position from `(0, 0, 14)` to `(0, 0, 12.573)`. See [desktop capture](docs/realism-desktop.jpg). |
| ADS/scope browser | The scope view was opened and the range reported `ads=true`. The viewmodel is hidden for the scoped profile and the scope overlay is visible. See [scope capture](docs/realism-scope.jpg). This confirms the browser state/presentation, not official optical parity. |
| Touch layout | The Touch input profile was checked in a real 390 × 844 CSS-pixel iframe viewport. The expanded world, weapon/arms, movement stick, Fire, Jump, Crouch, Reload, Aim / Alt, and footer actions are visible. Footer actions now use 12 px text and 44 px minimum targets. A separate weapon-camera FOV widens from 52° to at most 80° for portrait framing. See [touch capture](docs/realism-mobile.jpg). This is responsive browser QA, not a physical mobile or simultaneous multi-touch test. |
| Rendering corrections and review | The final reviewer disposition is **ship for the scored fixes only**: all six requested fixes and the introduced subdivision-seam regression were resolved. Corrections include lens-glass treatment, perspective texture mapping, portrait weapon framing, and footer legibility/targets. The follow-up removed debug floor strokes and overlapped opaque texture patches to close antialiasing gaps; the final desktop/mobile captures were checked again. This is a scoped review result, not whole-surface or GPU visual approval. |
| Renderer coverage | WebGL2 was unavailable in the cloud browser. Current visual checks and captures exercise the CPU compatibility renderer. The GPU source compiles, but its PBR appearance, shadows, lighting, muzzle flashes, and impact marks remain visually unverified. |
| Detector advisory | The detector reported only the pre-existing crosshair-studio grid/measurement advisory. This is retained as a scoped advisory, not converted into a new design rule or a claim that every application surface received a new visual pass. |

Physical multi-touch, supported-browser pointer lock, physical-device performance, and exact live-game parity remain unverified. The trainer does not claim exact official maps, weapon meshes, original recoil curves, game engines, wall penetration, gameplay animations, audio, network conditions, competitive-rank equivalence, or measured transfer to matches. Cover blocks shots; surface thickness/material penetration is not simulated. The update does not establish a new deployment result.

The historical five-pass and October 22 records above remain intact. `PRODUCT.md` and `DESIGN.md` were absent before this ordinary extension and remain absent; that pre-existing documentation drift is preserved rather than turning this scoped behavior/verification update into a new design-system specification.

## October 26, 2026 — MyTrainer Pages migration and input corrections

Version 1.3.0 prepares the Stratum application for [robertsoumx/MyTrainer](https://github.com/robertsoumx/MyTrainer) and GitHub Pages. The source repository was initialized and official catalog PNGs uploaded. Scoped implementation review is complete; the final source commit/upload and Pages activation/deployment remain pending. A browser sign-in wall currently blocks the repository's Pages settings step. The workflow exists, but no successful hosted deployment is claimed. See [docs/github-pages.md](docs/github-pages.md).

The user's exact-native requests are not achieved by the browser: Source 2 and Riot's engine are not embedded, and the world uses original maps, licensed family meshes, and approximate procedural gun motion. **Train in game** now opens native practice guidance, with a `steam://run/730` CS2 link and VALORANT Range directions. It does not connect telemetry, import native results, or automatically score that practice. No native launch or live-game parity verification was performed.

New profiles default to light mode, and the header exposes a global light/dark toggle. Appearance studio adds accent presets/custom color, comfortable/compact density, Soft or Square / Metro corners, HUD scale, and weapon-motion control. VALORANT has a separate original Pavilion map, dedicated teal HUD/minimap and elimination panel, cool grayscale weapon/arm treatment, and rounded targets. CS2 retains Courtyard 04. These presentation changes do not establish native map/model/interface parity.

The official Riot catalog contains 19 local PNGs including melee; 18 supported firearm thumbnails appear in the informational selector. The catalog is version 08.09 and supplies no native engine, 3D gun mesh, arms, or gameplay animation. Its manifest preserves policy scope and source hashes. The 54 firearm-data profiles remain a separate October 24 snapshot; Warden is explicitly shown as an API listing, not an official-catalog confirmation.

Mechanical contexts now use `:world3d3:<weapon-id>` to separate the new movement/input behavior. Prior 2D, `:world3d1`, and `:world3d2:<weapon-id>` sessions remain importable, archived, and exportable, without entering v3 baselines. Existing profiles require JSON export/import when changing hosts; local browser storage is not migrated by Pages.

| Area | Evidence and boundary |
| --- | --- |
| Input timing | The weapon clock advances to input time before trigger press/release. A regression check holds a tap for 40 ms after a stalled frame and verifies one round, rather than allowing idle time to become held-fire time. Separate keyboard/pointer trigger ownership prevents unrelated pointer or movement-stick release from cancelling held Fire. Pointer-generated native click handling is separated from pointer fire to prevent a duplicate shot. These are deterministic controller checks, not physical multi-touch or pointer-lock verification. |
| Movement and accuracy | `dist/movement.js` is an independently written friction/acceleration model, not Source 2 or Riot code. Range movement uses substeps of at most 1/120 second and the selected weapon's source speed, with separate game profiles. Four movement checks cover acceleration, friction, counter-input reversal, and constrained air input/profile differences. Spread uses pre-shot heat for the first shot; recoil, accumulated accuracy, and engine integration remain approximate. |
| Automated verification | The implementation pass reports all **67 checks passing**: four movement, 12 weapon, seven geometry, and 44 application/DOM/controller checks. Application coverage adds stalled-tap timing, independent held controls, persistent appearance settings, and the separate VALORANT map/HUD/catalog path. Syntax checks and the graphics build pass. This documentation pass read the current source and test cases without rerunning code, builds, or tests. |
| Reproducible assets and typography | `scripts/fetch-assets.py` reads 23 pinned entries from `scripts/asset-downloads.json`: 21 model/material/arm-texture files, the local Inter variable font, and its OFL license. Every entry has a pinned upstream GitHub revision and SHA-256 hash. All 21 original model/texture remote payload hashes were verified in the implementation pass. Matching local files are reused; missing/mismatched files are fetched and verified. The browser font check confirmed Inter loaded through the local `@font-face`. Official catalog PNGs are committed source assets. The generated graphics bundle is produced by `npm run build`. |
| Pages workflow | `.github/workflows/pages.yml` installs dependencies, restores assets, checks, tests, builds, uploads `dist/`, and deploys on `main` pushes or manual dispatch. Repository **Settings → Pages → Source → GitHub Actions** must be selected. The workflow source was inspected; a successful Actions run, configured Pages source, and live deployment have not been verified. The browser sign-in blocker remains pending. |
| Browser captures | Final recaptures show the [appearance studio viewport](docs/mytrainer-light.jpg), [The Pavilion and dedicated VALORANT HUD](docs/mytrainer-valorant.jpg), and the [390 × 844 touch layout](docs/mytrainer-mobile.jpg). These record the compatibility path and responsive layout; they are not evidence of a native engine, official 3D model, physical mobile performance, or GPU rendering. |
| Renderer and final scoped review | Final disposition: **ship for scored fixes only**. The persistence-absence finding was resolved through scope correction; local-font typography, shared high-contrast graphics-status scrims, scoped heading-kicker removal, and mobile controls were resolved. No regressions were observed in that scope. WebGL2 was unavailable in the review browser. The GPU source compiles, but GPU appearance/effects remain visually unverified. Native-engine fidelity remains unmet, and no whole-surface approval is claimed. |

The previous dated QA entries remain historical records. Physical multi-touch, pointer lock, physical-device performance, actual native-game launch behavior, exact recoil/animation/engine parity, wall penetration, rank equivalence, and measured live-game transfer remain unverified or outside the simulation. `PRODUCT.md` and `DESIGN.md` remain absent as before this ordinary extension; no formal design-system documents were created.

## October 27, 2026 — Fullscreen drills and playable rounds

Version 1.4.0 adds one pre-entry brief per drill, automatic full-viewport practice, eight distinct mechanical guide treatments and three continuous 3D rounds. The overview and drill library use direct task language, less repeated copy and simpler rows. Light/dark mode and saved appearance controls remain available.

| Area | Evidence and boundary |
| --- | --- |
| Recoil | Removed the second procedural upward viewmodel rotation, recoil-derived sway and looping grip animation. One backward impulse returns monotonically. Chronological shot/reload processing and recovery after its exact delay remove frame-size-dependent recovery. Native recoil and animation are not reproduced. |
| Automated verification | **79 checks pass:** four movement, 15 weapon, seven round-rule, seven geometry and 46 application/controller checks. Syntax and graphics build pass. Tests cover recovery timing, monotonic viewmodel impulse, all preflight screens, expanded-view cleanup, action-based branching, completed result saving and archived contexts. The DOM harness now fails on uncaught application errors. |
| Tap / hold | Application-handler tests verify a 20 ms touch-button tap plus the follow-up click spends one round, and a 451 ms Vandal hold spends five rounds with no shots after release. Browser diagnostics measured remote pointer holds of 278 and 451 ms, giving three and five rounds; a measured 13 ms keyboard press spent one round. The earlier six-round remote click was not a measured short tap. No artificial tap delay or altered automatic rate was added. Temporary timing instrumentation was removed. |
| Continuous rounds | Retake evaluates clearing and held objective use; entry evaluates support position and actual kill timing; anchor evaluates visible contact, waiting for confirmation and the travelled route. Mistakes produce review evidence and recovery branches. Browser early fire entered the recovery branch. There are no answer buttons in combined rounds. |
| Completed result | A real 30-second VALORANT Stop → fire attempt completed, displayed its result and appeared in Progress. A fallback ID generator fixes completion on HTTP contexts without crypto.randomUUID; the integration harness explicitly removes that API. |
| Responsive UI | Reviewed desktop, 390 × 844 portrait and 844 × 390 landscape. Portrait instructions expose Start without a redundant diagram; landscape keeps instructions in one column. Gameplay exposes Pause/Exit, contextual objective controls and separate health/minimap areas. Touch targets remain at least 44 px. These are CSS viewport tests, not physical device tests. |
| Fullscreen | Start automatically filled the browser viewport. Native fullscreen was not granted in the review browser; the CSS fallback worked. Background controls are inert while expanded and restored after exit. |
| Impeccable review | A scoped audit simplified hierarchy/copy and corrected faint navigation/footer text, tiny functional labels and stacked modal border/shadow. Existing locally hosted Inter and the functional crosshair alignment grid remain intentional exceptions to detector advisories. No extra design-system rewrite or whole-product approval is claimed. |
| Rendering boundary | The browser used the CPU compatibility path because WebGL2 was unavailable. The GPU source builds; GPU appearance, physical multi-touch, supported-device pointer capture and native fullscreen remain unverified. |

The original maps, licensed family meshes and independent movement/weapon model remain approximations. This release does not embed Source 2 or Riot's engine or establish exact physics, competitive-rank equivalence or measured match transfer. New mechanical results use `world3d4`; continuous rounds use `round3d1`. Prior data remains archived and exportable. See [playable-drills.md](docs/playable-drills.md) and the [Pages deployment record](docs/github-pages.md).

### Pages publication

Source commit `d4539f9` passed all CI steps and deployed successfully in [run 40543905439](https://github.com/robertsoumx/MyTrainer/actions/runs/40543905439). The deploy job reported `https://robertsoumx.github.io/MyTrainer/`. The previously configured root/Jekyll publisher served the README; the app workflow now reads Pages mode and, for branch mode, waits for the default workflow’s same-commit status before building and publishing. The initial completion-event trigger did not fire for GitHub’s dynamic Pages workflow and was replaced with an explicit read-only Actions status check. It requires no stored personal token and changes no repository settings. Live browser verification opened the application at that URL, reviewed the preflight, entered a fixed 1363 × 936 full-viewport drill and loaded the detailed weapon. One F tap changed AK-47 ammunition from 30 to 29 and registered one hit. The canvas reported `world3d-weapons-v4` and `assets=ready` on the compatibility renderer.

The live 30-second CS2 attempt also reached its result screen with the captured hit and quality. Completed screens hide the inactive Pause and gameplay footer controls; Exit and result actions remain available.

[Live full-viewport gameplay capture](docs/mytrainer-live-v14.jpg), recorded after the deployed preflight and a single AK-47 tap (30 → 29). This image shows the compatibility renderer.

## October 27, 2026 — Original design, input rebuild and public leaderboard

Version 1.5 restores the original graphite/coral dashboard and cards while reducing instructional text and in-game cues. New profiles default to dark mode; light mode and saved customization remain available. Mouse, trackpad and touch are selected during first-run setup together with Tap/Hold triggering, game and aim speed. Public username confirmation is mandatory before registration.

The [five pre-publication review passes](docs/review-v15.md) record implementation, findings and corrections. All **94 checks** pass: four movement, 15 weapon, seven round-rule, seven geometry, 49 application/controller, six API/database and six setup/loading checks. Syntax and the graphics build pass. The API tests apply the real generated migrations to a separate SQLite database; no production leaderboard data is seeded.

Browser checks verified AK-47 Tap presses spending exactly one round on desktop, portrait touch and landscape touch; a trackpad drag changed yaw without spending an extra round. A corrected 30-second precision benchmark produced ten measured trials and was accepted by the local API. Model preparation is completed before scoring starts. Native fullscreen was not granted in the review browser; full-viewport fallback was verified. Physical mouse capture, physical trackpad hardware and simultaneous physical multi-touch remain verification limits.

The public composite averages recent fixed-level quality across eight mechanical skills with missing skills at zero. A minimum of three skills is required to appear, with separate game/device boards. Device ownership, elapsed server time, measurement validation and replay protection are enforced. Results remain unverified browser metrics, not a validated competitive rank or anti-cheat protected tournament.

New contexts use `world3d5`. The original private Site is preserved; a separate Sites Worker/D1 API supplies the GitHub Pages leaderboard. Private session history stays on the device and prior contexts remain archived/exportable.

## 1.6 · 2D return · October 28, 2026

See docs/review-v16.md for the five pre-publication review passes. All 102 automated checks and the static build pass. Direct pointer aim, one-round taps, touch controls, tactical-board movement, full timed saving and separate 2D leaderboard storage were verified. Light numbered-target contrast was corrected to 4.653:1 after independent review.

## 1.7 · first-person engine replacement · October 28, 2026

See docs/review-v17.md. Current validation uses 72 checks including real Rapier WASM collisions and actual Three.js mouse-look. Target spawning is adapted from a pinned MIT aim trainer; permissions and notices are retained. WebGL visual QA is blocked by the review browser’s explicitly disabled graphics context. This is recorded as unverified rather than substituting a rudimentary renderer. Five review passes covered sources, controls, physics, states and score compatibility.
