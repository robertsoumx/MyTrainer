# 1.7 verification

Five bounded review passes covered source reuse/licensing, camera/input semantics, Rapier physics, integration/loading/error states, and scoring/deployment compatibility.

The current test command passes 72 checks: movement profiles (4), weapon behavior (15), round rules (7), progress/data rules (13), and Node suites (33). The Node suites include the actual Rapier WASM engine for floor contact, wall sweeps/sliding, jump/gravity, ray distances, cover occlusion and moving/removed targets; the actual Three.js PointerLockControls for captured-mouse rotation; the FPS controller for free mouse look, tap/hold ownership, stable shot camera, center-ray hit selection, touch drag and pause; first-run/loading checks; and shared leaderboard validation/isolation. A mocked renderer is used only for controller/DOM tests. Historical 2D integration and old geometry tests remain in source but are not presented as validation of this renderer.

The independent source review found two release fixes: texture completion now gates drill readiness and failed textures reach the retry screen; replaced, stale or destroyed viewmodels release their geometries, materials and texture maps with shared-resource deduplication. Four focused resource tests cover successful and failed loading, shared resources across both scenes, and skeleton textures.

Syntax, build and whitespace checks pass. The public API serves the fps1 board separately from older protocols.

**Graphics verification limitation:** the provided cloud browser reports GL_VENDOR=Disabled and GL_RENDERER=Disabled. The real WebGL scene cannot be displayed there. The actionable graphics-unavailable state was observed, while camera and collision behavior were verified directly. No screenshot or claim of visually verified GPU rendering is supplied. GPU appearance, hardware-specific performance, native fullscreen and physical multi-touch require a graphics-enabled browser; the app does not conceal that requirement behind a dot or primitive software renderer.
