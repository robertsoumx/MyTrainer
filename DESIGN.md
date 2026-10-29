---
name: Stratum
description: Graphite and coral controls around a matte blue aim room.
colors:
  primary: "#f17a59"
  accent-text-fallback: "#ffab8b"
  accent-ink: "#111315"
  graphite-bg: "#151719"
  graphite-side: "#111315"
  graphite-surface: "#1c1f22"
  graphite-raised: "#24282c"
  graphite-line: "#33383e"
  graphite-text: "#eeeef0"
  graphite-muted: "#a4aab2"
  light-bg: "#f4f5f6"
  light-surface: "#ffffff"
  light-raised: "#eef0f2"
  light-line: "#d7dbe0"
  light-text: "#1c2027"
  light-muted: "#58616e"
  preview-blue: "#142137"
  range-bg: "#101b30"
  range-chrome: "#101a2b"
  range-line: "#26364d"
  range-text: "#eef5ff"
  range-muted: "#9aaec8"
  range-wall: "#263650"
  range-ceiling: "#17263f"
  range-structure: "#426181"
  range-strip: "#53c8f0"
  precision: "#48d9fa"
  switching: "#9c9bff"
  tracking: "#55ecc9"
  movement: "#ffc278"
  inactive-orb: "#425c82"
  crosshair: "#ecf8ff"
  error-dark: "#ef9d96"
  error-light: "#a23129"
typography:
  display:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "96px"
    fontWeight: 450
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "32px"
    fontWeight: 580
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  brief-headline:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "38px"
    fontWeight: 580
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 550
    lineHeight: 1.5
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
  button:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 550
    lineHeight: 1.5
  hud-value:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "24px"
    fontWeight: 500
    lineHeight: 1.2
  hud-label:
    fontFamily: "Inter, Arial, sans-serif"
    fontSize: "9px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.07em"
rounded:
  cue: "4px"
  control: "6px"
  nav: "7px"
  preview: "8px"
  surface: "12px"
  dialog: "14px"
  circle: "50%"
spacing:
  compact: "8px"
  control: "12px"
  small: "16px"
  medium: "20px"
  grid: "22px"
  card: "24px"
  panel: "27px"
  section: "30px"
  page: "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "11px 19px"
  button-secondary:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.graphite-text}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "11px 19px"
  button-quiet:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-muted}"
    typography: "{typography.label}"
    padding: "9px 5px"
  field:
    backgroundColor: "{colors.graphite-raised}"
    textColor: "{colors.graphite-text}"
    rounded: "{rounded.control}"
    padding: "10px 12px"
  navigation-item:
    textColor: "{colors.graphite-muted}"
    rounded: "{rounded.nav}"
    padding: "13px 12px"
  drill-card:
    backgroundColor: "{colors.graphite-surface}"
    rounded: "{rounded.surface}"
  drill-preview:
    backgroundColor: "{colors.preview-blue}"
    height: "180px"
    width: "100%"
  game-toolbar:
    backgroundColor: "{colors.range-chrome}"
    textColor: "{colors.range-text}"
    height: "80px"
    padding: "12px 26px"
  movement-cue:
    backgroundColor: "#101b30d9"
    textColor: "{colors.movement}"
    rounded: "{rounded.cue}"
    padding: "7px 16px"
---

# Design System: Stratum

## Overview

**Creative North Star: "Matte Aim Room"**

The application uses a restrained graphite and coral shell around an abstract blue practice room. Controls are flat, compact and legible. The room carries the spatial character: matte architecture, smooth luminous spheres and thin cyan strips, with the interface receding around the target.

Light mode changes the application shell to cool off-white surfaces. The range retains its blue environment in either theme. Existing Inter Variable provides all typography; illustrations are exact inline SVG geometry, and the room is Three.js geometry. This implementation introduces no shipping raster artwork or new typeface.

This document records the implementation in `dist/style.css`, `dist/app.js`, `dist/core.js` and `src/fps-engine.js`, with the current desktop and mobile shell/brief captures as supporting evidence. There is no approved image comp. The available browser reports disabled GPU rendering, so the 3D material and bloom descriptions are source-derived and do not certify their rendered GPU appearance.

**Key Characteristics:**

- Graphite or cool off-white surfaces with a configurable coral action accent.
- Matte blue room, thin cyan light strips and smooth colored target spheres.
- Flat bordered controls, modest corners and short functional copy.
- Code-native previews and immediate spatial hit feedback without camera kick.

## Colors

Warm action color belongs to the shell; cool luminous color identifies targets and the room.

### Primary

