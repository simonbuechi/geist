# Design System & Style Guide: Körper Geist Seele (KGS)

This document specifies the design philosophy, color palettes, typography, iconography, component anatomy, and sketch physics for the **Körper Geist Seele (KGS)** application — crafted in a **light, elegant hand-drawn pencil sketchbook aesthetic with warm earthy colors and dynamic Rough.js pencil hatching**.

---

## 1. Design Philosophy

KGS provides a **mindful, tactile journaling atmosphere** for weekly alignment, personal reflection, and deliberate growth. The interface rejects cold, sterile digital surfaces in favor of warm, human artisanal craft:

- **Light & Elegant Pencil Craft**: Delicate 1px / 1.2px graphite pencil lines (`#7A6A5E` / `#6E5F54` with 20–30% transparency) replace harsh black borders. Subtle soft-sepia offset shadows (`rgba(74, 62, 54, 0.22)`) provide depth without visual clutter or darkness.
- **Sketchy Background Color Shading (Rough.js Engine)**: Color fills on cards, headers, sticky notes, and notification banners are rendered as dynamic, hand-sketched **pencil hachure & cross-hatch shading** using `rough.js`.
- **Warm Earthy Harmonies**: Warm beige and light brown palette — warm parchment canvas (`#F5F2EB` radial gradient), biscuit card paper (`#FDFBF7`), soft oatmeal washes (`#FAF5ED`), warm sand (`#EAE0D2`), and light brown coffee accents (`#5C4F45`).
- **Edgy Hand-Drawn Contour**: Cards, buttons, and boxes use clean, edgy rectangular hand-drawn pencil borders with crisp 90° intersections and no round corners.
- **Dual Diurnal Paper Modes**:
  - **Light Mode**: Warm beige radial canvas (`#F5F2EB` / `#FAF8F3` to `#EDE7DC`), crisp paper cards (`#FDFBF7`), with warm brownish-grey pencil outlines (`#7A6A5E/25`) and deep warm sepia-graphite text (`#4A3E36`).
  - **Dark Mode**: Warm coffee sketchbook (`#1C1815`), dark warm roasted cards (`#25201C`), with chalk ivory strokes (`#EDE5DD/25`).

---

## 2. Warm Tinted Backgrounds & Edgy Box Borders

Following the evolution of the sketchbook design, background areas use **warm paper-tinted watercolor/pigment washes** in warm beige and light brown tones, with **Rough.js edgy hand-sketched box borders**:

### 2.1 Background Palette & Wash Values

| Component / Area | Light Mode Wash | Dark Mode Wash | Border Divider / Accent |
| :--- | :--- | :--- | :--- |
| **Canvas Body** | `#F4EFE6` warm art paper with soft, uneven `rough.js` cross-hatch (`hachureGap: 18`, `roughness: 2.3`, `bowing: 1.3`, `opacity: 0.13`) | `#1C1815` dark paper with chalk ivory cross-hatch (`opacity: 0.09`) | Edge-to-edge textured hand-drawn paper canvas |
| **Körper, Geist, Seele Areas** | Transparent column container (`bg-transparent`, no card cross-hatch) | Transparent column container (`bg-transparent`, no card cross-hatch) | Body background shines through; cards float on the surface |
| **Category Header Cards** | Clean paper background (`#FDFBF7`) with hand-sketched RoughBorder | Clean dark paper (`#28221D`) with RoughBorder | `shadow-pencil-sm` tactile paper card |
| **Inline Add Note Form** | Soft oatmeal paper with warm amber cross-hatch (`#D4A759`, `-30°`, `gap: 6.5px`) | Dark oatmeal paper with amber cross-hatch | Hand-drawn dashed pencil border |
| **Review Modal Header** | Hand-drawn warm biscuit cross-hatch (`#8A5034`, `-41°`) | `#D49B7A` cross-hatch | `border-b border-[#7A6A5E]/20` + hand-drawn divider line |
| **Unreviewed Banner** | Amber parchment cross-hatch (`#D4A759`, `-41°`, `gap: 9px`) | Dark amber parchment cross-hatch | Hand-drawn RoughBorder |
| **Reviewed Banner** | Sage green cross-hatch (`#4D7A4A`, `-41°`, `gap: 9px`) | Dark sage cross-hatch | Hand-drawn RoughBorder |
| **Primary Action Button** | Rounded pill (`rounded-full`) with tactile cross-hatch (`#D7195F` / `#4D7A4A`, `gap: 3.8px`) | Rounded pill with tactile cross-hatch | Borderless (`border-0`), defined purely by hand-drawn rough.js fill & shadow |
| **Icon Buttons** | Circular (`rounded-full`) with rough.js **zigzag fill** (`fillStyle: 'zigzag'`, `fillWeight: 1.8`, `gap: 2.4px`, `opacity: 0.55`) | Circular with ivory chalk zigzag fill | No shadow, no border, no background color — defined purely by rough.js zigzag |
| **Header Bar** | Borderless and transparent (`bg-transparent`) without background filling | Borderless and transparent (`bg-transparent`) | Canvas background flows seamlessly under the header |

