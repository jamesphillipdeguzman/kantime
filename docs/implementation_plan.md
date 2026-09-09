# Implementation Plan: Consolidate Profile into Settings Modal & Add Tutorial Tab

Consolidate member profile management (voice selection, name input, and 8-avatar portrait picker) into the Settings modal, reorganize the modal into a unified 3-tab architecture, and introduce a step-by-step in-app Tutorial & Guide.

---

## Proposed Architectural Changes

### 1. Unified 3-Tab Settings Modal Layout
The gear icon (⚙️) "Practice Preferences" modal will be expanded into 3 distinct tabs:
- **Tab 1: "Profile & Voice"** (`#tabPanelProfile`):
  - Manage member full name (`#settingMemberName`).
  - Voice part selection dropdown (`#settingMemberSection`): Soprano, Alto, Tenor, Bass, Primary.
  - Interactive avatar picker displaying all 8 circular choir portraits + default note with green active highlight ring.
  - Dedicated "Save Profile & Voice" button.
  - Auto-commit on modal close / Done.
- **Tab 2: "Preferences & Repertoire"** (`#tabPanelPreferences`):
  - Practice Timer Duration dropdown (5, 10, 15, 20, 30, 45, 60 minutes).
  - Stake Conference / Target Event text input with live header subtitle sync.
  - Custom repertoire editor: "+ Add Song", piece list, edit/delete actions, and YouTube/Drive sheet links.
- **Tab 3: "Tutorial & Guide"** (`#tabPanelTutorial`):
  - Text-based walkthrough featuring 5 clear steps with styled badge numbers:
    - **Step 1**: Set Up Profile & Avatar
    - **Step 2**: Configure Preferences
    - **Step 3**: Practice & Background Timer
    - **Step 4**: Inactivity Auto-Pause (5-min idle timeout)
    - **Step 5**: Leaderboards & Standings

### 2. Header & Banner Integration
- The **"✏️ Switch Voice / Change Name"** button in the "SIGNED IN AS" header card will directly open the Settings modal and switch immediately to the **"Profile & Voice"** tab (`openSettingsModal('profile')`).
- Changes made in Settings are persisted to `localStorage` (`choir_name`, `choir_section`, `choir_voice`, `choir_avatar`) and immediately update the header banner, timer, and leaderboard display.

---

## Proposed Changes

### [HTML Markup] [index.html](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/index.html)
- Update `#settingsModalTitle` and tab navigation list to 3 buttons:
  - `👤 Profile & Voice` (`#tabBtnProfile`)
  - `⚙️ Preferences & Repertoire` (`#tabBtnPreferences`)
  - `📖 Tutorial & Guide` (`#tabBtnTutorial`)
- Implement `#tabPanelProfile` with name input, voice part dropdown, and `#settingAvatarPicker` container.
- Consolidate preferences and repertoire editor into `#tabPanelPreferences`.
- Implement `#tabPanelTutorial` with 5 step cards (`.tutorial-step-card`).
- Connect "Switch Voice / Change Name" in `#activeProfileBanner` to open Settings on the Profile tab.

### [Styling] [css/style.css](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/css/style.css)
- Add styles for 3-tab navigation on desktop and mobile (`.settings-tab-btn` with flex wrapping/scroll).
- Add styles for `.tutorial-guide-list`, `.tutorial-step-card`, `.step-badge`, and step typography matching choir theme colors (`#1d4ed8`, `#059669`, `#0f766e`).
- Ensure `#settingAvatarPicker` renders smoothly inside the modal with horizontal scrolling or responsive grid wrap.

### [JavaScript Logic] [script.js](file:///c:/Users/PC/OneDrive%20-%20Lucky%20mobile/Documents/.WEBSITES/kantime/script.js)
- Update `openSettingsModal(defaultTab = 'profile')` to accept and activate a target tab.
- Update `switchSettingsTab(tabName)` to handle `'profile'`, `'preferences'`, and `'tutorial'`.
- Implement `renderSettingAvatarPicker(currentAvatar)` and `selectSettingAvatar(filename)` for the modal profile tab.
- Implement `saveProfileFromSettings()` to persist `choir_name`, `choir_section`, `choir_voice`, and `choir_avatar`, and refresh `#activeProfileBanner`.
- Update `switchProfile()` to invoke `openSettingsModal('profile')`.
- Ensure footer "Done" commits any pending profile or duration adjustments before closing.

---

## Verification Plan

### Automated / Code Quality Verification
- Inspect files with PowerShell / git diff to verify balanced markup, valid syntax, and no duplicate IDs or missing handlers.
- Verify that `choir_name`, `choir_section`, `choir_voice`, and `choir_avatar` are properly synchronized in `localStorage`.

### Manual User Flow Checklist
1. Open Settings modal via gear button (⚙️) -> opens modal with 3 tabs.
2. Click "Switch Voice / Change Name" in banner -> opens Settings modal focused directly on "Profile & Voice" tab.
3. Switch avatar portrait, change voice part to Alto, click "Save Profile & Voice" -> header banner updates to Alto with new avatar portrait immediately.
4. Switch to "Preferences & Repertoire" tab -> test duration change and song list editor.
5. Switch to "Tutorial & Guide" tab -> verify 5 step-by-step guide cards.
6. Verify modal responsiveness on mobile screen widths.
