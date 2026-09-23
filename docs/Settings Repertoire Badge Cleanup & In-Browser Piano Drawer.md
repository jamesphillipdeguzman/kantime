# Implementation Plan: Settings Repertoire Badge Cleanup & In-Browser Piano Drawer

Implement two UI and feature enhancements in `index.html`, `css/style.css`, and `script.js`:
1. **Remove Redundant Badge**: Strip the `<span class="badge-settings-pill">Repertoire Management</span>` badge under "Event Repertoire & Archives" in the Settings modal to keep the header clean and uncluttered.
2. **Interactive In-Browser Piano Drawer / Modal**: Add the quick-tool `🎹 Piano` pill button next to `⏱️ Metronome` and `ℹ️ Vocal Tips` on the practice workspace card, and build an interactive virtual keyboard / pitch finder drawer powered by the browser's native `AudioContext`.

---

## User Review Required

> [!IMPORTANT]
> - **Prompt Cut-Off Verification**: The original prompt ended right after specifying the button placement (`<button type="button" class="btn-tool-pill" id="pianoToggleBtn" onclick="togglePianoDrawer()">🎹 Piano</button>`). We have designed a complete, responsive piano drawer matching Kantime's Metronome card pattern (collapsible, closeable, octave switcher, choir voice part reference pitch buttons, touch/click polyphonic audio engine). If you had additional specific bullet points in your prompt, please confirm or adjust based on this plan.
> - **Keyboard Range & Layout**: Defaulting to a practical 1.5–2 octave keyboard range (C4 to G5 or C3 to C5 with quick octave shift `C3–B3`, `C4–B4`, `C5–B5`), ideal for mobile and desktop screens while practicing vocal lines.

---

## Open Questions

> [!NOTE]
> 1. **Drawer Placement vs. Modal**:
>    - **Approach A (Recommended - Collapsible Drawer Card)**: Placed right alongside / beneath the Metronome widget on the rehearsal dashboard. When clicked, it smoothly expands/slides into view, allowing the singer to view their lyrics/resources while tapping notes.
>    - **Approach B (Floating Modal Window)**: Placed in a centered modal dialog similar to Vocal Tips.
>    - *The plan defaults to Approach A as suggested by the function name `togglePianoDrawer`.*
> 2. **Audio Synthesis Profile**:
>    - Uses a gentle multi-oscillator piano-like timbre (fundamental sine + gentle triangle/overtone + exponential decay release envelope) without needing external audio sample downloads, ensuring 100% offline PWA support.

---

## Proposed Changes

### 1. Structure & Markup Updates ([index.html](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/index.html))

- **Task 1 (Settings Modal)**:
  - In `#tabPanelPreferences` under `.settings-section`:
    - Remove `<span class="badge-settings-pill">Repertoire Management</span>` sitting inside `.settings-section-title-wrap`.
    - Keep `<h4>Event Repertoire &amp; Archives</h4>` and the helper paragraph untouched.

- **Task 2 (Practice Workspace Header & Piano Drawer)**:
  - Inside `.workspace-header-actions` on `#practiceWorkspace`:
    - Add `<button type="button" class="btn-tool-pill" id="pianoToggleBtn" onclick="togglePianoDrawer()" title="Practice Piano &amp; Vocal Pitch Helper" aria-label="Toggle Piano"><span class="tool-icon">🎹</span><span class="tool-text">Piano</span></button>`.
  - Add `#pianoDrawer` collapsible card directly adjacent to `#metronomeWidget`:
    - **Header**: Icon, title ("In-Browser Piano & Pitch Helper"), octave badge, collapse (`▼`) button, close (`×`) button.
    - **Quick Voice Part Pitch Row**: One-tap vocal starting pitch triggers:
      - `Soprano (C5)`
      - `Alto (G4)`
      - `Tenor (E4)`
      - `Bass (C3)`
    - **Controls Bar**:
      - Octave shift selector (`Octave 3 (Low)`, `Octave 4 (Middle C)`, `Octave 5 (High)`) or left/right shift.
      - Key note labels toggle checkbox / pill.
      - Sustain toggle button.
    - **Interactive Keyboard**:
      - White keys (`C`, `D`, `E`, `F`, `G`, `A`, `B`) and raised black keys (`C#`, `D#`, `F#`, `G#`, `A#`) with realistic proportions, active pressing feedback, and touch-friendly responsiveness.
      - Voice part indicator markers on the corresponding keys.

