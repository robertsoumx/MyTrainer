> Historical implementation. Current v1.7 uses [fps-controls.md](fps-controls.md).

> Historical 3D implementation. The current v1.6 release uses the flat range described in [2d-controls.md](2d-controls.md).

# 3D map and controls

Version 1.5 defaults to **Tap** (one trigger event per press; burst modes keep their burst). Choose **Hold** for automatic fire. Opening a drill shows a full-screen brief; model preparation completes before timing starts. The detailed v1.4 reference below is historical where it differs.

The mechanical drills take place in original navigable 3D practice maps: **Courtyard 04** for CS2 and **The Pavilion** for VALORANT. Move your player through the map and rotate the camera to aim the centered crosshair. Targets have world positions; walls and bodies can block shots. The Pavilion has open target lanes and a dedicated teal HUD with an elimination panel; Courtyard 04 retains its courtyard, alley, ramp, and catwalk.

In **Drills**, choose **Free practice**, then **Enter free practice** for an untimed walk in the selected game's map. Explore does not save a score or change a baseline. Mechanical drills use the selected game’s map. Round scenarios use a connected original site with objective, support and route markers. Every scored attempt presents its instructions before Start opens the practice view.

## Mouse and keyboard

| Action | Control |
| --- | --- |
| Move forward / backward | W / S, or Up / Down arrow |
| Strafe left / right | A / D |
| Look | Move the captured mouse, or drag the world |
| Turn left / right | Left / Right arrow |
| Fire | Left click or F |
| ADS / scope / alternate fire | Right click, or Aim / Alt |
| Jump | Space |
| Crouch | Hold Ctrl |
| Walk | Hold Shift |
| Reload | R or the Reload button |
| Open Armory | B or Armory [B] |
| Primary / sidearm | 1 / 2, in Explore |
| Previous weapon | Q, in Explore |
| Toggle primary / sidearm | Mouse wheel over the world, in Explore |
| Pause | Escape or Pause / Esc |
| Full view | Automatic on Start; Windowed view returns to the workspace |
| Defuse in The retake | Hold E near the cleared objective |
| Report in Hold, then rotate | C while a defender is visible |

Under **Customize → 3D camera controls**, FPS camera mode requests mouse capture when you enter the range. Drag camera mode lets you hold and drag the world to look. If capture is unavailable or declined, drag look still works. In either mode, the crosshair stays centered and shots follow the camera direction, including the trainer's recoil and spread. Dragging changes your view; it does not select a target under the pointer.

With capture active, hold left click for automatic fire. You can also hold F; Touch profiles have a Fire button. Semi-automatic weapons require a new trigger press for each shot. Without capture, a world click/tap with no drag fires on release; use F or Fire for held fire while drag-looking. Burst modes complete the scheduled burst after trigger release.

The weapon clock is synchronized before trigger presses and releases, so a short tap after a delayed animation frame does not inherit idle time as firing time. Keyboard and each fire pointer retain separate trigger ownership. Releasing an unrelated pointer, including the movement stick, does not cancel another held Fire input; pointer-generated clicks do not add a second shot.

Escape releases capture and pauses. Losing focus, hiding the tab, or otherwise releasing capture also pauses the attempt. Use the on-screen Resume action to continue.

## Touch

Choose **Touch** under **Customize → Input profile** if automatic detection does not select it.

| Action | Control |
| --- | --- |
| Move in any direction | Drag the left movement stick |
| Look | Drag the world outside the movement stick and buttons |
| Fire | Hold Fire for automatic fire; a new press for semi-automatic fire, or tap the world without dragging |
| ADS / scope / alternate fire | Aim / Alt button |
| Jump | Jump button |
| Crouch / stand | Crouch button toggles the state |
| Reload | Reload button |
| Armory / pause / view | Use the range actions |
| Use / Call | Contextual round buttons; hold Use to defuse |

Movement is relative to the direction you face. Releasing the movement stick returns it to neutral while an independently held Fire pointer can stay active. The right-side actions leave the world available for drag look. Tracking drills need no firing and hide the Fire button. These behaviors have controller-model coverage; simultaneous physical multi-touch remains unverified.

## Choose and operate a weapon

Choose a firearm in **Customize → Practice weapon**, or open **Armory [B]** from the range. The selected game has its own catalog and saved selection: 34 CS2 profiles or 20 VALORANT profiles. You can choose a weapon before a scored attempt starts; once it starts, that attempt keeps its starting weapon for comparable results. Opening Armory pauses a running attempt.

Explore allows live Armory selection, 1/2 slot switching, Q to return to the last weapon, and the wheel to toggle primary/sidearm. Selecting a non-pistol updates the primary slot; selecting a pistol updates the sidearm slot. The initial sidearm is Glock-18 for CS2 or Classic for VALORANT when a primary is selected. Each weapon's current magazine and reserve are retained when you switch away and back during the same Explore session. Switching cancels a reload and applies an equip delay.

