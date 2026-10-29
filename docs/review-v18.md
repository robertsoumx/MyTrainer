# v1.8 review

The scope is four physical aim drills and a reduced application. The public entry loads core, movement, Three/Rapier engine, range controller, leaderboard client and app only. Decision, weapon, round and older range code remains historical source, not active behavior.

Five bounded review areas: (1) drill selection, instructions and removal of inactive exercises; (2) firing, captured/free look, target selection and input ownership; (3) Rapier contacts, gravity and ray queries; (4) scoring, adaptive history, imports and public protocol isolation; (5) responsive UI, contrast, loading, countdown, pause, error and deployment behavior.

Current tests cover held fire across frame rates, tap de-duplication, no camera kick or random spread, center-ray hits, immediate target replacement, ordered switching, full-run tracking samples, movement gates/reset, touch tap/drag/cancel, focus/pause and finish boundaries. Direct tests execute Rapier WASM and actual Three PointerLockControls; controller/UI tests use a renderer mock. API tests use real SQLite and preserve legacy protocol coverage. Resource tests include retained helpers from earlier builds and are not evidence of current GPU appearance.

Desktop dark/light library and entry, plus a real 390×844 iframe viewport, were reviewed. The iframe framing remains visible in the mobile screenshot so it cannot be mistaken for a device capture. Mobile body scroll width matched client width. The lighter-theme accent was adjusted for readable navigation and focus states. Background application controls are inert while a drill is open.

**Graphics limit:** cloud Chrome reports GL_VENDOR=Disabled / GL_RENDERER=Disabled and cannot create WebGL. No gameplay screenshot is fabricated. The active graphics-unavailable recovery was observed. Actual GPU rendering, glow quality, hardware frame rate, native fullscreen/capture behavior and physical multi-touch remain unverified here. The range does not disguise failure with a dot or software imitation.

The Impeccable launcher/detector was unavailable; no automated detector verdict is claimed. The fresh finish reviewer receives the actual UI captures, source, direction contract and these limits. Final source findings and verdict are recorded after that review.

The fresh reviewer returned `fix` for two source issues: Move & shoot could place a sphere beyond a side wall, and loading/countdown could start after focus was lost. The fix batch clamps the full sphere inside the inner wall and adds a document-focus/visibility guard throughout preparation and countdown, requiring an explicit focused restart after interruption. Five regression tests cover both actual Rapier wall rays, blur/hide during preparation, hidden countdown and focus at its final transition.

The complete current command passes 77 checks (17 movement/progress checks plus 60 Node checks). Syntax, build and whitespace checks pass. The public focus4 API was deployed successfully without deleting earlier data or migrating its schema. Final verdict scores these two fixes at source/test scope, with GPU graphics still unverified.

Final verdict: **ship**, limited to the two scored fixes. The reviewer marked target reachability and interrupted-launch lifecycle **resolved**, verified their focused regressions, and found no regression in those fixes. Desktop/mobile captures remain intact. This verdict does not certify unavailable GPU presentation or physical-device behavior.
