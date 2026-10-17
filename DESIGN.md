# Design System: Körper Geist Seele (KGS)

## 1. Visual Philosophy & Atmosphere

**Körper Geist Seele** is a mindful weekly alignment and personal reflection journal. Its visual language is rooted in **warm, human artisanal craft**—evoking the quiet calm of opening a cotton-paper notebook on a wooden desk with a set of natural colored pencils and a fineliner pen.

### Core Design Principles
1. **Clean Paper + Intentional Pencil Work**: The desk canvas (`#F3EDE2`) and notebook sheets (`#FCF9F4`) remain calm, breathable, and uncluttered (enhanced only by a whisper-soft organic paper grain). Hand-drawn `rough.js` strokes are reserved intentionally for sheet perimeters, ruled goal lines, header hachure washes, and tactile buttons.
2. **Tactile Notebook Sheets over Digital Boxes**: Instead of nested digital cards inside cards, each dimension (**Körper**, **Geist**, **Seele**) is presented as a single pinned notebook sheet with a playful strip of translucent washi tape at the top, a colored-pencil header band, and ruled journal lines for individual intentions.
3. **Earthy Botanical & Colored-Pencil Palette**: Each holistic dimension has its own natural pigment identity—**Terracotta** for *Körper*, **Sage** for *Geist*, and **Dusty Rose** for *Seele*—anchored by warm graphite ink (`#332B25`).
4. **Two-Font Typographic Restraint**: A single warm humanist sans-serif (`Plus Jakarta Sans`) handles all body text, goals, buttons, week navigation, and UI controls, while a fluid handwritten script (`Caveat`) is used **only selectively** on the main brand title, the three area headers (*Körper*, *Geist*, *Seele*), and personal reflection quotes.

---

## 2. Color Palette (Earthy Botanical & Colored Pencil)

### Paper & Desk Surfaces
| Token | Light Mode | Dark Mode | Purpose |
| :--- | :--- | :--- | :--- |
| **Desk Canvas (`paper.desk`)** | `#F3EDE2` | `#191614` | Main viewport background (warm cotton desk surface) |
| **Notebook Sheet (`paper.sheet`)** | `#FCF9F4` | `#221F1D` | Pinned category sheets, modals, and elevated journal surfaces |
| **Warm Wash (`paper.wash`)** | `#EAE2D3` | `#2A2623` | Segmented switchers, subtle badges, and secondary wells |

### Graphite Ink & Pencil Strokes
| Token | Light Mode | Dark Mode | Purpose |
| :--- | :--- | :--- | :--- |
| **Primary Ink (`ink.DEFAULT`)** | `#332B25` | `#EAE2D9` | Main headings, goal descriptions, and active controls |
| **Secondary Ink (`ink.muted`)** | `#5C524B` | `#C5B9AE` | Subtitles, reflections, and secondary actions |
| **Faint Pencil (`ink.faint`)** | `#7A6F66` | `#A3968B` | Date ranges, placeholders, and colophon metadata |
| **Graphite Rule (`#8C7E72`)** | `#8C7E72` | `#7A6F66` | Default `rough.js` perimeter strokes and ruled notebook dividers |

### Holistic Dimension Pigments
| Dimension | Primary Pencil (Light / Dark) | Header Wash (Light / Dark) | Emotional Character |
| :--- | :--- | :--- | :--- |
| **Körper (`body`)** | `#C46345` / `#E2876B` (Terracotta / Sienna) | `#FAF1ED` / `#2A201D` | Grounding, physical vitality, warmth |
| **Geist (`mind`)** | `#557659` / `#89B08E` (Sage & Olive) | `#F1F6F1` / `#1D261F` | Clarity, focus, calm intellectual space |
| **Seele (`soul`)** | `#9E5870` / `#D48BA3` (Dusty Rose & Plum) | `#F9F1F4` / `#281E23` | Warmth, emotional depth, inner connection |

