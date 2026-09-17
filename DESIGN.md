# Design System & Style Guide: Körper Geist Seele (KGS)

This document specifies the design philosophy, color palettes, typography, iconography, component anatomy, and sketch physics for the **Körper Geist Seele (KGS)** application — crafted in a **light, elegant hand-drawn pencil sketchbook aesthetic with warm earthy colors and dynamic Rough.js pencil hatching**.

---

## 1. Design Philosophy

KGS provides a **mindful, tactile journaling atmosphere** for weekly alignment, personal reflection, and deliberate growth. The interface rejects cold, sterile digital surfaces in favor of warm, human artisanal craft:

- **Light & Elegant Pencil Craft**: Delicate 1px / 1.2px graphite pencil lines (`#574A40` with 25–40% transparency) replace heavy digital borders. Subtle soft-graphite offset shadows (`rgba(87, 74, 64, 0.28)`) provide depth without visual clutter or darkness.
- **Sketchy Background Color Shading (Rough.js Engine)**: Color fills on cards, headers, sticky notes, and notification banners are not flat solid rectangles; they are rendered as dynamic, hand-sketched **colored pencil hachure & cross-hatch shading** using `rough.js`.
- **Warm Earthy Harmonies**: Natural artist pigments — warm terracotta (`#C2593F`), golden ochre (`#C97A1E`), burnt sienna (`#A8432A`), warm olive sage (`#4D7A4A`), and vintage rosewood (`#B84D68`).
- **Edgy Hand-Drawn Contour**: Cards, buttons, and boxes use clean, edgy rectangular hand-drawn pencil borders with crisp 90° intersections and no round corners.
- **Dual Diurnal Paper Modes**:
  - **Light Mode**: Warm natural cream parchment (`#FAF6F0`), crisp paper cards (`#FFFEFB`), with warm charcoal pencil outlines (`#574A40/30`).
  - **Dark Mode**: Warm slate sketchbook (`#1C1917`), dark warm obsidian cards (`#241F1C`), with chalk ivory strokes (`#EDE5DD/25`).

---

## 2. Warm Tinted Backgrounds & Edgy Box Borders

Following the evolution of the sketchbook design, background areas use **warm paper-tinted watercolor/pigment washes** instead of busy hatching lines, with **Rough.js edgy hand-sketched box borders**:

### 2.1 Background Palette & Wash Values

| Component / Area | Light Mode Wash | Dark Mode Wash | Border Divider / Accent |
| :--- | :--- | :--- | :--- |
| **Körper (Body) Header** | `#FAF2F5` (Soft Berry Wash) | `#2A1C22` | `border-b border-[#D7195F]/20` |
| **Geist (Mind) Header** | `#FAF2F5` (Soft Berry Wash) | `#2A1C22` | `border-b border-[#D7195F]/20` |
| **Seele (Soul) Header** | `#FAF2F5` (Soft Berry Wash) | `#2A1C22` | `border-b border-[#D7195F]/20` |
| **Inline Add Note Form** | `#FDF7FA` (Paper Tint) | `#26171E` | Hand-drawn dashed border |
| **Review Modal Header** | `#FAF3EE` (Berry Parchment) | `#2B1D17` | `border-b border-[#D7195F]/20` |
| **Unreviewed Banner** | `#FFF9F0` (Amber Parchment) | `#2A231A` | `border border-[#D4A759]/50` |
| **Reviewed Banner** | `#FFFDF9` (Sage Tint) | `#202720` | `border border-[#4D7A4A]/35` |
| **Primary Action Button** | Gradient `#9123A6` to `#D7195F` | Gradient `#9123A6` to `#D7195F` | `shadow-pencil-sm` |
| **Dimension Card Box Border** | Hand-sketched via `rough.js` | Hand-sketched via `rough.js` | Edgy sharp pencil stroke contour |

---

## 3. Color Palette

### 3.1 Primary Brand Colors (Vivid Berry & Violet Gradient)

| Token / Usage | Hex Code | Tailwind / Class | Purpose |
| :--- | :--- | :--- | :--- |
| **Brand Primary (Vivid Berry)** | `#D7195F` | `bg-[#D7195F]` | Primary brand color, focus rings, active accents |
| **Primary Button Gradient** | `#9123A6` → `#D7195F` | `bg-gradient-to-r from-[#9123A6] to-[#D7195F]` | Primary action buttons (Review, Save, Install) |
| **Deep Violet Start** | `#9123A6` | `from-[#9123A6]` | Gradient start for primary buttons |
| **Warm Graphite Lead (Light)** | `#2D2621` | `text-[#2D2621]` | Primary typography in light mode |
| **Chalk Ivory (Dark)** | `#EDE5DD` | `dark:text-[#EDE5DD]` | Primary typography in dark mode |
| **Delicate Pencil Border** | `#574A40` | `border-[#574A40]/20` | Fine soft pencil contours |