---

## 3. Color Palette

### 3.1 Primary Brand & Warm Canvas Colors

| Token / Usage | Hex Code | Tailwind / Class | Purpose |
| :--- | :--- | :--- | :--- |
| **Body Canvas Radial** | `#F4EFE6` (radial + SVG noise overlay) | `body` | Tactile textured sketchbook paper background |
| **Paper Card Surface** | `#FDFBF7` | `bg-[#FDFBF7]` | Main card and modal background |
| **Warm Sepia-Graphite (Light)** | `#4A3E36` | `text-[#4A3E36]` | Primary typography (brownish-greyish instead of black) |
| **Muted Brownish-Grey** | `#7D6E63` | `text-[#7D6E63]` | Secondary descriptions, timestamps, subtle labels |
| **Warm Pencil Border** | `#7A6A5E` | `border-[#7A6A5E]/25` | Soft brownish-grey borders |
| **RoughBorder Stroke** | `#6E5F54` | stroke `#6E5F54` | Hand-drawn SVG card and modal outlines |
| **Brand Primary (Vivid Berry)** | `#D7195F` | `bg-[#D7195F]` | Primary brand color, focus rings, active accents |
| **Primary Button Gradient** | `#9123A6` → `#D7195F` | `bg-gradient-to-r from-[#9123A6] to-[#D7195F]` | Primary action buttons (Review, Save, Install) |
| **Chalk Ivory (Dark)** | `#EDE5DD` | `dark:text-[#EDE5DD]` | Primary typography in dark mode |

### 3.2 Unified Dimension Palette (Körper, Geist, Seele)

All three life dimensions share the warm beige/light brown aesthetic with prominent enlarged icons and distinctive colored badges:

| Dimension | Accent Color | Rough.js Color | Card Border Tint | Badge & Icon Box | Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Körper** (Body) | Warm Bronze Brown (`#7A583A`) | `#7A6A5E` | `border-[#7A6A5E]/25` | `#EAE0D2` / `#362C24` | Physical vitality, embodiment, posture, movement |
| **Geist** (Mind) | Golden Ochre (`#8C6328`) | `#7A6A5E` | `border-[#7A6A5E]/25` | `#EAE0D2` / `#362C24` | Deliberate intellect, focus, reading, clarity |
| **Seele** (Soul) | Deep Sienna Brown (`#854D3D`) | `#7A6A5E` | `border-[#7A6A5E]/25` | `#EAE0D2` / `#362C24` | Inner stillness, presence, heartfulness, gratitude |

### 3.3 Semantic Evaluation Statuses (Pencil Stamp Seals)

| Status | Meaning | Text Color | Light Tone & Border | Dark Tone & Border |
| :--- | :--- | :--- | :--- | :--- |
| **Erreicht** (`good`) | Goal achieved | `#2F612C` (Warm Olive) | `bg-[#EEF5ED] border-[#7CA379]/60` | `bg-[#203322] border-[#537A50]/60` |
| **Teilweise** (`partly`) | In progress / partial | `#8C5212` (Golden Ochre) | `bg-[#FDF7EA] border-[#D4A759]/60` | `bg-[#342714] border-[#7A5B22]/60` |
| **Nicht erreicht** (`poor`) | Postponed / unmet | `#9E352B` (Terracotta Coral) | `bg-[#FDF0EE] border-[#DFA098]/60` | `bg-[#361914] border-[#7A3329]/60` |
| **Offen** (`pending`) | Active current week | `#8A796D` (Soft Graphite) | `bg-[#FAF6F0] border-[#574A40]/18` | `bg-[#2D2420] border-[#EDE5DD]/15` |

---

## 4. Typography

The typographic hierarchy pairs expressive, warm handwriting with a clean modern geometric sans-serif:

