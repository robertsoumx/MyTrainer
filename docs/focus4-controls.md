# Four-drill controls (v1.8)

| Drill | Action | Measures |
|---|---|---|
| Precision | Hit any small bright sphere | Accuracy and fine control at pace |
| Target switching | Hit the bright sphere, then the next | Acquisition, transition speed and accuracy |
| Tracking | Hold fire and follow the moving sphere | On-target samples while firing / all run samples |
| Move & shoot | Move at least 0.65 m, release, settle, shoot | Grounded movement timing plus aim and pace |

Every run is 30 seconds. Precision targets are smaller at higher levels; switching targets shrink; tracking targets shrink and move faster; movement targets shrink while score pace increases. Level increases at quality ≥85 and falls below 50, bounded to 1–8. Missing data never becomes a fabricated score.

Mouse/trackpad: move to look, click or F to fire, Esc to pause. Capture mouse enables unrestricted turning. If capture is declined, free pointer movement still turns the camera. In movement practice, WASD/arrows move and Space jumps. Firing never moves the camera and never applies random recoil/spread. A single press makes one shot; held mode repeats at 10 Hz. Tap mode has a 75 ms anti-bounce cadence; no delayed queued shot occurs.

Touch: drag the view to look; a short tap fires. Hold the separate Fire pad for tracking or Hold mode. The movement drill adds an independent left joystick, so move/look/fire can use separate pointers. Pointer cancellation, focus loss, pause and exit release inputs.

The entry brief is separate from the running clock. Physics readiness, any required public attempt and a 3-second countdown precede the timer. Exit during loading/countdown cancels the launch. Viewport expansion is automatic; native fullscreen and pointer lock are requested within the entry gesture and remain browser-controlled.

The scene contains no weapon model, humanoids, quiz UI or realistic materials. The game is rendered using Three.js and restrained bloom; Rapier remains responsible for actual collision and ray intersections. This is a browser trainer, not a native CS2/VALORANT engine reproduction.
