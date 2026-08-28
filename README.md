# Körper Geist Seele (KGS) — Progressive Web App

**KGS** is an elegant, responsive Progressive Web App designed for holistic weekly goal setting and reflection across three core dimensions of human life:
* **Körper (Body)**: Health, movement, nutrition, and rest.
* **Geist (Mind)**: Focus, learning, intellect, and clarity.
* **Seele (Soul)**: Inner peace, mindfulness, connection, and joy.

---

## Features

- 🌿 **Current Week Focus**: Monday–Sunday ISO calendar week dashboard showing all active goals organized under Body, Mind, and Soul.
- 🎯 **Multiple Goals per Category**: Add, edit, or remove goals with single-description focus.
- 🌟 **Dedicated "Review & Plan" Workflow** (*Rückblick & Planen*):
  - Rate each goal: **🟢 Gut erreicht (Good)**, **🟡 Teilweise (Partly)**, **🔴 Kaum/Nicht erreicht (Poor)**.
  - Add reflection comments to goals and optional weekly general conclusions.
  - Option to carry over uncompleted or ongoing goals into the next week.
  - Celebratory reflection confetti.
- 📜 **History View**: Browse previous weeks chronologically, view historical ratings, goal notes, and harmony metrics.
- ☯ **Holistic Harmony Score**: Dynamic balance index that encourages balance across all three dimensions.
- 🌐 **Bilingual (DE / EN)**: Default German interface with instant toggle to English (*KGS* / *BMS*).
- 🌓 **Dark & Light Mode**: Serene aesthetic with mindful color palettes and **Playfair Display** typography.
- ☁️ **Dual Persistence (Firebase + Local/Offline)**:
  - Works 100% offline out-of-the-box using browser LocalStorage / IndexedDB.
  - Supports Google Authentication & real-time Cloud Firestore sync.
  - Includes JSON data export and import for seamless backups.
- 📱 **Progressive Web App (PWA)**: Installable on iOS, Android, macOS, and Windows with offline caching.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## Firebase Configuration (Optional)

KGS is fully functional immediately without any setup in local Guest Mode. To enable Google Sign-In and Cloud Sync:

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Fill in your Firebase project web credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```
3. Alternatively, click the profile icon in the top right of the running app and enter your Firebase web configuration credentials directly in the settings modal.

---

## Codebase Structure

- `src/types/index.ts` — Core domain types (`Category`, `Goal`, `GoalStatus`, `WeekPlan`, `UserProfile`). Code strictly uses English naming (`body`, `mind`, `soul`).
- `src/i18n/translations.ts` — German (default) and English translations.
- `src/utils/dateUtils.ts` — Monday–Sunday ISO week calculations and formatting.
- `src/config/firebase.ts` — Firebase Auth & Firestore client configuration.
- `src/context/`
  - `GoalsContext.tsx` — Weekly goals state management, CRUD, review evaluation, rollover, and cloud sync.
  - `AuthContext.tsx` — Google Authentication and user profile management.
  - `ThemeContext.tsx` — Dark/Light mode theme state.
  - `LanguageContext.tsx` — German/English localization state.
- `src/components/`
  - `Header.tsx` — Brand, week switcher, history button, language toggle, theme toggle, and review trigger.
  - `CategoryCard.tsx` — Body, Mind, Soul goal cards with quick-add forms.
  - `GoalItem.tsx` — Goal display, quick status evaluation (green/yellow/red), edit, delete, and note popover.
  - `ReviewModal.tsx` — Weekly reflection dialog with rating chips, comments, and rollover selection.
  - `HistoryView.tsx` — Chronological timeline of completed past weeks.
  - `WeeklyBalanceWidget.tsx` — Harmony score and dimensional balance indicators.
  - `AuthModal.tsx` — Google Sign-In, Firebase connection modal, and JSON import/export.
  - `PwaInstallBanner.tsx` — Install prompt banner for mobile and desktop.