```javascript
fontFamily: {
  hand: ['"LiebeHeide"', '"Caveat"', '"Marck Script"', 'cursive'],
  serif: ['"Caveat"', 'Georgia', 'serif'],
  sans: ['"Nunito"', 'system-ui', 'sans-serif'],
}
```

1. **LiebeHeide (Signature Handwritten Font)**:
   - **File**: `src/assets/fonts/liebeheide-finelinerbold.otf` and `src/assets/fonts/liebeheide-finelinermedium.otf`
   - **Role**: Brand heading, category names, review titles, action buttons, handwritten reflections, and week numbers.
   - **Feel**: Exquisite, authentic hand-drawn fineliner handwriting with natural stroke variations, organic ligatures, and native German umlaut support (`ä, ö, ü, ß`). Gives the application an artisanal, personal sketchbook character.
2. **Nunito (Warm Humanist Sans-Serif)**:
   - **Role**: Goal descriptions, time indicators, form placeholders, badges, and status counts.
   - **Feel**: Soft, rounded stroke endings that mirror the organic warmth of pencil and ink on paper, while maintaining crystal-clear reading legibility at small sizes.

---

## 5. Hand-Drawn Physics, Rough.js & Shadows

### 5.1 Rough.js Architecture & Usage Across the Repo

Rough.js is used throughout the application to produce an authentic, hand-drawn sketchbook aesthetic without static raster assets or stiff CSS borders. It is integrated in three primary layers:

