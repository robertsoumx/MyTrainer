# Rendering and weapon presentation

Updated October 27, 2026 for version 1.4.0 and the [MyTrainer GitHub Pages migration](github-pages.md). The range gives the navigable world most of the training surface, with a visible weapon, centered aim, HUD, and ammunition state. New profiles default to a light workspace, with locally hosted Inter, a global light/dark toggle, and appearance controls. Training modules, adaptive measurement, and the local profile workflow remain in place.

The browser does **not** embed Valve's Source 2 or Riot's native engine, exact official 3D gun models, or exact game gun motion. The requested native fidelity is not achieved here. **Train in game** supplies guidance and a CS2 Steam launch URI for installed-game practice; it does not connect telemetry or import native-game results.

## Game-specific spaces and presentation

CS2 retains the original Courtyard 04, including its courtyard, west route, continuous ramp, and elevated catwalk. VALORANT now has a separate original map, The Pavilion, with open target lanes, different cover, a teal HUD/minimap and elimination panel, a grayscale/cool weapon and arm palette, and rounded training targets. These are independent practice environments rather than official map reproductions or native interfaces.

Appearance studio controls accents, density, Soft or Square / Metro corners, HUD scale (0.8–1.3), and Weapon motion (0–1). Motion changes visual sway while shot behavior remains consistent; reload/equip and firing presentation are still procedural. The default corner option remains Soft.

## Two rendering paths

| Path | Implementation | Boundary |
| --- | --- | --- |
| WebGL2 | `src/realistic-renderer.js`, bundled into `dist/graphics.js`, uses Three.js perspective rendering, local color/normal/roughness maps, environment lighting, soft shadows, detailed viewmodels, muzzle flashes, and wall-impact marks. | The source builds successfully. WebGL2 was unavailable in the browser used for this update, so its appearance, effects, and device performance remain visually unverified. |
| CPU compatibility | `dist/world3d.js` projects the selected map geometry from the moving camera. `CompatView` loads the same GLB family model, projects and caches its textured triangles, and draws the result over the world. | The weapon is baked at a fixed hip pose, with procedural sway, recoil kick, reload lowering, equip motion, and ADS placement. It does not play exact game firing or reload animations. A simplified family weapon is available if the detailed asset fails to load. |

Both paths use the selected game's map, player movement, collision, elevation where present, shot rays, targets, and weapon simulation. The compatibility renderer is a navigable 3D world, with a cached viewmodel image for its foreground weapon. It does not implement the GPU path's normal/roughness shading, shadow maps, environment reflections, muzzle flashes, or impact marks. The weapon camera widens from 52° in landscape to at most 80° in portrait; this is separate from the configurable world field of view. The GPU source adds camera-responsive yaw/pitch sway; the compatibility path's cached pose retains simpler motion.

`dist/movement.js` independently implements ground friction, acceleration, constrained air input, gravity, and jump profiles. `dist/range.js` uses movement steps of at most 1/120 second, with the selected weapon's source speed. This remains an approximation, not native engine integration. Trigger events advance the weapon clock before press/release and keep keyboard/pointer ownership separate. Spread uses pre-shot heat so the first rested shot does not acquire its own follow-up heat penalty; accumulation/recovery and recoil remain approximate.

## Data and assets

The 54 profiles use the October 24 snapshot: 34 CS2 and 20 VALORANT firearms. See [weapon-sources.md](weapon-sources.md) for exact source endpoints, units, hashes, derived fields, approximation flags, and Warden's API-only listing discrepancy. The snapshot is not an assurance of future patch parity.

The local Riot Public Content Catalog manifest records **19 official 2D PNGs**, including melee, from catalog version 08.09. The informational Armory currently displays 18 supported firearm thumbnails; Bandit and API-listed Warden have no thumbnail in that older catalog. These PNGs are reference images, not 3D gun/arm meshes, animation clips, recoil, sounds, or engine code. They are governed by Riot's policies and are not Creative Commons assets; the [catalog manifest](../dist/assets/catalog/valorant/manifest.json) preserves scope, attribution, hashes, and policy links. Their presence does not establish Riot endorsement or product approval.

