Source: https://github.com/freddysae0/threejs-aim-trainer
Revision: e28148a4de56809a1c0a6fbb7b3f6492fc85e3cb
Author: Freddy Saez. License: MIT, retained in LICENSE.

RandomCubeGenerator.original.ts preserves the referenced source. src/vendor/TargetGenerator.js adapts its 50-attempt Box3 overlap-rejection algorithm for sphere targets, configurable ranges and conventional -Z forward. The original trainer’s floor/coordinate clamps are replaced by Rapier’s character controller. Three.js PointerLockControls handles captured camera input. The room, drill integration and existing weapon profiles remain MyTrainer-specific. No current Redblock code was copied.
