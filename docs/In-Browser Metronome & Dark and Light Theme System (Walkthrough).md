# Walkthrough - In-Browser Metronome & Dark/Light Theme System

Implemented a precision Web Audio API-powered Metronome tool and an adaptive Dark & Light Theme system across [index.html](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/index.html), [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/script.js), and [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/css/style.css).

---

## 1. Features Implemented

### 🌙 Dark & Light Theme System
- **CSS Design Tokens**: Refactored styling into `:root` semantic tokens (`--bg-page`, `--bg-card`, `--bg-modal`, `--bg-input`, `--text-primary`, `--text-secondary`, `--border-subtle`, `--border-highlight`) preserving the choir blue and gold branding.
- **Dark Theme (`[data-theme="dark"]`)**: Deep slate aesthetic (`#090d16`, `#131b2e`, `#1a243c`, `#23314e`) with crisp, high-contrast typography, dark modals, inputs, and customized form controls.
- **Preference Storage & System Auto-Detection**:
  - Saved in `localStorage` under `theme_mode` (`'system' | 'light' | 'dark'`).
  - Auto-detects device mode via `window.matchMedia('(prefers-color-scheme: dark)')` with live dynamic change listeners.
- **Controls**:
  - **Quick Header Toggle**: One-click Sun/Moon button (`#themeQuickToggleBtn`) directly in the top header.
  - **Settings Modal**: "Theme & Appearance" segmented control (`#themeBtnSystem`, `#themeBtnLight`, `#themeBtnDark`) under Preferences.

### ⏱️ In-Browser Precision Metronome Tool
- **Audio Engine (Web Audio API)**:
  - Chris Wilson lookahead scheduling (`lookahead = 25ms`, `scheduleAheadTime = 0.1s`) ensuring rock-solid, drift-free timing.
  - High crisp woodblock ping (1200Hz) on beat 1, lower blip (800Hz) on subsequent beats.
- **Rehearsal Controls & UI**:
  - Collapsible card (`#metronomeWidget`) positioned on the rehearsal dashboard.
  - Large digital BPM readout (40–220 BPM) with dynamic Italian tempo markings (Largo, Adagio, Andante, Moderato, Allegro, Vivace, Presto).
  - Fine-tuning `-1` / `+1` buttons and continuous tempo range slider.
  - **Tap Tempo**: Real-time pulse averaging based on user tap intervals.
  - **Time Signatures**: Quick selector for `2/4`, `3/4`, `4/4`, and `6/8`.
  - **Visual Pulsing Beat LEDs**: Beat dots that flash in exact synchrony with the audio clicks, with Beat 1 styled as an accented downbeat with gold ring.
  - **Auto-Pause**: Automatically halts audio playback when switching browser tabs, minimizing the window, or collapsing the metronome drawer.

---

## 2. Visual Demonstration

````carousel
![Dashboard in Dark Mode](file:///C:/Users/PC/.gemini/antigravity-ide/brain/1e6f0620-d1f9-4cb8-9134-5ce6e9d58005/dashboard_dark_mode_1789006690697.png)
<!-- slide -->
![Settings Modal Appearance in Dark Mode](file:///C:/Users/PC/.gemini/antigravity-ide/brain/1e6f0620-d1f9-4cb8-9134-5ce6e9d58005/settings_modal_dark_mode_1789006734988.png)
<!-- slide -->
![Metronome Running with Pulsing Beat LEDs](file:///C:/Users/PC/.gemini/antigravity-ide/brain/1e6f0620-d1f9-4cb8-9134-5ce6e9d58005/metronome_running_1789006918793.png)
````

### Browser Testing Session Recording
![Browser Session Test Recording](file:///C:/Users/PC/.gemini/antigravity-ide/brain/1e6f0620-d1f9-4cb8-9134-5ce6e9d58005/kantime_metro_theme_1789006670097.webp)

---

## 3. Verification Summary

| Test Case | Scenario Tested | Outcome |
|---|---|:---:|
| **Quick Header Theme Toggle** | Clicked `#themeQuickToggleBtn` in header | Switched between Light and Dark mode instantly, updating `data-theme` attribute |
| **Settings Appearance Control** | Selected Dark / Light / System in Settings Preferences | Live updated theme mode, persisted in `localStorage`, and synced segmented button state |
| **Metronome Tempo Slider & Fine-Tune** | Adjusted slider and `-1` / `+1` buttons | BPM display and Italian tempo markings updated dynamically (e.g., 99 BPM = *Andante*, 100 BPM = *Moderato*) |
| **Time Signature Selector** | Switched between 2/4, 3/4, 4/4, and 6/8 | Correct number of beat dots rendered with Beat 1 accented; header badge synced |
| **Tap Tempo Calculator** | Tapped `#metronomeTapBtn` repeatedly | Calculated BPM accurately based on rolling tap intervals |
| **Web Audio Playback & Beat Visuals** | Clicked "Start Metronome" | Web Audio oscillators scheduled clicks without drift; beat LEDs pulsed in sequence |
| **Auto-Pause & Collapse** | Collapsed metronome header and backgrounded tab | Stopped metronome cleanly to conserve battery |