The HUD shows loaded and reserve rounds. R / Reload transfers rounds from reserve; empty reserves cannot refill the weapon. Shell-loading weapons insert one round at a time and can interrupt that reload with a new trigger press once a round is loaded. Reloading exits ADS. Weapon-specific rates, capacities, damage and timings use a dated source snapshot; some integrations remain approximate.

Right click / **Aim / Alt** follows the selected profile. It toggles ADS where available, cycles scope levels and hip fire for scoped weapons, toggles burst or detachable-suppressor modes, or fires a supported secondary attack. For example, Classic secondary fire emits three pellets and spends up to three loaded rounds. Some scoped weapons unzoom after a shot. Not every weapon has ADS or an alternate action. See [weapon sources](weapon-sources.md) for the snapshot, mappings, and approximation flags, including Warden's API-only listing discrepancy.

## Find your route

For CS2, start in the entry hall, facing the doorway into Courtyard 04. Walk through the doorway and pass around the central cover to open different sight lines. The west alley provides another route. On the east side, the ramp rises continuously to the elevated catwalk.

For VALORANT, start beneath The Pavilion's entry structure, facing the target lanes. Practice around the lane cover and move toward the east/west practice areas to change sight lines. This map is flat and does not share Courtyard 04's ramp/catwalk route. Use the zone label and minimap to follow your position and facing direction.

Cover is solid. If a target is hidden, move to reveal it. A body hit does not count as a head shot. Stop-fire and angle-clearing stages require relocation followed by a settled shot; landing is required before a shot can count. Ordered transitions require the numbered targets in order. Tracking measures time with the centered crosshair on the moving head, without clicking.

## Keep comparisons consistent

Customize retains the crosshair, sensitivity, appearance, audio, motion, and game-specific weapon selection. New profiles default to light mode; the header's global toggle switches light/dark. **Appearance studio** offers accent presets/custom color, comfortable/compact density, Soft or Square / Metro corners, HUD scale from **0.8 to 1.3**, and Weapon motion from **0 to 1**. Weapon motion reduces visual sway without changing shot behavior; it does not remove every reload/equip or firing motion. **Weapon & hit audio** enables synthesized gunfire and hit confirmation.

Vertical world field of view ranges from **50° to 85°**, with a default of **64°**; ADS reduces it by the profile's zoom factor. The separate weapon presentation widens from 52° in landscape to at most 80° in portrait so the gun and arms fit. Keep weapon, world field of view, sensitivity, device, orientation, viewport, input profile, and camera-control mode consistent when repeating a benchmark.

Version 1.4.0 mechanical results establish fresh baselines in `:world3d4:<weapon-id>` after the recoil-timing changes. Prior contexts remain in the progress archive and JSON backup, and do not contribute to v4 proficiency. Playable rounds use `:round3d1:<weapon-id>` and do not establish full-skill baselines. Game, input, camera-control, and weapon contexts keep separate mechanical results. Export/import your backup when moving to a new host such as GitHub Pages; local browser data does not follow automatically.

WebGL2 uses the bundled Three.js renderer with textured geometry, shadows, and environment lighting. A CPU perspective renderer uses the same map and moving camera when WebGL2 is unavailable. It displays a cached projection of the loaded GLB weapon at a fixed pose, with procedural motion; it does not reproduce game animation. If a detailed model cannot load, a simplified weapon is shown with a status message. If no rendering surface can be created, the app presents a return-to-training action. See [rendering details](realistic-rendering.md).

Movement uses the independently written `movement.js` friction/acceleration model, stepping in intervals of at most 1/120 second and using the selected weapon's source speed. It is not Source 2 or Riot engine code. Cover blocks shots, with head, body, and leg volumes tested in depth order; wall penetration is not simulated. Movement, recoil, accuracy, damage/armor integration, and presentation contain training approximations. The original maps and licensed family meshes do not reproduce exact official CS2 or VALORANT maps, models, recoil curves, engines, animations, audio, or network conditions. Browser scores do not establish a competitive rank or measured live-game transfer.

## Practice in the native game

**Drills → Train in game** opens practice guidance for the installed game. For CS2 it includes an **Open Counter-Strike 2** link using `steam://run/730`; the actual launch depends on the local Steam/browser setup. For VALORANT it gives Riot Client → VALORANT → Play → Practice → The Range directions. Use the native game to practice its actual engine, official weapon models, gun motion, maps, and recoil. The browser does not embed either native engine. No telemetry is linked and those native-game steps are not automatically scored by this trainer.

## Version 1.5 controls

Choose Mouse, Trackpad or Touchscreen in the first-run profile. Tap fires once per press; Hold enables automatic weapons while pressed. Trackpad drag-look rotates the camera; clicking without dragging fires one tap. Recoil offsets the ballistic crosshair without moving the viewing camera. The default world path is now a lightweight 2.5D presentation. Weapon preparation completes before the timer starts. Version 1.5 uses `world3d5`; the v1.4 context above is historical.
