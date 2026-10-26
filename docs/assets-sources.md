# Rendering asset sources

Acquired 24 October 2026. External rendering assets total approximately 24.25 MB; the selected official informational weapon icons acquired on 26 October add 1.10 MB. Total binary assets, including the local Inter font added later, are 25,699,926 bytes before the small manifests. Source files are hosted locally; the training site does not need to contact the source sites at runtime.

## First-person weapons and hands

The six complete first-person rigs in `dist/assets/models/` were downloaded from the public [IRONLINE / 3d-fps asset mirror](https://github.com/cktang88/3d-fps/tree/main/public/assets/models/fp). Its README identifies original authors, licenses, and upstream modifications. Files are unmodified on disk in Stratum. The renderer may scale, pose, and animate them at runtime.

| File | Original weapon credit | License |
| --- | --- | --- |
| `ak47.glb` | AK-47 by taradavies, via Operation Steel Tide | Weapon mesh CC0; composite arms/rig CC BY 4.0 |
| `m4a1.glb` | M4A1 by Firewarden | CC BY 4.0 |
| `awm.glb` | AWM by erhanmatur | CC BY 4.0 |
| `p226.glb` | Sig Sauer P226 by Alexcanot | CC BY 4.0 |
| `mp5a5.glb` | MP5 Submachine Gun by Rotuma | CC BY 4.0 |
| `shotgun.glb` | FPS Arms Remington by ccransh; Remington 870 by tris09 | CC BY 4.0 |

All six rigs also include **Fps arms by DJMaesen (bumstrum)** and rig/grip templates by **ccransh**, identified upstream as **CC BY 4.0**. Links to every original work are recorded in `dist/assets/credits.json`. Upstream modifications include first-person rigging, posing, mesh optimization, and texture encoding. The AK-47's underlying [taradavies source](https://opengameart.org/content/ak-47-1) was independently checked and declares CC0.

`desert_eagle.glb` is **Desert Eagle by ELIZION**, **CC BY 4.0**, acquired from the [Operation Steel Tide mirror](https://github.com/AetherRadar/operation-steel-tide/tree/main/assets/models/elizion_desert_eagle). Its embedded glTF metadata and the mirror's per-asset license both identify ELIZION and [the original work](https://sketchfab.com/3d-models/desert-eagle-cabde59f5cf24effaf80536e35d04e95). This file is a standalone weapon mesh with no hands or animations.

Attribution and license information must remain available to users when these models are displayed. [CC BY 4.0 license](https://creativecommons.org/licenses/by/4.0/). These are not official Riot Games or Valve assets. Geometry from one weapon family must not be described as an exact official mesh for a different weapon profile.

### Loading and framing

The six first-person GLBs parse successfully with Three.js plus its `MeshoptDecoder`. They use `EXT_meshopt_compression`, `EXT_texture_webp`, and `KHR_mesh_quantization`; they do not require Draco. The GLB root's `userData.fp` is a JSON string containing framing metadata. They are already Y-up and face -Z. Original framing uses scale **0.5** (`K = 2`), a separate first-person camera with vertical FOV **52°**, and near plane **0.01 m**.

The upstream hip framing is reproduced by parsing `h = JSON.parse(root.userData.fp).hip`, creating an Euler from `h.rot` in degrees with order `YXZ`, then placing the viewmodel at `(h.pos[0], h.pos[2], -h.pos[1]) - rotate(h.boreRef[0], h.boreRef[2], -h.boreRef[1])`. The root already contains posed arms and the weapon. The six FP GLBs reference two shared external images, `models/arms_basecolor.webp` and `models/arms_normal.webp`; both files must remain beside the GLBs. They were acquired from the same verified IRONLINE FP asset folder and carry the DJMaesen arm asset’s CC BY 4.0 attribution. Their byte counts, image dimensions, and SHA-256 hashes are in `credits.json`. The optional `grip_vgrip` clips on AK, M4, and MP5 are grip-pose clips, not fire/reload animation sets. Stratum's gameplay motion is authored separately.

The Desert Eagle raw bounds are approximately `[-2.4544, 10.0114, -16.8370]` to `[2.4544, 26.2382, 10.8385]`. It is centimetre-scale: a scale near **0.01**, recentering, and a deliberate first-person placement are necessary.

## PBR material maps

Each material has a local color, OpenGL normal, and roughness map under `dist/assets/textures/<id>/`. These are native WebP files, directly usable by modern browser textures and Canvas images. No generated replacement imagery is used.

| Material | Creator / source | Local resolution | License |
| --- | --- | --- | --- |
| `Plaster003` | [ambientCG / Lennart Demes](https://ambientcg.com/view?id=Plaster003) | 1024 × 1024 | CC0 1.0 |
| `Bricks097` | [ambientCG / Lennart Demes](https://ambientcg.com/view?id=Bricks097) | Color/normal 2048 × 1024; roughness 1024 × 512 | CC0 1.0 |
| `concrete_floor` | [eye-candy.xyz / Poly Haven](https://polyhaven.com/a/concrete_floor) | 1024 × 1024 | CC0 1.0 |
| `rusty_painted_metal` | [Amal Kumar / Poly Haven](https://polyhaven.com/a/rusty_painted_metal) | 1024 × 1024 | CC0 1.0 |

The original material pages were checked for title, creator where named, and CC0 status. Actual WebP files came from the [IRONLINE texture mirror](https://github.com/cktang88/3d-fps/tree/main/public/assets/textures), because direct download endpoints were unavailable in this execution environment. The mirror re-encoded the publicly reusable maps. [CC0 1.0 dedication](https://creativecommons.org/publicdomain/zero/1.0/).

## Verification

- Every GLB has a valid glTF 2.0 header and embedded buffer; all seven model geometries were parsed with the installed Three.js loader, using Meshopt for the compressed rigs.
- Every material file and both shared arm images were opened and verified as WebP images. The arm basecolor and normal maps are 1024 × 1024.
- Exact byte counts, SHA-256 hashes, source URLs, and per-file metadata are in `dist/assets/credits.json`.
- Shader appearance, animation quality, and camera placement require the application's live visual checks; this acquisition task does not claim they were visually verified.


## Official publisher asset review — 26 October 2026

### Riot public content catalog: selected UI reference images

The [official VALORANT developer documentation](https://developer.riotgames.com/docs/valorant#assets) offers a Public Content Catalog of icons, logos, and text for free use, subject to Riot's terms and policies. We downloaded its linked [release-08.09 archive](https://valorant.dyn.riotcdn.net/x/content-catalog/PublicContentCatalog-release-08.09.zip) directly from Riot's CDN, verified the ZIP, and extracted only **19 standard weapon PNGs**. The 509,672,170-byte archive remains in temporary research storage and is not included in the site. It contains 6,767 PNGs and one JSON file, with no 3D or engine files. The downloaded catalog version is `08.09.00.2521387`; it is **not evidence of current balance values or roster completeness**.

Local files are under `dist/assets/catalog/valorant/`: `classic.png`, `shorty.png`, `frenzy.png`, `ghost.png`, `sheriff.png`, `stinger.png`, `spectre.png`, `bucky.png`, `judge.png`, `bulldog.png`, `guardian.png`, `phantom.png`, `vandal.png`, `marshal.png`, `outlaw.png`, `operator.png`, `ares.png`, `odin.png`, and `melee.png`. These are the original PNG pixels without modification, renamed from UUID for local reference. They have transparent backgrounds, width 512px, and varying heights. They total **1,099,176 bytes**. Their original archive-member paths, publisher UUIDs, dimensions, byte counts, and SHA-256 values are recorded in `dist/assets/catalog/valorant/manifest.json`, including the source archive's SHA-256.

These images are intended as informational weapon-reference thumbnails. They do not make the training renderer an official VALORANT simulation and must not be presented as official branding, 3D weapon meshes, or in-world textures. Riot retains ownership; this is not a Creative Commons or open-source license. The [General Policies](https://support-developer.riotgames.com/hc/en-us/articles/22698591841939-General-Policies), updated 29 May 2025, prohibit games using Riot IP, simulators or recreations, and close resemblance to Riot products in style or function. They also require product registration/audit and a readily visible nonendorsement disclaimer. The [developer policy page](https://developer.riotgames.com/policies/general), [VALORANT-specific policy](https://developer.riotgames.com/docs/valorant), [API terms](https://developer.riotgames.com/terms), and [fan-content policy](https://www.riotgames.com/en/legal) must be considered together. This asset acquisition does not establish that the project has Riot registration or approval.

### Valve CS2 Workshop geometry: research only

The [official Workshop resources page](https://www.counter-strike.net/workshop/workshopresources) links the [CS2 weapon geometry ZIP](https://media.steampowered.com/apps/csgo/images/workshop/workshop/cs2_weapon_model_geometry.zip). The archive was downloaded to temporary research storage and inspected. It is **27,251,170 bytes**, containing **35 Wavefront OBJ files only**. There are no textures, MTL materials, arms, animations, sounds, maps, game logic, README, or license files. The [Weapon Finishes Guide](https://www.counter-strike.net/workshop/workshopfinishes/) describes creating and submitting finishes for the CS2 Workshop. Neither this checked context nor the archive establishes permission to redistribute those Valve meshes in an independent browser trainer; public download availability is not an open redistribution license.

**No Valve geometry is included in the site's published assets.** `dist/assets/catalog/valve-geometry-review.json` records the archive source, hash, all 35 filenames, inspected features, and sample geometry bounds without containing the actual meshes. OBJ has no declared units or orientation. Sample Z spans are AK-47 37.286766, M4A4 35.290322, Desert Eagle 11.550100, and AWP 53.655932 raw units. Interpreting these as inches and multiplying by 0.0254 is only a hypothesis, not a verified conversion. The pack does not provide a native Source 2 engine or complete textured first-person presentation.


## Local UI font — Inter

`dist/assets/fonts/InterVariable.woff2` is the original upright variable Inter font, downloaded directly from the official [rsms/inter repository](https://github.com/rsms/inter) at pinned revision `353b61b9f4430d5f420d56605a6e7993e0941470`. [Pinned font source](https://raw.githubusercontent.com/rsms/inter/353b61b9f4430d5f420d56605a6e7993e0941470/docs/font-files/InterVariable.woff2). The Inter Project Authors / Rasmus Andersson release it under **SIL Open Font License 1.1**. The unmodified [official license](https://raw.githubusercontent.com/rsms/inter/353b61b9f4430d5f420d56605a6e7993e0941470/LICENSE.txt) is included as `dist/assets/fonts/Inter-OFL.txt`; preserve this copyright and license with redistributed copies. No subsetting or re-encoding was performed.

Font size: **352,240 bytes**. SHA-256: `693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3`. Verified the `wOF2` signature, declared file length, and nonzero OpenType table count (19). `scripts/asset-downloads.json` pins both the font and license to the same revision with SHA-256 hashes, allowing CI to restore the exact files.
