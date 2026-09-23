# Walkthrough - Piano Audio Playback Diagnosis & Fix

## Summary of Changes
Investigated and resolved the piano audio playback issue in [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/script.js) and [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/css/style.css) where keys produced no sound when pressed (both with sustain enabled and disabled).

---

## Key Diagnostic Findings & Root Causes

1. **AudioContext Autoplay Lock:**
   - Browsers default the `AudioContext` to a `"suspended"` state until user interaction.
   - When notes were triggered while suspended, `audioCtx.currentTime` was `0`, causing scheduled envelope ramps to evaluate out-of-sync with hardware presentation time once resumed.
   - Resumption was not explicitly tied to early window gesture listeners (`pointerdown`, `touchstart`, `mousedown`, `keydown`).

2. **Gain Envelope Clamping & Premature Cancellation:**
   - In `stopPianoNote()`, fast taps or quick clicks were immediately calling `cancelScheduledValues(now)` and attempting to read `note.gain.gain.value`.
   - In Chromium and WebKit engines, `AudioParam.value` returns the initial baseline (`0.0001`) during an ongoing ramp automation rather than the in-flight computed level.
   - This caused the attack ramp to be canceled mid-flight and clamped to `0.0001` before audible sound could emerge.
   - On keys styled with `transform: translateY(2px)`, a `pointerleave` listener was firing upon click, aborting the note instantaneously.

3. **Touch Action Hijacking on Mobile:**
   - Without `touch-action: none` on the keyboard container and keys, mobile browsers captured taps as scroll gestures, immediately dispatching `pointercancel` and choking notes.

4. **Master Gain & Audio Routing Robustness:**
   - `masterPianoGain` needed defensive verification to ensure its context is active, volume is unmuted (`1.0`), and node connections are securely wired to `audioCtx.destination`.

---

## Fixes Implemented

### 1. Active Autoplay Unlocking ([script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/script.js))
- Added `unlockPianoAudioContext()` helper that proactively calls `audioCtx.resume()`.
- Registered global one-time passive listeners on `pointerdown`, `touchstart`, `mousedown`, and `keydown` to automatically unlock audio on any initial user gesture.
- Embedded `unlockPianoAudioContext()` directly into `showPianoDrawer()`, `togglePianoDrawer()`, `playPianoVoicePart()`, and `renderPianoKeyboard()`.
- Ensured `getPianoAudioContext()` validates that `masterPianoGain` is alive, set to `gain.value = 1.0`, and connected to `destination`, with a direct destination fallback.

### 2. Envelope Protection & Natural Damper Release ([script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/script.js))
- Enforced a minimum sounding duration (`minSoundingDuration = 0.06s`) in `stopPianoNote()` so quick taps and clicks complete their attack phase cleanly without being muted prematurely.
- Guarded release starting level against indeterminate or zero `gain.value` reads (fallback `0.26`).
- Implemented a smooth acoustic damper release over `0.12s` (or `0.05s` when force-muting).
- Kept sustain pedal ring-out (`3.2s`) natural and uninterrupted when sustain is ON.

### 3. Pointer Capture & Touch Action Optimization ([script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/script.js) & [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantimes/css/style.css))
- In `renderPianoKeyboard()`, implemented `setPointerCapture(e.pointerId)` on `pointerdown` and `releasePointerCapture(e.pointerId)` on `pointerup`/`pointercancel`.
- Removed the fragile `pointerleave` listener that caused immediate note cancellation when keys moved slightly or when mouse drifted.
- Set `touch-action: none;` on `.piano-keyboard`, `.piano-key-white`, and `.piano-key-black` in `css/style.css` to prevent mobile scroll hijacking.

---

## Verification Results
- **Automated Verification Script (`scratch/verify_piano.py`)**:
  - Validated syntax and bracket balance.
  - Verified presence of all 16 core piano functions.
  - Confirmed active autoplay unlock listeners.
  - Confirmed node connection graph and audio destination fallback.
  - Confirmed attack ramp protection and release damping duration.
  - Confirmed sustain pedal bypass logic and lingering note damping.
  - All tests passed with zero errors.