### 3.2 Unified Dimension Palette (Körper, Geist, Seele)

All three life dimensions share the unified primary brand palette:

| Dimension | Accent Color | Rough.js Color | Card Border Tint | Badge & Icon Box | Meaning |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Körper** (Body) | Vivid Berry (`#D7195F`) | `#D7195F` | `border-[#D7195F]/35` | `#FAF0F4` / `#3E1C27` | Physical vitality, embodiment, posture, movement |
| **Geist** (Mind) | Vivid Berry (`#D7195F`) | `#D7195F` | `border-[#D7195F]/35` | `#FAF0F4` / `#3E1C27` | Deliberate intellect, focus, reading, clarity |
| **Seele** (Soul) | Vivid Berry (`#D7195F`) | `#D7195F` | `border-[#D7195F]/35` | `#FAF0F4` / `#3E1C27` | Inner stillness, presence, heartfulness, gratitude |

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

## 5. Hand-Drawn Physics, Borders & Shadows

### 5.1 Unified Rough.js Edgy Borders (`RoughBorder.tsx`)

To eliminate clashing digital CSS borders and achieve uniform artisanal craft across all UI components, all boxes, cards, and buttons use the dedicated [`RoughBorder.tsx`](file:///d:/dev/antigravity/geist/src/components/RoughBorder.tsx) SVG renderer:

- **Clean Single-Stroke Outline**: Digital CSS borders (`border`, `border-2`) are replaced by hand-sketched single strokes, eliminating awkward border doubling or clipping.
- **Edgy Rectangular Drafting**: Renders sharp 90-degree corners with straight sketch strokes (`bowing: 0`, `roughness: 0.8`) and natural architectural corner intersections.
- **Pencil Tone Harmony**: Renders warm graphite lead (`#574A40`) in light mode and chalk ivory (`#EDE5DD`) in dark mode, or dimension-matched color accents (terracotta, amber, rosewood).
- **Pointer-Transparent**: Uses `pointer-events-none` with `z-10` overlay so all click, hover, and tap interactions remain instantaneous.

### 5.2 Edgy Border CSS Utilities

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

### 5.2 Light & Elegant Pencil Drop Shadows

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
- **Container**: `paper-card shadow-pencil-sm border border-[#574A40]/25 dark:border-[#EDE5DD]/20`
- **Header**: Backed by dynamic `RoughBackground` colored pencil hachure at a dimension-specific angle (`-35°`, `42°`, `-40°`), fine 1px pencil border separator, and icon pill in white paper with `shadow-pencil-sm`.
- **Inline Add Form**: Sketchbook sticky note with soft cross-hatching (`opacity: 0.06`, `hachureGap: 12px`), dashed pencil border, and smooth autofocus textarea.
- **Empty State**: Airy dashed border (`border border-dashed border-[#574A40]/30`) with pencil plus icon encouraging new entries.

### 7.2 Header & Week Navigation ([`Header.tsx`](file:///d:/dev/antigravity/geist/src/components/Header.tsx))
- Fine pencil bottom border (`border-b border-[#574A40]/20 dark:border-[#EDE5DD]/15`).
- Week indicator card styled as a pressed paper label with `shadow-pencil-sm`.
- Primary CTA *"Rückblick & Planen"* in warm terracotta with gentle pencil shadow and hover micro-animations.

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
--shadow-pencil:         2.0px 2.5px 0px 0px rgba(87, 74, 64, 0.28);
--shadow-pencil-sm:      1.2px 1.5px 0px 0px rgba(87, 74, 64, 0.22);
--shadow-pencil-dark:    2.0px 2.5px 0px 0px rgba(237, 229, 221, 0.16);

/* Typography */
--font-hand:             'LiebeHeide', 'Caveat', 'Marck Script', cursive;
--font-sans:             'Plus Jakarta Sans', system-ui, sans-serif;

/* Canvas & Ink */
--paper-canvas:          #FAF6F0;
--paper-card:            #FFFEFB;
--paper-dark:            #1C1917;
--paper-card-dark:       #25201C;
--lead-graphite:         #2D2621;
--lead-border:           rgba(87, 74, 64, 0.30);
--lead-chalk:            #EDE5DD;
--ink-terracotta:        #C2593F;
```