---

### 2. Styling & Theme Integration ([css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/css/style.css))

- **Piano Drawer Card Styles (`#pianoDrawer`, `.piano-card`)**:
  - Consistent layout with `.metronome-card`, smooth transitions, border radius, and shadow.
- **Piano Keyboard Component**:
  - Container with scrollable/responsive styling for small mobile viewports (`touch-action: manipulation`, prevents accidental scrolling while playing).
  - White key styling (`.piano-key-white`): ivory gradients, inset shadow on active press, rounded bottom corners, note label text.
  - Black key styling (`.piano-key-black`): elevated z-index, sleek dark gradient, positioned precisely between white keys.
  - Active key press states (`.is-pressed`, `:active`) with subtle blue glow or accent border.
  - Voice part highlight badges on keys (S, A, T, B).
- **Dark Mode Support**:
  - Tailored keys and background matching Kantime dark theme tokens (`--card-bg`, `--card-bg-subtle`, `--text-primary`).

---

### 3. Audio & Interaction Logic ([script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/script.js))

- **Piano Audio Engine (`Web Audio API`)**:
  - Shared audio context with graceful unlock on first user interaction.
  - Frequency calculation formula: $f = 440 \times 2^{(n - 69) / 12}$.
  - Warm acoustic piano approximation: dual-oscillator blend (sine + soft triangle) with quick attack ($0.01s$), natural decay ($0.3s$ sustain stage), and pleasant release on note-off ($0.25s$).
  - Polyphonic voice tracking: ability to play notes simultaneously or legato without clipping.
- **Drawer Controls & State**:
  - `togglePianoDrawer()`, `showPianoDrawer()`, `hidePianoDrawer()`, `togglePianoCollapse()`.
  - Toggle button active state synchronization (`#pianoToggleBtn.classList.toggle('active')`).
  - Octave shifting: updates the current rendered key octave range.
  - Mouse, touch, and optional keyboard binding listeners (`keydown` / `keyup` when drawer is active).
  - LocalStorage persistence for user preference (`piano_drawer_visible`).

---

## Verification Plan

### Automated / Browser Testing (via `browser_subagent`)
1. **Task 1 Verification (Settings Modal)**:
   - Click Settings gear icon (`⚙️`).
   - Navigate to "Preferences & Repertoire" tab.
   - Inspect the section "Event Repertoire & Archives".
   - Confirm the blue badge "Repertoire Management" is completely gone.
   - Confirm title and description remain intact.
2. **Task 2 Verification (Piano Drawer)**:
   - Return to main practice dashboard.
   - Verify `🎹 Piano` button is positioned alongside `⏱️ Metronome` and `ℹ️ Vocal Tips`.
   - Click `🎹 Piano`:
     - Confirm `#pianoDrawer` smoothly opens.
     - Confirm `#pianoToggleBtn` shows active state.
   - Test Key Interactions:
     - Click white and black keys; verify active press visual feedback.
     - Test quick voice-part buttons (`Soprano`, `Alto`, `Tenor`, `Bass`).
     - Test octave switcher and verify keys shift octave frequencies and labels.
   - Test Collapse / Close:
     - Click `▼` collapse button; verify body collapses.
     - Click `×` close button; verify drawer hides and toggle button deactivates.
   - Test Dark / Light mode:
     - Toggle dark mode and confirm keyboard contrast and beauty.