- **Coral Action** (`primary`): default fill for Start, Enter drill, retry and next actions. Users can change the shell accent. The application derives readable accent text and action ink from the selected accent and theme; `accent-text-fallback` records the stylesheet fallback before that runtime calculation.

### Secondary

- **Precision Cyan**, **Switching Lavender**, **Tracking Mint** and **Movement Amber** (`precision`, `switching`, `tracking`, `movement`): the same four identities appear in geometric previews, history marks and world spheres. The movement cue uses amber before the player settles and mint when ready.
- **Strip Cyan** (`range-strip`): narrow light planes in the room. It is an environmental light accent, not another shell action color.

### Neutral

- **Graphite** (`graphite-bg`, `graphite-side`, `graphite-surface`, `graphite-raised`): page, navigation, cards and raised controls. **Graphite Line** divides these planes; **Graphite Text** and **Graphite Muted** distinguish the reading hierarchy.
- **Cool Off-white** (`light-bg`, `light-surface`, `light-raised`, `light-line`, `light-text`, `light-muted`): matching shell roles in light mode. Sidebar and cards share the white surface.
- **Range Blue** (`range-bg`, `range-chrome`, `range-line`, `preview-blue`): the full viewport backdrop, HUD bars, divisions and SVG preview field. **Range Text** and **Range Muted** remain cool and bright against it.
- **Matte Architecture** (`range-wall`, `range-ceiling`, `range-structure`): rough room surfaces and linear structural divisions. Inactive switching orbs use the desaturated `inactive-orb` tone.
- **Crosshair Ice** (`crosshair`): the default crosshair color, independently customizable. **Error Rose** and **Error Brick** (`error-dark`, `error-light`) supply theme-specific form errors.

**The Theme Boundary Rule.** Theme and accent customization recolor the application controls; preserve the fixed blue range and the four drill identities.

## Typography

**Display and Body Font:** Inter Variable, with Arial and sans-serif fallbacks. The existing local font supports weights from 100 to 900; no decorative or monospace family is used.

**Character:** Slightly tightened headings and moderate weights keep the shell quiet. Tabular numerals stabilize scores, times and result values. Most guidance is a single sentence; scoring details use disclosure.

### Hierarchy

- **Display** (`display`): the centered result score. It reduces to 80px on mobile and 64px in short landscape viewports.
- **Headline** (`headline`): page titles; reduces to 28px at the mobile breakpoint and 27px for the smallest training heading.
- **Brief headline** (`brief-headline`): drill introduction; becomes 31px on medium screens, 32px on mobile and 30px on the narrowest screens.
- **Title** (`title`): card and panel headings. Card titles become 16px in the two-column mobile grid, returning to 19px when cards stack.
- **Body** (`body`): global reading size. Card summaries use 13px; the brief uses 16px with a 1.65 line height. Disclosure copy stays within roughly 70 characters per line; method notes within 75.
- **Label** (`label`): context, settings labels and supporting values. Uppercase is confined to the small HUD metric labels (`hud-label`), above tabular values (`hud-value`).

**The Short Instruction Rule.** Keep the prominent instruction to the physical action; place scoring explanations behind the existing disclosure.

## Layout

Desktop uses a fixed left navigation rail (210px), a top bar (76px) and a centered content region (maximum width 1240px, 40px padding). The drill grid has two equal columns with a 22px gap. Preview, title, instruction, measurement and action form a consistent vertical card hierarchy. Settings use the same two-column rhythm; progress and leaderboard use full-width panels.

At 1000px and below, the rail narrows to 175px, content padding to 30px and grid gap to 18px. At 720px and below, navigation becomes a fixed bottom bar (70px), the top bar becomes 64px and content padding becomes 28px 22px. Settings stack at this point. Training cards remain in two columns until 420px, where they stack. Large screens at 1500px and above increase preview height to 210px.

The brief is a centered two-column composition (maximum width 1200px) with a geometric preview beside the instruction. It stacks below 720px. Short landscape screens, at most 520px tall, use a compact two-column brief and shorter HUD bars. The gameplay viewport uses a fixed full-screen root, top metrics, a flexible canvas arena and a small footer. Mobile metrics occupy a second toolbar row; touch controls sit over the lower arena.

Spacing uses the observed compact-to-page steps in the frontmatter rather than a claimed uniform mathematical scale. Preserve native safe-area padding on bottom navigation.

## Elevation & Depth

The shell uses tonal layering and thin borders rather than card shadows. Only the transient toast has a shadow (`0 10px 30px #0003`). A dark translucent dialog backdrop separates a modal from its context. The room derives depth from perspective, restrained fog and lighting, with no photographic textures.

