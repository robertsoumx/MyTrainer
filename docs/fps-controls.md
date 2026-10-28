# FPS range · 1.7

Conventional first-person training replaces the flat pointer field. The crosshair stays at screen center and mouse movement rotates the camera. Captured movement uses the installed Three.js PointerLockControls implementation. Without capture, ordinary unpressed pointer movement also rotates the view; there is no drag-only desktop fallback. Touch uses drag-look and a separate Fire pad.

The maintained Rapier character controller resolves capsule displacement against the actual room colliders. Simulation uses 1/120-second substeps. Grounding, gravity, jump and wall sliding come from the collision world. Camera-relative inputs use the existing CS2/VALORANT acceleration profiles. Jumping affects weapon spread through grounded state. Cover and target intersections use 3D world rays with the player excluded.

Firing has a single owned trigger path. Pointer-down, keyboard and Fire-pad owners cannot release one another, and subsequent browser click events do not fire a second shot. Tap releases the auto trigger internally after its initial press. Hold uses the weapon simulator’s rate. Explicit burst modes remain multi-round trigger actions. Pausing releases held controls and freezes the scored timer. The weapon model has one immediate small translation and monotonic return; shots do not rotate the camera.

The scene uses WebGL 2, standard physically based materials, texture maps, environment illumination, target shadows, an architectural room and licensed GLB viewmodels. It has no humanoid approximations or piles of obstacle cubes. Peek uses an architectural partition with matching physical cover. ADS changes world field of view. Asset preparation precedes the clock and public attempt.

There is an explicit graphics error if WebGL 2 is unavailable. No Canvas/software approximation is selected automatically. Engine and source notices are available from Assets & sources.