### Semantic Review Accents
- **Erreicht (`good`)**: Botanical Sage (`#4E7A52` / `#89B08E`)
- **Teilweise (`partly`)**: Warm Ochre (`#B88028` / `#E2B467`)
- **Offen / Nicht erreicht (`poor`)**: Muted Terracotta Red (`#B84A39` / `#E2876B`)

---

## 3. Typography (Two-Font Playwrite System — SIL Open Font License)

1. **Primary Application Font (`font-sans` / `font-serif` — `Playwrite Deutschland Grundschrift` / `Playwrite DE Grund`)**
   - Loaded via Google Fonts (`wght@100..400`).
   - Modeled after the German *Grundschrift* (unjoined, print-style handwriting with soft exit strokes).
   - Used for all body text, weekly goal descriptions, week navigation, date ranges, buttons, badges, inputs, and settings.
2. **Selective Title & Accent Font (`font-hand` — `Playwrite Norge` / `Playwrite NO`)**
   - Loaded via Google Fonts (`wght@100..400`).
   - A flowing, expressive looped cursive script used **only selectively** on:
     - The brand title (*"Körper Geist Seele"*)
     - The three dimension sheet headers (*"Körper"*, *"Geist"*, *"Seele"*)
     - Personal reflection notes and quotes

---

## 4. Spatial Layout & Component Architecture

### 4.1 Centered Editorial Journal Masthead (`Header.tsx`)
- **Top Bar**: Displays the three botanical colored-pencil dots (Terracotta, Sage, Dusty Rose) beside the *Körper Geist Seele* title on the left, and the *Verlauf* (`History`) notebook tab + user profile `IconButton` on the right.
- **Centered Week Switcher**: Positions the active week (*"Woche X"*) and italic serif date range dead-center between circular hand-drawn `IconButton` arrows, balanced by the *"Woche abschließen"* (`PrimaryActionButton`) CTA on the right and grounded by a full-width `RoughDivider` pencil line.

### 4.2 3-Column Pinboard & Notebook Sheets (`CategoryCard.tsx`)
- On desktop (`md:grid-cols-3`), **Körper**, **Geist**, and **Seele** sit side-by-side like three paper sheets pinned to a desk.
- Each sheet features:
  - **Washi Tape Strip**: A translucent, slightly rotated strip at the top center of the sheet.
  - **Perimeter Sketch (`RoughBorder`)**: A double-pass hand-drawn pencil border (`roughness: 1.35`) with a soft paper drop shadow (`shadow-notebook`).
  - **Colored-Pencil Header Band (`RoughBackground`)**: A gentle diagonal hachure wash in the dimension's signature pigment (`#C46345`, `#557659`, or `#9E5870`) with a hand-drawn bottom rule (`drawBottomLine={true}`).
  - **Ruled Notebook Rows (`GoalItem.tsx` + `RoughDivider.tsx`)**: Goals sit directly on the clean `#FCF9F4` sheet without nested box borders, separated by organic horizontal pencil rules (`RoughDivider`).

### 4.3 Hand-Drawn `rough.js` Primitives
- **`RoughBorder.tsx`**: Renders an organic multi-stroke SVG rectangle around sheets, banners, and inputs.
- **`RoughBackground.tsx`**: Renders diagonal `hachure` or `cross-hatch` colored-pencil shading for category headers, active badges, and primary buttons.
- **`RoughDivider.tsx`**: Renders a single hand-sketched horizontal pencil line (`rc.line`) to create authentic ruled notebook rows.
- **`IconButton.tsx`**: Pure circular `rough.js` button (`rc.circle` with `fillStyle: 'zigzag'`) with zero CSS border, shadow, or solid background fill.
- **`PrimaryActionButton.tsx`**: Tactile terracotta (`#C46345`) or sage (`#4E7A52`) colored-pencil pill with cross-hatch shading and a sketched perimeter, free of distracting hover bracket animations.
