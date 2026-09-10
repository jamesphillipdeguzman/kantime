# Walkthrough: Offline-First Progressive Web App (PWA) Conversion

KanTime has been converted into a full offline-first Progressive Web App (PWA) across [manifest.json](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/manifest.json), [sw.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/sw.js), [index.html](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/index.html), [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/script.js), and [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/css/style.css).

## Summary of Changes

### 1. Web App Manifest & Service Worker
- **[manifest.json](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/manifest.json)**:
  - Configured with:
    - `name`: `"KanTime - Stake Choir Hub"`
    - `short_name`: `"KanTime"`
    - `start_url`: `"./index.html"`
    - `display`: `"standalone"`
    - `theme_color`: `"#1e40af"`
    - `background_color`: `"#ffffff"`
    - Icons linking to `images/kantime-logo.png` (192x192 maskable) and `images/iloilo-stake-choir-logo.jpg` (512x512).
- **[sw.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/sw.js) (Service Worker)**:
  - Cache-First strategy for instant loading.
  - Pre-caches core app assets (`index.html`, `css/style.css`, `script.js`, `manifest.json`, `html2pdf.bundle.min.js`).
  - Pre-caches all choir avatar portraits and logos in `images/`.
  - Pre-caches local rehearsal audio tracks and sheet music PDF in `kantime-resources/Choose You This Day/`.
  - Implements HTTP `Range` header support (`206 Partial Content`) to ensure smooth offline seeking and playback for `<audio>` tags across iOS Safari and Chromium.
- **Service Worker Registration**:
  - Registered in [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/script.js) on window load.

### 2. Offline Audio & Sheet Music Fallback
- **Bundled Offline Audio Player**:
  - Songs with local assets (e.g. *"Choose You This Day"*) render a `.local-audio-card` with an interactive `<audio>` player and part switcher pills (`Full Choir`, `Soprano`, `Alto`, `Tenor`, `Bass`, `Piano Accompaniment`).
  - Marked with `⚡ Offline Ready` badge.
  - Local sheet PDF preview link: `🎼 Preview Sheet (Offline PDF)`.
- **External Link Offline Badges**:
  - When `navigator.onLine === false`, external resources (YouTube video streams, Google Drive folders, Church hymn links) display an inline warning badge:
    `⚠️ Requires Internet`.
  - Replaces embedded YouTube iframes with a friendly offline notice explaining that video streaming requires internet and directs singers to use the cached local audio player.

### 3. Offline Practice Logging & Sync Queue
- **Offline Logging**:
  - When a rehearsal countdown finishes while `navigator.onLine === false`, the completed session payload (`{ name, section, song, minutes, timestamp, avatar }`) is stored in `localStorage["offline_practice_queue"]`.
  - Displays toast notification:
    > *"Session saved offline! It will sync to the leaderboard when you reconnect. 📡"*
- **Automatic Background Sync**:
  - Listens to `window.addEventListener('online', syncOfflinePracticeQueue)`.
  - Automatically dispatches queued POST requests to Google Apps Script `APPS_SCRIPT_URL` when connectivity resumes, displays a confirmation toast, clears the queue, and refreshes the leaderboard.
- **Offline Status Banner**:
  - `#offlineStatusBanner` appears below the header when disconnected:
    > *"📡 Offline Mode: Practicing with cached repertoire. Practice logs will sync automatically when you reconnect."*

---

## Verification Results

### Browser Subagent Automation Test
1. **Repertoire & Local Audio Player Verification**:
   - Rehearsal session for *"Choose You This Day"* unlocked with `.local-audio-card`.
   - Tested voice-part track pills (`Full Choir`, `Soprano`, `Alto`, `Tenor`, `Bass`, `Piano`); confirmed audio source switching and active pill states.
   - Confirmed `🎼 Preview Sheet (Offline PDF)` button is present.
2. **Offline Mode & UI Feedback**:
   - Confirmed offline event handling, top status banner display, and "Requires Internet" badges on external links.
3. **Offline Queueing & Sync**:
   - Verified that `submitPracticeSession` gracefully catches offline state, queues sessions in `localStorage["offline_practice_queue"]`, and prepares automated background sync on reconnect.

### Browser Session Screenshot & Recording
![Practice Hub PWA Repertoire & Local Audio](file:///C:/Users/PC/.gemini/antigravity-ide/brain/1e6f0620-d1f9-4cb8-9134-5ce6e9d58005/pwa_practice_hub_1789004966893.png)

Session recording: ![PWA Offline Repertoire Test](file:///C:/Users/PC/.gemini/antigravity-ide/brain/1e6f0620-d1f9-4cb8-9134-5ce6e9d58005/kantime_pwa_offline_test_1789004408606.webp)
