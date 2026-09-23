# Walkthrough - Piano Acoustic Decay, Keyboard Shortcuts & Singer Details Pop-Up

## Summary of Changes
Completed the three requested updates across [index.html](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/index.html), [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/css/style.css), and [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/script.js):

1. **Remove Piano Sustain & Fall Back to Pure Natural Decay:**
   - Completely eliminated the `Sustain: On/Off` button and its associated state logic.
   - Implemented a clean, natural acoustic chime release/decay (~1.35 seconds) with fast attack (`0.015s`), removing all pedal conflicts, audio clamping, or premature note choking.
2. **Fix Piano Keyboard Shortcuts (`A–K` and `W, E, T, Y, U`):**
   - Added active `keydown` and `keyup` window listeners that map `A` (C), `S` (D), `D` (E), `F` (F), `G` (G), `H` (A), `J` (B), `K` (high C) and black keys `W` (C#), `E` (D#), `T` (F#), `Y` (G#), `U` (A#).
   - Handles both `e.key` and `e.code` (`KeyA`, `KeyW`, etc.) to prevent layout or Caps Lock failures.
   - Built an input-typing guard (`isTypingInInput(e)`) to prevent triggering shortcuts when typing into input fields, textareas, or modal forms.
   - Added dual `.key-pressed` and `.is-pressed` visual state handling with `:active` parity in both light and dark themes.
3. **Top 10 Dedicated Singers: Tap Name for Full Details Pop-Up:**
   - Made every singer row in the Leaderboard clickable with hover and tap feedback.
   - Clicking opens the lightweight `#singerDetailsModal` showing untruncated full name, avatar with fallback, voice part badge, rank pill (`Rank #X in Stake Choir` / `Primary Stars`), formatted practice time (minutes and hours), and rank card.
   - Fully accessible with keyboard navigation (Enter/Space on rows, Escape to close) and backdrop click dismissal.
   - Styled seamlessly for both Light and Dark themes.

---

## Detailed Modifications

### 1. [index.html](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/index.html)
- Removed `#pianoToggleSustainBtn` from the piano controls toolbar.
- Added `#singerDetailsModal` before `</body>` with semantic modal structure:
  - Hero section: Avatar (`#singerDetailsAvatarContainer`), untruncated full name (`#singerDetailsFullName`), voice badge (`#singerDetailsVoicePart`), and rank pill (`#singerDetailsRankPill`).
  - Stat cards: Total Practice Time (`#singerDetailsTimeValue`, `#singerDetailsTimeSub`) and Rehearsal Rank (`#singerDetailsRankValue`, `#singerDetailsRankSub`).
  - Close button (`✕`) and "Done" button.

### 2. [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/css/style.css)
- Added `.key-pressed` selectors for `.piano-key-white` and `.piano-key-black` matching `.is-pressed` across both light and dark themes.
- Styled `.board-row.clickable-singer` with cursor pointer, hover background highlight, and active tap feedback (`transform: scale(0.99)`).
- Added comprehensive styles for `#singerDetailsModal`:
  - `.singer-details-modal-box`, `.singer-details-avatar-container`, `.singer-details-fullname`, `.singer-details-rank-pill`, `.singer-stat-tile`.
  - Dark mode adaptations for rank pill, stat tiles, and singer hover states.

### 3. [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/script.js)
- **Natural Decay Piano Engine**:
  - Removed `isSustainPedalOn`, `pianoSustain`, `togglePianoSustain`, and `dampLingeringSustainedNotes`.
  - Configured `playPianoNote()` to ring out with `linearRampToValueAtTime(0.32, now + 0.015)` and `exponentialRampToValueAtTime(0.0001, now + 1.35)`.
  - In `stopPianoNote()`, key release removes visual press highlighting immediately while allowing audio to ring out with natural resonance (unless explicit `forceMute` is provided).
- **Physical Keyboard Shortcuts**:
  - Implemented `isPianoDrawerOpen()`, `isTypingInInput(e)`, and `getPianoNoteFromKeyboardEvent(e)` (mapping both `e.key` and `e.code`).
  - `keydown` calls `unlockPianoAudioContext()`, `highlightPianoKey(note, true)`, and `playPianoNote(note)`.
  - `keyup` calls `highlightPianoKey(note, false)` and `stopPianoNote(note)`.
  - Added window `blur` listener to clear stuck pressed keys.
- **Singer Details Modal**:
  - Updated `renderLeaderboardSingers()` to add `.clickable-singer`, `role="button"`, `tabindex="0"`, and click/keydown handlers.
  - Implemented `openSingerDetailsModalByIndex()`, `openSingerDetailsModal()`, `closeSingerDetailsModal()`, and `closeSingerDetailsModalOnBackdrop()`.
  - Hooked Escape key to close the singer modal.
  - Exported functions to `window`.

---

## Verification Results
- **Automated Verification Script (`scratch/verify_piano.py`)**:
  - Verified removal of sustain pedal elements and functions from HTML and JS.
  - Verified singer details modal IDs in HTML, CSS, and JS.
  - Verified keyboard event key/code mappings (`A-K`, `W, E, T, Y, U`).
  - Verified input typing guard and `.key-pressed` class styling.
  - Verified natural decay parameters.
  - All test assertions passed (100% clean).
