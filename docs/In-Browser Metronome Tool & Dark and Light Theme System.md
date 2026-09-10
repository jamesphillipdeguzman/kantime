# Implementation Plan - In-Browser Metronome Tool & Dark/Light Theme System

Implement a rock-solid, Web Audio API-powered Metronome with tempo controls and dynamic beat indicators, alongside a comprehensive Dark & Light theme system with CSS design tokens, system preference detection, and Settings controls.

## Proposed Changes

### 1. CSS Design Tokens & Dark Theme (`css/style.css`)
- Define CSS custom property design tokens in `:root`:
  - `--bg-page`, `--bg-card`, `--bg-modal`, `--bg-input`, `--bg-elevated`
  - `--text-primary`, `--text-secondary`, `--text-muted`, `--text-subtle`
  - `--border-subtle`, `--border-highlight`
  - Refactor existing hardcoded `#ffffff` backgrounds and dark text across cards, modals, tables, and form inputs to use custom properties.
- Add `[data-theme="dark"]` overrides on `document.documentElement`:
  - Rich dark slate palette (`#090d16`, `#131b2e`, `#1a233a`, `#243049`)
  - Preserved choir blue & gold accent branding with high-contrast text (`#f1f5f9`, `#cbd5e1`, `#94a3b8`)
  - Elevated shadows and adjusted borders for modals, popups, and inputs
  - Preserve print/PDF export offscreen container as light background for document clarity
- Add component styles:
  - Theme segmented control in Settings (`.theme-segmented-control`, `.theme-option-btn.active`)
  - Quick theme toggle button in header (`.btn-theme-toggle`)
  - Metronome widget styles: collapsible container, tempo slider, +/- buttons, tap tempo button, time signature selector, and pulsing LED beat dots with special downbeat (beat 1) glow.

### 2. Metronome & Theme UI Markup (`index.html`)
- **Header Bar**:
  - Add quick theme toggle button (`#themeQuickToggleBtn`) next to the Settings button in `#topNavActions`.
- **Main Rehearsal Area**:
  - Add a dedicated collapsible Metronome card (`#metronomeCard`) between `#practiceWorkspace` and `#activeResourcesCard` (or as a docked rehearsal tool).
  - Header: "⏱️ Metronome & Tempo Guide", tempo/meter badge (`#metronomeHeaderBadge`), and collapse/expand toggle.
  - Body:
    - Large BPM readout (`#metronomeBpmDisplay`) & dynamic Italian tempo label (`#metronomeTempoMarking`, e.g. "Andante • 92 BPM")
    - Fine-tuning controls: `-1 BPM`, range slider (`40` to `220`), `+1 BPM`
    - "Tap Tempo" button (`#metronomeTapBtn`)
    - Time signature pills (`2/4`, `3/4`, `4/4`, `6/8`)
    - Visual beat LED indicator row (`#metronomeBeatDots`)
    - Start / Stop button (`#metronomeToggleBtn`)
- **Settings Modal (`#tabPanelPreferences`)**:
  - Add "Theme & Appearance" section with segmented options: "System", "Light", "Dark".

### 3. Audio Engine & Theme State Logic (`script.js`)
- **Theme Management**:
  - `initThemeSystem()`: Reads `localStorage.getItem("theme_mode") || "system"`.
  - `setThemePreference(mode)`: Updates localStorage, resolves active theme ('light' or 'dark'), applies `data-theme` attribute to `<html>`, and updates segmented control + header icon.
  - `window.matchMedia('(prefers-color-scheme: dark)')` change listener for responsive system mode switching.
- **Web Audio API Metronome Engine**:
  - Lookahead scheduler pattern (Chris Wilson / Web Audio API) with `lookahead = 25ms` and `scheduleAheadTime = 0.1s`.
  - High ping (1200Hz) on beat 1 with exponential decay, lower blip (800Hz) on subsequent beats.
  - Synchronized visual beat flashing (`highlightBeat(beatNumber)`).
  - Tempo calculation & dynamic tempo markings helper (`getTempoMarking(bpm)`).
  - Tap tempo calculator with rolling timestamp array.
  - Time signature selector updating beats per bar and regenerating dots.
  - Auto-pause hooks:
    - On tab hidden (`document.addEventListener("visibilitychange")`)
    - On collapsing metronome card or minimizing view.

---

## Verification Plan

### Automated / Browser Verification
1. Start Python HTTP server on port 8080 (`python -m http.server 8080`).
2. Verify Theme System:
   - Open app and verify default theme matches system preference.
   - Open Settings -> Preferences -> Appearance -> switch to "Dark": verify entire background turns dark slate, text remains crisp, cards, modals, and timer buttons adapt without contrast bugs.
   - Switch to "Light": verify returns to clean bright white/slate palette.
   - Click quick header theme toggle: verify instant toggle between Light and Dark.
   - Reload page: verify theme preference persists from `localStorage`.
3. Verify Metronome Feature:
   - Expand Metronome card on main rehearsal page.
   - Test BPM slider and +/- buttons: verify readout and Italian tempo marking update dynamically (e.g. 60 = Adagio, 100 = Andante, 130 = Allegro).
   - Test Tap Tempo: tap button 4 times at steady pace, verify BPM calculates accurately.
   - Select time signatures: 2/4 (2 dots), 3/4 (3 dots), 4/4 (4 dots), 6/8 (6 dots).
   - Click "Start Metronome":
     * Verify crisp Web Audio clicks and audio context starts without error.
     * Verify visual beat dot pulses in sync, with Beat 1 highlighted distinctly.
   - Click "Stop Metronome": verify audio and visual pulses stop.
   - Test auto-pause: start metronome, collapse card (or switch tabs), verify it automatically halts audio playback.
4. Capture screenshots and update `walkthrough.md`.