1. **[`RoughBorder.tsx`](file:///d:/dev/antigravity/geist/src/components/RoughBorder.tsx)**:
   - Dynamic, resolution-independent SVG border overlay mounted over cards, modals, buttons, badges, and icon pills.
   - Replaces hard CSS borders with hand-sketched single strokes (`rc.rectangle()` or `rc.ellipse()`) using a `ResizeObserver` for dynamic dimension tracking.
   - Uses `pointer-events-none` with `z-10` overlay so all click, hover, and tap interactions remain instantaneous.

2. **[`RoughBackground.tsx`](file:///d:/dev/antigravity/geist/src/components/RoughBackground.tsx)**:
   - Dynamic SVG pencil hatching and shading layer (`rc.rectangle()` with fill styles).
   - Generates authentic angled pencil hachures, cross-hatching, and subtle background textures for Category Card headers, Sticky Notes, and Modal covers.
   - Includes optional hand-drawn pencil bottom divider lines (`rc.line()`).

3. **[`RoughNotationHighlight.tsx`](file:///d:/dev/antigravity/geist/src/components/RoughNotationHighlight.tsx) & In-Repo Engine ([`src/lib/rough-notation/`](file:///d:/dev/antigravity/geist/src/lib/rough-notation/))**:
   - A lightweight, zero-dependency in-repo Rough Notation implementation built directly on `roughjs`.
   - Generates animated SVG highlighter marker paths behind words, brand titles, and active category names (`rc.generator()` and SVG stroke-dashoffset CSS keyframe animations).

---

### 5.2 Modifying the Intensity of Rough.js Effects

You can fine-tune the intensity, jitter, weight, and sketchiness of any effect using dedicated component props or engine defaults:

#### 1. Border & Stroke Sketchiness (`RoughBorder.tsx`)

Control individual borders by passing props directly to `<RoughBorder />`:

| Prop | Default | Description & Intensity Tuning |
| :--- | :--- | :--- |
| **`roughness`** | `1.5` | **Waviness / jitter**: Set lower (`0.3 – 0.8`) for clean architectural drafts; set higher (`2.0 – 3.5`) for loose, vibrating, sketchy strokes. |
| **`bowing`** | `1.2` | **Line curvature**: Set to `0` for crisp, straight drafting lines; set higher (`1.8 – 2.5`) for organic curves and bent edges. |
| **`width`** | `1.5` | **Stroke thickness**: Line weight in pixels (e.g. `0.9` for delicate button borders, `2.0+` for bold container lines). |
| **`opacity`** | `0.75` | **Alpha transparency**: Override to `0.3 – 0.5` for soft graphite pencil, or `0.8 – 1.0` for solid ink strokes. |
| **`color` / `darkColor`** | `#574A40` / `#EDE5DD` | Primary pencil tone for light and dark modes. |

*Example — Subtle, crisp architectural border:*
```tsx
<RoughBorder roughness={0.6} bowing={0} width={1.0} opacity={0.35} />
```

*Example — Loose, expressive sketch border:*
```tsx
<RoughBorder roughness={2.5} bowing={1.8} width={2.0} opacity={0.8} />
```

#### 2. Background Shading & Hatching (`RoughBackground.tsx`)

Control pencil fill density and texture by passing props to `<RoughBackground />`:

| Prop | Default | Description & Intensity Tuning |
| :--- | :--- | :--- |
| **`hachureGap`** | `3.5` | **Hatching density**: Spacing between lines in pixels. Decrease (`2.0 – 2.5`) for dense, saturated shading; increase (`8.0 – 14.0`) for airy, faint sketchbook hatching. |
| **`fillWeight`** | `1.1` | **Pencil lead thickness**: Thickness of individual hatch strokes. |
| **`roughness`** | `1.2` | **Hatch jitter**: How shaky or straight each individual stroke line is. |
| **`opacity`** | `0.25` | **Layer transparency**: Typically `0.06 – 0.15` for delicate card textures; `0.25 – 0.40` for prominent accent headers. |
| **`fillStyle`** | `'hachure'` | Pattern algorithm: `'hachure'`, `'zigzag'`, `'cross-hatch'`, `'dots'`, or `'dashed'`. |
| **`hachureAngle`** | `-41` | Directional angle of pencil lines in degrees. |

*Example — Soft, wide-spaced cross-hatching sticky note:*
```tsx
<RoughBackground fillStyle="cross-hatch" hachureGap={10} fillWeight={0.8} opacity={0.08} />
```

#### 3. Highlighter & Marker Annotations (`RoughNotationHighlight.tsx`)

Control the highlighter intensity on interactive text elements:

| Prop / Setting | Default | Description & Intensity Tuning |
| :--- | :--- | :--- |
| **`iterations`** | `2` | **Marker passes**: Set to `1` for a single, transparent highlighter swipe; set to `3+` for heavily inked marker emphasis. |
| **`strokeWidth`** | Auto (text-based) | Custom marker thickness in pixels. |
| **`color` / `darkColor`** | `rgba(215, 25, 95, 0.22)` | Adjust the RGBA alpha channel (`0.15` for gentle pastel, `0.40+` for bold neon ink). |
| **`animationDuration`** | `450` | Draw speed in milliseconds. |

*Global Engine Defaults*:
For global adjustments across all rough notation highlights in the app, inspect [`render.ts`](file:///d:/dev/antigravity/geist/src/lib/rough-notation/render.ts#L10-L31):
- `getOptions()` sets default highlight `roughness: 3` and `bowing: 1.2`. Adjusting these values modifies the baseline waviness for all highlights across the application.

---

### 5.3 Edgy Border CSS Utilities

```css
/* Edgy Hand-Drawn Pencil Borders (Crisp 90-degree corners) */
.sketch-border {
  border-radius: 0px;
}

.sketch-border-sm {
  border-radius: 0px;
}

.sketch-pill {
  border-radius: 0px;
}
```

### 5.4 Light & Elegant Pencil Drop Shadows

Unlike harsh, high-contrast comic book shadows, KGS uses delicate, warm graphite drop shadows that give cards an authentic notebook lift:

```css
/* Card Pencil Lift */
.shadow-pencil {
  box-shadow: 2.0px 2.5px 0px 0px rgba(87, 74, 64, 0.28);
}
.dark .shadow-pencil {
  box-shadow: 2.0px 2.5px 0px 0px rgba(237, 229, 221, 0.16);
}

/* Small Button / Badge Pencil Shadow */
.shadow-pencil-sm {
  box-shadow: 1.2px 1.5px 0px 0px rgba(87, 74, 64, 0.22);
}
.dark .shadow-pencil-sm {
  box-shadow: 1.2px 1.5px 0px 0px rgba(237, 229, 221, 0.12);
}

/* Mechanical Button Press */
.sketch-btn-press:active {
  transform: translate(1px, 1.5px);
  box-shadow: 0.5px 0.5px 0px 0px rgba(87, 74, 64, 0.25);
}
```

---

## 6. Iconography & Hand-Drawn Motifs

1. **Sacred Triquetra Logo ([`KgsLogo.tsx`](file:///d:/dev/antigravity/geist/src/components/KgsLogo.tsx))**:
   Hand-sketched interlocking arcs uniting Body, Mind, and Soul with warm terracotta, ochre, and rosewood pencil strokes inside an imperfect circular sketch ring.
2. **Dimension Pencil Vectors ([`CategoryIcon.tsx`](file:///d:/dev/antigravity/geist/src/components/CategoryIcon.tsx))**:
   - **Körper**: Postural meditative silhouette with spinal alignment guideline.
   - **Geist**: Thinking profile enclosing an illuminated insight spark.
   - **Seele**: Organic sketched heart with warm radiating inner glow strokes.
3. **Pencil Bullets ([`GoalItem.tsx`](file:///d:/dev/antigravity/geist/src/components/GoalItem.tsx))**:
   Delicate pencil dots (`w-1.5 h-1.5 rounded-full bg-[#C2593F]`) and hand-stamped status seals.

---

## 7. Component Layout & Aesthetics

### 7.1 Category Card ([`CategoryCard.tsx`](file:///d:/dev/antigravity/geist/src/components/CategoryCard.tsx))
- **Container**: Transparent (`bg-transparent`) without background fill or outer cross-hatch, allowing the textured body background to shine through between sections.
- **Header**: Dedicated clean card paper background (`bg-[#FDFBF7] dark:bg-[#28221D]`) with hand-sketched RoughBorder, dimension-specific vector icon, hand-written category title, and goal count badge.
- **Goal Items**: Individual clean paper cards with hand-sketched rough borders.
- **Inline Add Form**: Sketchbook sticky note with soft cross-hatching (`opacity: 0.14`, `hachureGap: 6.5px`), dashed pencil border, and smooth autofocus textarea.
- **Empty State**: Clean paper card with dashed border and circular rough.js zigzag icon.

### 7.2 Header & Week Navigation ([`Header.tsx`](file:///d:/dev/antigravity/geist/src/components/Header.tsx))
- Clean borderless, transparent header (`bg-transparent`) seamlessly blending into the canvas background without filling.
- Week navigation and actions blend directly with the textured background.
- Primary CTA ([`PrimaryActionButton.tsx`](file:///d:/dev/antigravity/geist/src/components/PrimaryActionButton.tsx)):
  - Borderless rounded pill with dynamic tactile rough.js cross-hatch shading (`#D7195F` unreviewed, `#4D7A4A` reviewed).
  - Clean and steady appearance without hover bracket animations.
  - Tactile active press response (`active:scale-95`).

### 7.3 Weekly Review Modal ([`ReviewModal.tsx`](file:///d:/dev/antigravity/geist/src/components/ReviewModal.tsx))
- Notebook cover styled with dynamic terracotta `RoughBackground` hachure (`opacity: 0.14`).
- Evaluation status radio buttons styled with delicate pastel tones and pencil stamp borders.
- Safe-area aware mobile sheet layout with thumb-accessible submit button.

### 7.4 Archival History View ([`HistoryView.tsx`](file:///d:/dev/antigravity/geist/src/components/HistoryView.tsx))
- Chronological journal entries styled as archival sketchbook pages with expandable dimension summaries and pencil status counters.

---

## 8. Summary of Design Tokens

```css
/* Borders */
--border-pencil-card:    255px 15px 225px 15px / 15px 225px 15px 255px;
--border-pencil-item:    120px 10px 110px 12px / 10px 115px 12px 110px;
--border-pencil-pill:    999px 980px 995px 985px / 985px 995px 982px 998px;

/* Shadows */
--shadow-pencil:         2.0px 2.5px 0px 0px rgba(74, 62, 54, 0.22);
--shadow-pencil-sm:      1.2px 1.5px 0px 0px rgba(74, 62, 54, 0.18);
--shadow-pencil-dark:    2.0px 2.5px 0px 0px rgba(237, 229, 221, 0.16);

/* Typography */
--font-hand:             'LiebeHeide', 'Caveat', 'Marck Script', cursive;
--font-sans:             'Nunito', system-ui, sans-serif;

/* Canvas & Ink */
--paper-canvas:          #F5F2EB (radial-gradient(#FAF8F3 0%, #EDE7DC 100%));
--paper-card:            #FDFBF7;
--paper-wash:            #FAF5ED;
--paper-warm-sand:       #EAE0D2;
--paper-dark:            #1C1815 (radial-gradient(#231D19 0%, #151210 100%));
--paper-card-dark:       #25201C;
--lead-graphite:         #4A3E36;
--lead-muted:            #7D6E63;
--lead-border:           rgba(122, 106, 94, 0.25);
--lead-stroke:           #6E5F54;
--lead-chalk:            #EDE5DD;
--cta-gradient:          linear-gradient(to right, #9123A6, #D7195F);
```
