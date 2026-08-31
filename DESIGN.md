# Design System & Style Guide: Körper Geist Seele (KGS)

This document specifies the design principles, color palettes, typography, iconography, component anatomy, and layout patterns for the **Körper Geist Seele (KGS)** application.

---

## 1. Design Philosophy

KGS is designed to provide a **calm, focused, and mindful atmosphere** for weekly alignment and personal growth. The interface balances warmth and timeless editorial elegance with modern digital polish:

- **Unified Harmony**: Rather than dividing the three dimensions (Body, Mind, Soul) into competing colors, they share a cohesive primary palette symbolizing wholeness.
- **Atmospheric Clarity**: Ample whitespace, soft borders, and subtle glassmorphic blurs reduce visual clutter so users can focus on their intentions.
- **Tactile & Responsive**: High-touch ergonomics, interactive micro-animations (`active:scale-95`), and smooth state transitions give the PWA a native application feel.
- **Dual-Mode Harmony**: Meticulously crafted light and dark themes tailored to natural diurnal rhythms.

---

## 2. Color Palette

### 2.1 Primary Brand Colors

The signature visual identity uses a vibrant, uplifting purple-to-magenta gradient inspired by energy, introspection, and vitality:

| Token / Usage | Hex Code | Tailwind Equivalent / Usage | Preview / Description |
| :--- | :--- | :--- | :--- |
| **Brand Primary Start** | `#9123A6` | `brand-500` / `from-[#9123A6]` | Deep amethyst purple; main accent, focus rings, brand start |
| **Brand Primary End** | `#D7195F` | `to-[#D7195F]` | Vibrant magenta rose; CTA gradient end, secondary glow |
| **Primary Gradient** | `#9123A6` → `#D7195F` | `bg-gradient-to-r from-[#9123A6] to-[#D7195F]` | Main action buttons (e.g. "Rückblick & Planen", "Speichern") |
| **Hover Gradient** | `#7e1c91` → `#c21453` | `hover:from-[#7e1c91] hover:to-[#c21453]` | Button hover/active states |
| **Dark Mode Accent** | `#f472b6` / `#f8d2e8` | `text-[#f472b6]` / `dark:text-pink-300` | Light pink accents on dark surfaces |
| **Card Header Tint** | `#9123A6` (10%) / `#D7195F` (5%) | `from-[#9123A6]/10 via-[#D7195F]/5 to-transparent` | Subtle atmospheric tint in category headers |
| **Card Border Accent** | `#9123A6` (20%–30%) | `border-[#9123A6]/20 dark:border-[#9123A6]/30` | Refined card borders |

#### Full Brand Swatch Scale:
```css
--brand-50:  #fdf4f9;
--brand-100: #fbe8f3;
--brand-200: #f8d2e8;
--brand-300: #f1add4;
--brand-400: #e578b6;
--brand-500: #9123A6; /* Primary */
--brand-600: #7e1c91;
--brand-700: #681678;
--brand-800: #551362;
--brand-900: #380c41;
```

---

### 2.2 Surface & Neutral Canvas

| Element | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| **Page Canvas** | `bg-stone-50/50` (`#fafaf9`) | `bg-[#121614]` (Deep obsidian moss) |
| **Card Surface** | `bg-white` (`#ffffff`) | `bg-[#161c19]` (Subtle warm slate) |
| **Elevated Surfaces / Modals** | `bg-white` (`#ffffff`) | `bg-stone-900` (`#1c1917`) |
| **Frosted Glass (Header)** | `bg-stone-50/90` with `backdrop-blur-md` | `bg-[#121614]/90` with `backdrop-blur-md` |
| **Primary Text** | `text-stone-900` (`#1c1917`) | `text-stone-50` (`#fafaf9`) |
| **Secondary Text** | `text-stone-600` (`#57534e`) | `text-stone-300` (`#d6d3d1`) |
| **Muted Text / Metadata** | `text-stone-400` / `stone-500` | `text-stone-400` / `stone-500` |
| **Borders & Dividers** | `border-stone-200/80` (`#e7e5e4`) | `border-stone-800/80` (`#292524`) |
| **Interactive Well / Inset** | `bg-stone-100` (`#f5f5f4`) | `bg-stone-800` (`#292524`) |

---

### 2.3 Semantic Evaluation Colors (Goal Review Statuses)

Used during weekly reviews and in status chips to reflect self-evaluations:

