# Weapon data snapshot

Retrieved October 24, 2026. `dist/weapon-data.js` contains 54 selectable firearms: 34 CS2 and 20 VALORANT. Grenades, knives, Zeus, and agent abilities are outside this firearm catalog. No game engine or official weapon model is embedded in this data file.

## Sources

- [CS2 weapons.vdata — SteamTracking mirror of Valve game data](https://raw.githubusercontent.com/SteamTracking/GameTracking-CS2/master/game/csgo/pak01_dir/scripts/weapons.vdata). The mirror is not Valve's official publishing endpoint; its contents are tracked game files. The exact retrieved text is identified by SHA-256 in `WeaponData.sources`.
- [VALORANT-API weapons endpoint](https://valorant-api.com/v1/weapons). This is a non-official community API, explicitly not endorsed by Riot. Its snapshot supplies magazine size, fire rate, reload/equip times, run-speed multipliers, first-bullet accuracy, pellets, penetration category, ADS behavior, and damage ranges. The retrieved response's SHA-256 is retained in `WeaponData.sources`.
- [Riot's official arsenal](https://playvalorant.com/en-us/arsenal/) confirms weapon names/categories and descriptions. Its retrieved page includes Bandit but currently omits Warden. Warden is present in the retrieved live API and [community wiki](https://wiki.playvalorant.com/en-us/Warden); its row has `officialArsenalListed:false` so this discrepancy is explicit.
- VALORANT Wiki's individual weapon pages supply reserve ammunition, which the API omits. The values were independently retrieved through the web source reader, not inferred from a universal magazine multiplier. Example: [Vandal](https://wiki.playvalorant.com/en-us/Vandal) has 25 loaded / 50 reserve; [Ghost](https://wiki.playvalorant.com/en-us/Ghost) has 13 / 39 in the retrieved snapshot. Every firearm's page is `https://wiki.playvalorant.com/en-us/<Name>`.

No skins, videos, display icons, or other visual assets from the weapons endpoint are copied by this module.

## Module interface

Browser global `WeaponData`; CommonJS `require('./weapon-data.js')`:

- `weapons`: array of profiles.
- `byId(id)`: profile or `null`; also accepts the source code/UUID.
- `forGame('cs2' | 'valorant')`: that game's profiles.
- `defaults`: `cs2-ak47` and `valorant-vandal`.
- `sourceDate`, `sources`, `limitations`.

Profile identifiers have a game prefix, e.g. `cs2-m4a1-silencer`, `cs2-awp`, `valorant-phantom`. A profile includes `name`, `category`, primary `fireMode`, `mag`, `reserve`, rounds-per-second `rate`, seconds `reload`/`equip`, `damageRanges`, `pellets`, ADS/scope fields, movement speeds in metres/second, penetration tags, and explicit approximation metadata.

### Units and mappings

| Field | Interpretation |
| --- | --- |
| `rate`, `scopedRate` | Rounds/second. CS2 derives these from `1 / m_flCycleTime`; VALORANT comes directly from the API. |
| `reload`, `equip` | Seconds. CS2 reload uses `m_flDisallowAttackAfterReloadStartDuration`, an attack-lockout timing field, rather than a guarantee about animation duration. |
| `reserve` | Rounds outside the loaded magazine. CS2 reserve clip counts are multiplied by capacity only when `m_bReserveAmmoAsClips:true`; otherwise they are already round counts. |
| `moveSpeed`, `adsMoveSpeed` | Metres/second. CS2 Source units use 0.0254 m/unit. VALORANT normal speed uses 6.75 m/s × API weapon multiplier; ADS additionally uses its ADS movement multiplier. |
| `accuracy.*` | Radians. VALORANT first-bullet degrees are converted directly; negative API sentinel values normalize to zero. CS2 cone coefficients are converted with `atan`. Browser accuracy accumulation is approximate. |
| `recoil.pitch`, `recoil.yaw` | Radians for the trainer's camera-kick model, **not extracted original recoil curves**. `recoil.unit` is `radians`; `recover` is seconds. All rows have `recoil.approximate:true`. |
| `scopeFov` | CS2's original source FOV values. |
| `scopeZoom` | VALORANT source zoom multipliers; CS2 derived `90 / sourceFov` ratios, labeled as derived approximations. They are not a claim of identical scope optics. |
| `damageRanges` | VALORANT's explicit metre bands, with `min`, `max`, `head`, `body`, `leg`. CS2's row holds base damage; see its continuous model below. |
| `altFire` | `type`, `count`, `rate`, and behavior-specific values. Count is burst count, distinct from shotgun `pellets`. |

### CS2 damage model

CS2 base body damage, head multiplier, armor ratio, penetration power, and range modifier come directly from the VData snapshot. The profile's `damageModel` carries the continuous range modifier with a 12.7 m step (500 Source units):

`damageAtDistance = baseDamage × rangeModifier ** (distanceMetres / 12.7)`

The base values are unarmored. Correct helmet/armor absorption, hitgroup effects, surface thickness/material penetration, and server rules require an engine-level implementation; the training simulation is marked approximate. The `legDamage` convenience field uses a 0.75 hitgroup multiplier and is explicitly flagged as derived.

### Alternate and special behavior

- CS2 Glock/FAMAS burst counts, burst shot spacing, and burst cycle values are supplied from VData.
- CS2 scoped weapons retain source FOV levels and whether they unzoom after a shot/hide the viewmodel while zoomed.
- M4A1-S and USP-S expose detachable-silencer alternate behavior; MP5-SD is marked integrated/silenced.
- VALORANT Bulldog and Stinger retain ADS burst counts and ADS rates. The internal burst scheduling is marked approximate.
- Classic secondary fire exposes three pellets and its source secondary rate. Bucky airburst exposes its pellet count and burst distance.
- Odin exposes source base/maximum rates, with the trainer's ramp duration explicitly approximate.
- Shotguns that reload one shell at a time carry `reloadStyle:'shell'`; CS2 source `reload` is per-shell lockout. Start-animation times and VALORANT shell pacing remain approximation flags. `shellReload` is a separate convenience duration: source per-shell timing for CS2, or a flagged approximate source-full-time / capacity for VALORANT. Do not interpret the VALORANT API's full `reload` duration as the duration of each individual shell.
- R8's alternate firing rate is supplied; its trainer trigger preparation delay is explicitly approximate.

## Accuracy boundary

The catalog deliberately preserves differences among the actual game weapons without claiming proprietary-engine parity. No validated original spray curve, weapon animation rig, material penetration integrator, movement deadzone, or latency model was obtained. Recoil, spread growth/recovery, some crouch/movement penalties, and physical presentation remain trainer approximations. Each profile names those fields in `approximations`.

## Validation performed

Verified 54 unique identifiers, 34 CS2 / 20 VALORANT profiles, nonzero finite magazine/rate/reload/equip/movement values, damage ranges, radians for accuracy and recoil, and explicit recoil approximation flags. Spot checks include AK-47 30-round magazine, Vandal 25 loaded / 50 reserve, and Phantom 30-round magazine. No live-game transfer or patch parity test was performed by this data task.
