# v1.6 · 2D release review

Five passes were completed before frontend publication:

1. Replaced the camera/drag fallback with absolute mouse and trackpad aiming. Hover without a pressed button updates aim; pointer-down uses current coordinates.
2. Verified firing ownership, Tap/Hold cadence, reload, cancellation and stable aim. Added an active deadline so delayed frames cannot extend firing past the drill.
3. Reviewed desktop, portrait and landscape, dark and light. Removed scene models and extra action buttons; kept concise briefs, geometric targets and necessary cues.
4. Added and deployed the backward-compatible `2d1` leaderboard protocol. An additive migration preserves legacy `v5` scores and names while separating composites. Both live board queries returned 200.
5. Completed a real 30-second local browser benchmark: one hit, ten trials, saved under `2d1`. Fixed the final-exposure HUD refresh. Independent Impeccable review requested one contrast adjustment: light numbered targets now measure 4.653:1.

Validation: 102 automated checks pass, syntax checks pass, static build passes and whitespace checks pass. Browser checks confirmed one-round taps, aim coordinates, mobile Fire controls and operated tactical-board movement. Native fullscreen and physical simultaneous multi-touch remain device-dependent validation limits. The full-viewport fallback is implemented.

The active page loads Canvas 2D, with no 3D renderer, humanoid, viewmodel or scenery. The original dashboard identity remains. Historical 3D source and geometry regression tests remain outside the active page.