Seven licensed model families are shared across the profiles: AK-47, M4A1, AWM, P226, MP5, Remington-style shotgun, and Desert Eagle. The first six include gloved arms; Desert Eagle is a standalone weapon mesh. The six compressed first-person rigs require Meshopt decoding and local shared `arms_basecolor.webp` / `arms_normal.webp` images. Optional grip clips establish a pose, not a gameplay animation set. Runtime motion is procedural. See [assets-sources.md](assets-sources.md) and `dist/assets/credits.json` for creators, licenses, modifications, and hashes; retain these credits when deploying.

Surface color, OpenGL normal, and roughness maps ship locally for plaster, brick, concrete floor, and painted metal. The renderer uses licensed assets rather than generated replacement imagery. Optional gunfire and hit confirmation are synthesized by `dist/range.js` when sound is enabled.

## Development and evidence

After `npm ci`, run `python3 scripts/fetch-assets.py` to restore **23 pinned files** from the revisions and SHA-256 entries in `scripts/asset-downloads.json`: 21 licensed model/material/arm-texture files, `InterVariable.woff2`, and `Inter-OFL.txt`. Matching local files are reused; mismatches are downloaded and verified before writing. All 21 original model/texture remote payload hashes were verified for this migration. `@font-face` loads the local Inter variable font, and the browser font check confirmed it loaded. Official catalog PNGs remain committed source assets. Run `npm run build` after editing `src/realistic-renderer.js`; it bundles Three.js and the loader into generated `dist/graphics.js`. Deploy the complete `dist/` directory, including models, shared arm images, material maps, fonts/licenses, catalogs, credits, and vendor licenses. Run `npm run check` and `npm test` for syntax and the 79 movement/weapon/round/geometry/controller checks. The Pages workflow performs these preparation and verification steps before uploading `dist/`; see [deployment status](github-pages.md).

The [October 27 QA update](../QA.md#october-27-2026--fullscreen-drills-and-playable-rounds) records current input, UI and deployment evidence. The [live gameplay capture](mytrainer-live-v14.jpg) shows the full-viewport CS2 drill on GitHub Pages with a loaded weapon and 29 rounds after one tap. Earlier appearance, VALORANT and mobile captures remain historical evidence of their dated revisions. All browser captures used compatibility rendering because WebGL2 was unavailable; GPU compilation is not GPU visual evidence. Physical multi-touch, pointer lock, physical-device performance, native launch behavior and exact game parity remain unverified.

Courtyard 04 and The Pavilion are original. Shared model families are not exact official game meshes. Original recoil curves, engine behavior, armor/penetration rules, exact game animations, network conditions, rank equivalence, and measured transfer to matches are not reproduced or established. Cover stops shots; wall penetration is not simulated.

## Recoil correction and playable rounds (1.4)

Weapon events are processed in chronological order, including automatic shots, bursts, reload completion and recoil recovery. Recovery applies only to the elapsed interval after its delay. This removes frame-size-dependent recovery and prevents a delayed frame from changing the recoil envelope. Three regression checks cover the recovery threshold, automatic-fire event timing and the monotonic one-shot visual envelope.

Camera punch remains the single upward firing impulse. The GPU viewmodel no longer adds a second upward rotation or derives sway from the recoil-adjusted camera. Imported grip clips establish a fixed pose rather than looping during play. One short backward impulse decays monotonically; the compatibility view uses the same envelope instead of an abrupt delayed lift. These repairs remove known duplicate motion sources, but do not reproduce native recoil curves or animation.

The three playable rounds use a flat connected site with matching visible/collision geometry in both renderers. Map-specific decorative architecture is omitted on this site so it cannot appear as cover without collision. Contextual world markers, a blue teammate in the entry exercise, objective progress and live instructions distinguish the round from isolated drills. See [playable drills](playable-drills.md).