| Status | Meaning | Text / Icon Color | Background (Light) | Background (Dark) |
| :--- | :--- | :--- | :--- | :--- |
| **Gut erreicht** (`good`) | Goal fully accomplished | `text-emerald-600 dark:text-emerald-400` | `bg-emerald-50 border-emerald-200` | `bg-emerald-950/60 border-emerald-800/60` |
| **Teilweise** (`partly`) | In progress / Partially met | `text-amber-600 dark:text-amber-400` | `bg-amber-50 border-amber-200` | `bg-amber-950/60 border-amber-800/60` |
| **Kaum / Nicht** (`poor`) | Postponed or unachieved | `text-rose-600 dark:text-rose-400` | `bg-rose-50 border-rose-200` | `bg-rose-950/60 border-rose-800/60` |
| **Offen** (`pending`) | Active during current week | `text-stone-500 dark:text-stone-400` | `bg-stone-100 border-stone-200` | `bg-stone-800 border-stone-700` |

---

## 3. Typography

The typographic hierarchy pairs an elegant serif for key headers with a crisp, geometric sans-serif for UI clarity.

### 3.1 Font Families

```javascript
fontFamily: {
  serif: ['"Playfair Display"', 'Georgia', 'serif'],
  sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
}
```

1. **Playfair Display (Serif)**:
   - **Role**: Headings, modal titles, dimension titles, week indicators, and celebratory copy.
   - **Weights**: `font-semibold` (600), `font-bold` (700).
   - **Character**: Expressive, humanistic, and dignified.

2. **Plus Jakarta Sans (Sans-Serif)**:
   - **Role**: Body text, goal descriptions, badges, button labels, dates, navigation, and settings forms.
   - **Weights**: `font-normal` (400), `font-medium` (500), `font-semibold` (600), `font-bold` (700).
   - **Character**: Clean geometry, high x-height, and exceptional readability on screens.

### 3.2 Typographic Hierarchy

| Role | Class | Font & Weight | Size / Line Height | Usage Example |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `text-xl sm:text-2xl` | Playfair Display, Bold | 24px–28px, tight | App Title, Modal Titles |
| **Section Heading** | `text-lg sm:text-xl` | Playfair Display, Bold | 18px–20px, tight | Category Titles (Körper, Geist, Seele) |
| **Subsection Heading** | `text-sm sm:text-base` | Plus Jakarta Sans, SemiBold | 14px–16px, snug | Week List Item, Group Titles |
| **Body / Goal Item** | `text-sm font-normal` | Plus Jakarta Sans, Regular | 14px, relaxed (1.5) | Goal descriptions, modal instructions |
| **Button / Navigation** | `text-xs sm:text-sm` | Plus Jakarta Sans, Medium/SemiBold | 12px–14px | Actions, Nav links, Date badges |
| **Badges & Counters** | `text-xs font-medium` | Plus Jakarta Sans, Medium | 12px | Goal counts (e.g. "3 Ziele") |
| **Micro-Copy / Dates** | `text-2xs sm:text-xs` | Plus Jakarta Sans, Medium | 10px–12px | Week date ranges, timestamps, input hints |

---

## 4. Iconography

### 4.1 Dimension Icons

Each of the three core life dimensions is represented by an identifiable icon, styled in the unified primary brand color (`text-[#9123A6] dark:text-[#f472b6]`):

| Dimension | Icon Description | Source / Implementation | Meaning |
| :--- | :--- | :--- | :--- |
| **Körper** (Body) | Biceps / Arm Muscle | Custom `ArmBicepsIcon` with SVG/PNG alpha mask (`maskImage: url(/arm_flaticon.png)`) | Physical vitality, movement, nutrition, rest |
| **Geist** (Mind) | Brain outline | Lucide `Brain` (stroke width `2.4`) | Intellect, learning, clarity, deliberate focus |
| **Seele** (Soul) | Solid heart | Lucide `Heart` (filled with `currentColor`) | Inner peace, mindfulness, gratitude, connection |

### 4.2 Application Logo / Emblem

- **File**: `/logo.webp` / `/logo.svg` / `/favicon.svg`
- **Symbol**: Sacred triquetra / 3-lobe knot uniting Body, Mind, and Soul in continuous harmony.
- **Palette**: Multi-stop gradient along the primary spectrum with subtle luminosity.

### 4.3 UI & Action Icons

All interface icons are sourced from `lucide-react` with standard `16px`–`20px` bounds and `1.75`–`2` stroke width:
- **Navigation**: `Calendar`, `ChevronLeft`, `ChevronRight`, `ArrowLeft`
- **Actions**: `Plus` (Add goal), `Check` (Save/Complete), `X` (Cancel/Close), `Edit3` (Edit description), `Trash2` (Delete goal), `Sparkles` (Weekly review CTA)
- **Settings & Controls**: `Settings` (Preferences), `Sun` (Light mode), `Moon` (Dark mode), `Globe` (Language), `Bell` (Push alerts), `Smartphone` (Device push), `Mail` (Email reminder)
- **Feedback**: `CheckCircle2` (Good), `MinusCircle` (Partly), `XCircle` (Poor)