The Three.js room uses matte wall and ceiling materials (roughness 1), a world-space measuring grid and narrow light planes. Targets use smooth emissive sphere materials (roughness .32, metalness .05, active emissive intensity .7). Bloom strength is .32 normally and .12 with reduced motion and glow; threshold is 1 and radius .5. A hit ring expands and fades over .18 seconds; reduced mode omits the ring. The camera does not animate in response to a shot. These values describe the source implementation, subject to the GPU limitation recorded above.

**The Flat Shell Rule.** Keep persistent cards and controls flat; reserve glow for targets and room light strips.

## Shapes

Controls have gently rounded corners (`control`); navigation is slightly softer (`nav`). Cards, panels and the brief visual use the larger `surface` corner, and dialogs use `dialog`. One-pixel borders carry structure. Cards clip their geometric preview to the outer silhouette. Circular avatars, target spheres, joystick and Fire control are the recurring round forms; the movement cue is a small rounded rectangle.

The preview vocabulary is circles, restrained path lines and a thin rectangular frame. It is inline SVG, not a raster approximation of the 3D room. Room architecture uses planes and linear divisions; no humanoid, gun or realistic-material silhouette belongs to this world.

## Components

### Buttons

Compact and direct. Primary buttons use the configurable accent with calculated ink; secondary buttons use raised surfaces and a one-pixel line. Standard actions have a minimum height of 44px and the frontmatter padding. Quiet actions remove the fill and use muted text. Hover raises button brightness to 1.08; quiet text becomes the primary text color. Focus uses a two-pixel visible accent outline with a four-pixel offset. Disabled buttons use .45 opacity. State transitions take .15 seconds and are removed by reduced mode.

### Cards / Containers

Drill cards use a bordered surface with a clipped blue preview, 24px copy padding, a title and level row, a single instruction and a measurement/action footer. Panels use 27px padding. Cards do not lift on hover; hovering their action gently changes the preview background. Measurement remains explicit when absent rather than filling the card with invented progress.

### Inputs / Fields

Text inputs and selects use raised fill, a one-pixel line, control corners, 10px 12px padding and a minimum height of 44px. Labels use muted text. Range, color and checkbox controls retain native operation and the accent color. Focus follows the common outline. Form errors use the theme-specific error colors; error text is also announced where implemented. Color and crosshair settings are independent controls.

### Navigation

Four destinations use simple inline stroke icons and plain labels. Desktop links have muted default text, a raised hover/active surface and an accent active icon. Mobile links become vertically arranged icon/label items with an accent active state; the background stays flat. The current page is also marked semantically. Profile context stays at the foot of the desktop rail.

### Drill preview

Precision uses small distributed circles. Switching connects three larger acquisition points and dims inactive points. Tracking uses a curved pursuit path and one larger circle. Movement uses a horizontal travel indicator and two orb positions. Keep these as exact code-native geometry in the shared drill colors. They identify the physical exercise without adding prose or decorative imagery.

### Range HUD and feedback

Time, score and accuracy or on-target share a compact centered metric row. Pause and Exit remain explicit. A center crosshair carries aim; no weapon viewmodel occupies the lower viewport. Movement readiness uses the small amber-to-mint cue. Touch shows a circular Fire control, plus a left joystick only for Move & shoot. The overlay handles preparing, countdown, pause and graphics failure. Loading/countdown loses readiness when focus is interrupted and requires the explicit restart action before play.

### Result

A large score, three short measurements and next/retry/back actions sit on the same fixed blue backdrop. Save status is a short live message. Preserve this sparse composition rather than adding a narrative report.

## Do's and Don'ts

### Do:

- **Do** retain the graphite/coral shell and its cool light-mode counterpart.
- **Do** preserve the four drill colors across previews, histories and 3D targets.
- **Do** keep the room matte blue, its light strips thin and target glow restrained.
- **Do** keep controls visibly focusable and honor the reduced motion and glow setting.
- **Do** keep previews code-native and use the existing Inter Variable font.
- **Do** distinguish source-derived 3D styling from verified GPU appearance.

### Don't:

- **Don't** add a weapon viewmodel, recoil camera kick, realistic materials or humanoid targets.
- **Don't** introduce more drill categories, decision quizzes or tactical content into the four-drill interface.
- **Don't** add marketing slogans, emojis or long explanations to primary flows.
- **Don't** replace flat shell surfaces with decorative glow or heavy shadows, or turn code-native previews into raster approximations.
- **Don't** let light mode erase the blue range or let shell accent changes recolor drill identities.
