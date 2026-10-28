# 2D control contract · v1.6

The active range is Canvas 2D. Aiming is screen-space pointer positioning, with no first-person camera or pointer-lock permission. The dashboard's existing graphite/coral design is preserved.

## Desktop

Pointer movement updates the crosshair even with no buttons pressed. A pointer-down uses its own coordinates before resolving a shot, so a new click cannot fire at the previous frame's aim. Mouse and trackpad use this same direct path. Clicking does not create a second firing handler.

Tap mode responds to the initial press and releases the automatic trigger internally. Hold mode sustains automatic fire only while an owning input is down. Keyboard, canvas and Fire-pad owners cannot release one another. Pointer cancellation, pause and blur release owned controls. Explicit weapon bursts remain deliberate multi-round actions.

Firing leaves both the pointer and the screen fixed. Weapon spread and recovery affect impact positions. There is no viewmodel kick, flash animation or camera recoil.

## Touch

A canvas touch positions aim; dragging adjusts it using the touch-speed setting. A short tap fires once. A drag does not fire on release. The separate Fire pad supports simultaneous aiming and firing. A movement stick appears only in movement drills, rounds and free practice. Real simultaneous multi-touch hardware remains a separate validation limit.

## Drills and rounds

The brief gives one task sentence, duration, weapon and relevant controls. Tracking hides weapon action buttons. Placement uses a horizontal guide; tracking uses a movement path; transitions number the targets; movement drills use a displacement rail and one stability cue. Peek targets remain hidden until a lateral move passes a tick, then a settled hit is required. Round scenarios use flat player, teammate, target and objective markers.

Target size, exposure and behavior scale with level. The timer caps the final active interval; delayed frames cannot extend the weapon simulation past the deadline. Pause excludes inactive time. Tracking takes one fresh observation per sample, without repeating a stale rendered frame.

New results are `range2d-v1` / `round2d-v1`. Versioned local contexts and the server's `2d1` protocol prevent mixing the new task with older 3D benchmarks. Public scores retain explicit username consent and the existing composite formula.