---

## 5. Component Anatomy & Layout

### 5.1 Category Card Anatomy

```
┌─────────────────────────────────────────────────────────────┐
│ ┌───┐                                                       │
│ │ 🫀 │  Seele   [ 3 Ziele ]                           [ + ] │  ← Gradient Header
│ └───┘                                                       │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • 10 Min Meditation jeden Morgen                      ✎ │ │  ← Goal Item
│ └─────────────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ • Dankbarkeitstagebuch führen                         ✎ │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  + Ziel hinzufügen                                2/3 Erreicht  ← Footer Bar
└─────────────────────────────────────────────────────────────┘
```

1. **Card Container**:
   - `rounded-3xl border border-[#9123A6]/20 dark:border-[#9123A6]/30`
   - `bg-white dark:bg-[#161c19] shadow-sm hover:border-[#9123A6]/50`
2. **Header Bar**:
   - Background: `bg-gradient-to-b from-[#9123A6]/10 via-[#D7195F]/5 to-transparent`
   - Icon Pill: `p-2 sm:p-2.5 rounded-2xl bg-white dark:bg-stone-800 shadow-2xs`
   - Title: `text-lg sm:text-xl font-serif font-bold text-stone-900 dark:text-stone-50`
   - Badge: `bg-[#9123A6]/10 dark:bg-[#9123A6]/25 text-[#9123A6] dark:text-pink-300 font-medium`
3. **Goal Items**:
   - `rounded-2xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80`
   - Action controls appear on hover/tap with smooth opacity transitions.
4. **Footer**:
   - Quick-add link button with counter badge (`goodCount / totalGoals`).

---

### 5.2 Header & Navigation Bar

- **Sticky Frosted Header**: `sticky top-0 z-30 backdrop-blur-md bg-stone-50/90 dark:bg-[#121614]/90 border-b`
- **Week Navigator Component**:
  - Centered navigation pill: `Woche {number} • {startDate} – {endDate}`
  - Prev/Next arrows: `p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-200/70`
  - "Zur aktuellen Woche" jump button when viewing historical or future weeks.
- **Top Actions**:
  - `[ Verlauf ]` (History toggle)
  - `[ User / Settings ]` (Avatar with live online/offline indicator dot)

---

### 5.3 Modals & Bottom Sheets

The application uses an adaptive sheet pattern:
- **Desktop (`sm:` and above)**: Centered floating card (`max-w-md` or `max-w-2xl`, `rounded-3xl`, `shadow-2xl`).
- **Mobile Phones**: Bottom sheet docked to bottom edge (`rounded-t-[28px]`, max height `92vh`), thumb drag handle, and safe-area padding (`pb-safe`).

---

## 6. Mobile Touch & PWA Ergonomics

1. **44px Minimum Touch Targets**: Interactive controls maintain touch-friendly padding and min-heights.
2. **Safe-Area Insets**:
   - Top: `pt-safe` (`env(safe-area-inset-top)`)
   - Bottom: `pb-safe` (`env(safe-area-inset-bottom)`)
3. **Bottom Sticky Action Bar**:
   - On phone screens, a prominent full-width CTA button (*"Rückblick & Planen"*) stays pinned to the bottom thumb zone with backdrop blur.
4. **Input Zoom Prevention**:
   - Mobile inputs and textareas use a base `16px` font size to prevent iOS Safari auto-zoom behavior on focus.
5. **Active Scale Micro-Interaction**:
   - Tapping buttons triggers `active:scale-95` or `active:scale-98` for tactile spring feedback.

---

## 7. Design Tokens Quick Reference

```css
/* Radius */
--radius-card:    1.5rem;   /* 24px / 28px (rounded-3xl) */
--radius-control: 0.75rem;  /* 12px (rounded-xl) */
--radius-pill:    9999px;   /* rounded-full */

/* Shadows */
--shadow-card:   0 1px 3px 0 rgb(0 0 0 / 0.05);
--shadow-button: 0 4px 14px 0 rgba(145, 35, 166, 0.25);
--shadow-modal:  0 25px 50px -12px rgb(0 0 0 / 0.25);

/* Transitions */
--ease-standard: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 150ms;
--duration-base: 250ms;
```
