> Historical implementation. Current v1.7 uses [fps-controls.md](fps-controls.md).

> Historical 3D implementation. The current v1.6 release uses the flat range described in [2d-controls.md](2d-controls.md).

# Playable drills — version 1.4

Historical version 1.4 guide treatments. Version 1.5 removes most labels and uses concise preflight instructions; see [the current review](review-v15.md).

Every attempt begins with a brief: three steps, what counts, duration, weapon and controls. Start enters a fixed full-viewport panel and requests browser fullscreen. If the browser declines, the full-viewport panel remains usable. Escape, focus loss and tab hiding pause play. Background navigation is inert while the expanded practice panel is active; leaving restores it.

## Distinct practice cues

| Drill | In-world cue | Scored action |
| --- | --- | --- |
| Micro precision | Highlighted head | First-shot head accuracy |
| Flick acquisition | Acquire ring at a new angle | Head accuracy and acquisition time |
| Strafe tracking | Moving head and travel guide | Crosshair dwell; no firing |
| Target transitions | Numbered order | Head hits on the next target |
| Crosshair placement | Lane head-height guide | Head hits during exposure |
| Stop → fire | Departure marker and stability cue | Move at least 0.6 m, settle and hit the head |
| Burst discipline | Ready / Recover cue | Deliberate head taps separated by recovery |
| Angle clearing | Cover cue | Reveal the angle, settle and hit the head |

The eight standalone tactical judgment modules retain six-decision exercises. Their brief explains that interaction before entry. Combined rounds use player-operated 3D situations instead of answer buttons.

## Three continuous rounds

- **The retake:** clear both defenders, reach the objective and hold Use. Entering the objective while a defender remains is recorded as an exposure mistake. Defuse uses a 5-second CS2 kit or 7-second VALORANT timer; VALORANT retains the halfway checkpoint.
- **Trade the entry:** reach the support marker, wait for the blue teammate's contact, then eliminate the defender inside the two-second exercise window. An early shot or missed window adds a defender and opens a recovery branch.
- **Hold, then rotate:** call a visible contact, remain in the hold area until objective confirmation, then follow the route and clear B. Leaving early records an information error and opens a recovery branch.

These rules are authored training exercises. They do not represent full-match AI, real teammates, live communications, utility simulation or universal tactical truth. The two-second trade window and eight-second confirmation are exercise parameters.

`round-sim.js` owns objectives, branches and judgments. `range.js` feeds movement, visibility, shots, kills and objective-use state into those rules. The final review records the action, elapsed time and reason for each judgment. Round components count practice time once and remain limited evidence, separate from full-skill proficiency.

Mechanical histories use `:world3d4:<weapon-id>`; round histories use `:round3d1:<weapon-id>`. Previous results remain in the archive and JSON backup. This avoids comparing the changed recoil timing directly with older measurements.

## Firing verification

Weapon events advance at their scheduled times. Trigger release stops automatic continuation; a pointer-generated click does not add another shot. Recoil recovery starts only after its delay, independent of frame boundaries. Camera recoil supplies the upward impulse; viewmodel translation has one monotonic return. Imported grip clips establish a static pose rather than looping during shots.

The final suite has 79 checks, including real application event handlers for a 20 ms touch-button tap plus its follow-up click (one round), and a 451 ms Vandal hold (five rounds, with no continuation after release). Browser diagnostics measured a 13 ms keyboard press and one round. Remote pointer-click checks were delivered as 278–451 ms holds; their three/five rounds match the configured rate. This is not a physical touchscreen latency test.

## Limits

This remains an independent browser simulation. Neither Source 2 nor Riot's native engine is embedded. Original maps, licensed family meshes, procedural animation and approximate movement/recoil do not establish exact game fidelity. The review browser used compatibility rendering because WebGL2 was unavailable. Native fullscreen, GPU appearance, physical multi-touch and real-device performance remain unverified.
