# Implementation Plan: Quick Duration Adjuster & Name Validation Rule

Add an inline timer duration adjuster directly on the landing rehearsal card, and enforce a strict minimum 5-character name validation rule across the profile setup and settings editor.

## User Review Required

> [!IMPORTANT]
> - **Name Validation**: Requires full names to be at least 5 characters (`name.trim().length >= 5`). Submissions of 4 characters or fewer are blocked with inline warnings, red border highlights, and disabled buttons.
> - **Landing Page Duration Adjuster**: A pill selector (5m, 10m, 15m, 20m, 30m, 45m, 60m) will be added directly on `#practiceWorkspace` above the timer display, automatically synchronized with `localStorage` and Settings modal, and locked while the timer is actively running.

---

## Proposed Changes

### 1. HTML Markup Updates

#### [MODIFY] [index.html](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/index.html)
- In `#practiceWorkspace`:
  - Add `.quick-duration-wrapper` with pill buttons for 5m, 10m, 15m, 20m, 30m, 45m, 60m.
- In `#profileCard`:
  - Add `<div class="input-validation-msg" id="memberNameValidationMsg">` directly below `#memberName`.
- In `#tabPanelProfile` (Settings modal):
  - Add `<div class="input-validation-msg" id="settingMemberNameValidationMsg">` directly below `#settingMemberName`.

---

### 2. Styling Updates

#### [MODIFY] [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/css/style.css)
- **Quick Duration Adjuster Styles**:
  - `.quick-duration-wrapper`: clean card bar positioned right above the timer countdown.
  - `.quick-duration-pill`: tactile rounded pills with active state highlight, hover transitions, and locked/disabled state styling.
- **Form Validation Styles**:
  - `.input-invalid`: high-contrast red border (`#ef4444`) with subtle red glow.
  - `.input-validation-msg`: clear warning text with icon (`⚠️ Please enter a valid full name (at least 5 characters).`).

---

### 3. Application Logic Updates

#### [MODIFY] [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/script.js)
- **Quick Duration Adjuster (`selectQuickDuration`)**:
  - Implement `selectQuickDuration(mins)` that triggers `handleTimerDurationChange(mins)`.
  - Implement `updateDurationSelectorUI(mins, isLocked)` to sync the landing page pills, dropdown in Settings modal, and lock pills when the countdown is running (`toggleTimer()`, `updateTimerTick()`, `restoreTimerState()`).
  - Automatically update the clock face when duration is selected while idle/reset.
- **Strict Name Validation (`validateNameInput`)**:
  - Real-time `input` event listeners for `#memberName` and `#settingMemberName`:
    - Check `val.trim().length >= 5`.
    - If `< 5` and non-empty: apply `.input-invalid`, reveal warning message, disable the submit button.
    - If `>= 5`: remove `.input-invalid`, hide warning message, enable submit button.
  - Guard `handleProfileSubmit()` and `saveProfileFromSettings()` against any names `<= 4` characters.
  - Guard `keydown` Enter press on both inputs.

---

## Verification Plan

### Automated / Browser Subagent Verification
1. **Quick Duration Selector**:
   - Verify pill selector renders on the landing rehearsal card.
   - Click "20m" -> verify clock face updates to `20:00`, button updates to `Start 20m Session`, settings modal dropdown updates to 20m, and `localStorage` persists 20m.
   - Click "Start 20m Session" -> verify duration pills become disabled/locked while timer is running.
   - Click "Pause Session" -> verify pause state.
2. **User Name Validation**:
   - In profile editor / settings modal:
     - Type "Juan" (4 characters) -> verify red border appears, inline warning *"Please enter a valid full name (at least 5 characters)."* displays, and submit button is disabled.
     - Press Enter key -> verify submission is blocked.
     - Type "Juan dela Cruz" (14 characters) -> verify red border disappears, warning hides, and submit button enables.
     - Submit -> verify profile saves successfully.
