// ==========================================================================
// KanTime | Stake Choir Practice Hub - Main Application Script
// ==========================================================================

// --- APPS SCRIPT WEB APP URL ---
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycby6r8JCXFOeuDqk8mlrTFAY5G5jOUOcoljMIC-ow1tlStLj3EVBpEWE_q9iT_sRngEa/exec";

// --- AVATAR ASSET DEFINITIONS ---
const CHOIR_AVATARS = [
  // Primary / Kids
  { file: "boy-choir.jpg", label: "Boy Choir", category: "Primary" },
  { file: "girl-choir.jpg", label: "Girl Choir", category: "Primary" },
  // Youth
  { file: "ym-choir.jpg", label: "Young Men", category: "Youth" },
  { file: "yw-choir.jpg", label: "Young Women", category: "Youth" },
  // Adults & Seniors
  { file: "eq-choir.jpg", label: "Elders Quorum", category: "Adults" },
  { file: "rs-choir.jpg", label: "Relief Society", category: "Adults" },
  { file: "elder-choir.jpg", label: "Senior Brother", category: "Seniors" },
  { file: "sister-choir.jpg", label: "Senior Sister", category: "Seniors" }
];

let selectedAvatarFile = "";

// Helper to normalize avatar image source path
function getAvatarImgSrc(filename) {
  if (!filename) return "";
  const cleanName = filename.replace(/^images\//, "").trim();
  return `images/${cleanName}`;
}

function handleAvatarKeyDown(e, filename) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    selectAvatar(filename);
  }
}

// Render the 8 circular avatars in the Profile Setup / Switch Voice card
function renderAvatarPicker(currentAvatar) {
  const container = document.getElementById("avatarPicker");
  if (!container) return;

  selectedAvatarFile = currentAvatar !== undefined ? currentAvatar : (localStorage.getItem("choir_avatar") || "");

  let html = `
    <div class="avatar-option ${!selectedAvatarFile ? 'selected' : ''}" 
         id="avatar-opt-default" 
         onclick="selectAvatar('')" 
         onkeydown="handleAvatarKeyDown(event, '')"
         role="button" 
         tabindex="0"
         aria-label="Default avatar (Music Note)"
         title="No Avatar (Default 🎵)">
      <div class="avatar-circle avatar-circle-default">🎵</div>
      <span class="avatar-option-name">Default</span>
    </div>
  `;

  CHOIR_AVATARS.forEach(av => {
    const isSelected = selectedAvatarFile === av.file;
    html += `
      <div class="avatar-option ${isSelected ? 'selected' : ''}" 
           id="avatar-opt-${av.file.replace(/[^a-zA-Z0-9_-]/g, '')}" 
           onclick="selectAvatar('${av.file}')" 
           onkeydown="handleAvatarKeyDown(event, '${av.file}')"
           role="button" 
           tabindex="0"
           aria-label="${av.label} (${av.category})"
           title="${av.label} (${av.category})">
        <img class="avatar-circle" src="${getAvatarImgSrc(av.file)}" alt="${av.label}" loading="lazy">
        <span class="avatar-option-name">${av.label}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

// Select an avatar (or deselect if clicking the selected one again)
function selectAvatar(filename) {
  if (selectedAvatarFile === filename && filename !== "") {
    // Tapping currently selected avatar toggles back to default/none
    selectedAvatarFile = "";
  } else {
    selectedAvatarFile = filename;
  }

  // Update visual selection states
  const options = document.querySelectorAll(".avatar-option");
  options.forEach(opt => opt.classList.remove("selected"));

  if (!selectedAvatarFile) {
    const defaultOpt = document.getElementById("avatar-opt-default");
    if (defaultOpt) defaultOpt.classList.add("selected");
  } else {
    const activeOpt = document.getElementById(`avatar-opt-${selectedAvatarFile.replace(/[^a-zA-Z0-9_-]/g, '')}`);
    if (activeOpt) activeOpt.classList.add("selected");
  }
}

// --- SETTINGS MODAL AVATAR PICKER ---
let selectedSettingAvatarFile = "";

function handleSettingAvatarKeyDown(e, filename) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    selectSettingAvatar(filename);
  }
}

function renderSettingAvatarPicker(currentAvatar) {
  const container = document.getElementById("settingAvatarPicker");
  if (!container) return;

  selectedSettingAvatarFile = currentAvatar !== undefined ? currentAvatar : (localStorage.getItem("choir_avatar") || "");

  let html = `
    <div class="avatar-option ${!selectedSettingAvatarFile ? 'selected' : ''}" 
         id="setting-avatar-opt-default" 
         onclick="selectSettingAvatar('')" 
         onkeydown="handleSettingAvatarKeyDown(event, '')"
         role="button" 
         tabindex="0"
         aria-label="Default avatar (Music Note)"
         title="No Avatar (Default 🎵)">
      <div class="avatar-circle avatar-circle-default">🎵</div>
      <span class="avatar-option-name">Default</span>
    </div>
  `;

  CHOIR_AVATARS.forEach(av => {
    const isSelected = selectedSettingAvatarFile === av.file;
    html += `
      <div class="avatar-option ${isSelected ? 'selected' : ''}" 
           id="setting-avatar-opt-${av.file.replace(/[^a-zA-Z0-9_-]/g, '')}" 
           onclick="selectSettingAvatar('${av.file}')" 
           onkeydown="handleSettingAvatarKeyDown(event, '${av.file}')"
           role="button" 
           tabindex="0"
           aria-label="${av.label} (${av.category})"
           title="${av.label} (${av.category})">
        <img class="avatar-circle" src="${getAvatarImgSrc(av.file)}" alt="${av.label}" loading="lazy">
        <span class="avatar-option-name">${av.label}</span>
      </div>
    `;
  });

  container.innerHTML = html;
}

function selectSettingAvatar(filename) {
  if (selectedSettingAvatarFile === filename && filename !== "") {
    selectedSettingAvatarFile = "";
  } else {
    selectedSettingAvatarFile = filename;
  }

  const options = document.querySelectorAll("#settingAvatarPicker .avatar-option");
  options.forEach(opt => opt.classList.remove("selected"));

  if (!selectedSettingAvatarFile) {
    const defaultOpt = document.getElementById("setting-avatar-opt-default");
    if (defaultOpt) defaultOpt.classList.add("selected");
  } else {
    const activeOpt = document.getElementById(`setting-avatar-opt-${selectedSettingAvatarFile.replace(/[^a-zA-Z0-9_-]/g, '')}`);
    if (activeOpt) activeOpt.classList.add("selected");
  }
}


// Generate Leaderboard avatar HTML with fallback
function getLeaderboardAvatarHtml(avatarFile, singerName) {
  if (avatarFile && avatarFile.trim()) {
    const src = getAvatarImgSrc(avatarFile);
    return `
      <div class="leaderboard-avatar-wrap">
        <img src="${src}" 
             alt="${singerName || 'Singer'}" 
             class="leaderboard-avatar" 
             loading="lazy"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="leaderboard-avatar avatar-fallback" style="display:none;" title="Choir Singer">🎵</div>
      </div>
    `;
  }
  return `
    <div class="leaderboard-avatar-wrap">
      <div class="leaderboard-avatar avatar-fallback" title="Choir Singer">🎵</div>
    </div>
  `;
}

// --- USER SETTINGS & DEFAULT CHOIR REPERTOIRE ---
const DEFAULT_USER_SETTINGS = {
  targetDate: "Stake Choir Prep • Oct 24–25",
  timerMinutes: 15,
  songs: [
    {
      id: "song_1",
      title: "Know This, That Every Soul Is Free (#240)",
      part: "Adult Choir #1",
      sheetUrl: "https://www.churchofjesuschrist.org/media/music/songs/know-this-that-every-soul-is-free?crumbs=hymns&order=number&lang=eng",
      videoUrl: "",
      note: "ℹ️ Opens in external tab. Your timer will keep running while you practice!"
    },
    {
      id: "song_2",
      title: "Rise, Ye Saints, and Temples Enter (#287)",
      part: "Adult Choir #2",
      sheetUrl: "https://www.churchofjesuschrist.org/media/music/songs/rise-ye-saints-and-temples-enter?crumbs=hymns&order=number&lang=eng",
      videoUrl: "",
      note: "ℹ️ Opens in external tab. Your timer will keep running while you practice!"
    },
    {
      id: "song_3",
      title: "Choose You This Day",
      part: "Adult Choir #3",
      sheetUrl: "https://drive.google.com/embeddedfolderview?id=1bBnCakJGBj-zfka8wVbz42_ykvipMnwU#grid",
      videoUrl: "https://www.youtube.com/embed/q54H2OqWBcY?enablejsapi=1",
      note: ""
    },
    {
      id: "song_4",
      title: "Holy Places (Primary)",
      part: "Primary",
      sheetUrl: "https://www.churchofjesuschrist.org/media/music/songs/holy-places?crumbs=hymns-for-home-and-church&order=number&lang=eng",
      videoUrl: "",
      note: "ℹ️ Opens in external tab. Your timer will keep running while you practice!"
    }
  ]
};

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatYouTubeEmbedUrl(url) {
  if (!url || !url.trim()) return "";
  const trimmed = url.trim();
  if (trimmed.includes("youtube.com/embed/")) {
    return trimmed;
  }
  const watchMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}?enablejsapi=1`;
  }
  return trimmed;
}

function getUserSettings() {
  const stored = localStorage.getItem("kantime_user_settings");
  if (!stored) {
    return JSON.parse(JSON.stringify(DEFAULT_USER_SETTINGS));
  }
  try {
    const parsed = JSON.parse(stored);
    return {
      targetDate: parsed.targetDate !== undefined ? parsed.targetDate : DEFAULT_USER_SETTINGS.targetDate,
      timerMinutes: Number(parsed.timerMinutes) || DEFAULT_USER_SETTINGS.timerMinutes,
      songs: Array.isArray(parsed.songs) && parsed.songs.length > 0 ? parsed.songs : DEFAULT_USER_SETTINGS.songs
    };
  } catch (e) {
    console.error("Failed to parse kantime_user_settings:", e);
    return JSON.parse(JSON.stringify(DEFAULT_USER_SETTINGS));
  }
}

function saveUserSettings(settings) {
  localStorage.setItem("kantime_user_settings", JSON.stringify(settings));
}

function applyHeaderTargetDate() {
  const settings = getUserSettings();
  const el = document.getElementById("headerSubtitle");
  if (el) {
    el.innerText = settings.targetDate || "Stake Choir Prep • Oct 24–25";
  }
}

// --- PRACTICE TIMER STATE & DURATION (CONFIGURABLE & TIMESTAMP-PERSISTED) ---
let timerDuration = 15 * 60; // Dynamic practice duration in seconds (defaults to 15m)
let timeRemaining = timerDuration;
let targetEndTime = null;
let timerInterval = null;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function applyTimerDuration(minutes, resetReadyClock = true) {
  const mins = Number(minutes) || 15;

  const titleEl = document.getElementById("practiceDurationTitle");
  if (titleEl) titleEl.innerText = mins;

  const subtextEl = document.getElementById("practiceInstructionSubtext");
  if (subtextEl) {
    subtextEl.innerText = `Hit Start, practice your parts, and complete the ${mins}-minute countdown to record your session.`;
  }

  // Update timer display and button if timer is in ready state
  if (!timerInterval && !targetEndTime) {
    const savedPaused = localStorage.getItem("kantime_paused_remaining");
    const btn = document.getElementById("timerBtn");

    if (resetReadyClock || !savedPaused) {
      timerDuration = mins * 60;
      timeRemaining = timerDuration;
      localStorage.removeItem("kantime_paused_remaining");
      const disp = document.getElementById("timerDisplay");
      if (disp) disp.innerText = formatTime(timeRemaining);
      if (btn) {
        btn.innerText = `Start ${mins}m Session`;
        btn.classList.remove("btn-outline");
        btn.classList.add("btn-primary");
      }
    } else {
      if (btn) btn.innerText = `Resume ${mins}m Session`;
    }
  }
}

function populateSongSelectDropdown() {
  const select = document.getElementById("targetSong");
  if (!select) return;

  const settings = getUserSettings();
  const songs = settings.songs || [];
  const savedSong = localStorage.getItem("kantime_target_song");

  let html = "";
  let matched = false;
  songs.forEach(s => {
    const isSelected = (savedSong === s.title || savedSong === s.id);
    if (isSelected) matched = true;
    const partLabel = s.part && s.part !== "All" ? ` (${s.part})` : "";
    html += `<option value="${escapeHtml(s.title)}" ${isSelected ? "selected" : ""}>${escapeHtml(s.title)}${escapeHtml(partLabel)}</option>`;
  });

  select.innerHTML = html;

  if (!matched && songs.length > 0) {
    select.value = songs[0].title;
    localStorage.setItem("kantime_target_song", songs[0].title);
  }
}

function getSongResource(songKeyOrTitle) {
  const settings = getUserSettings();
  const songs = settings.songs || [];
  let found = songs.find(s => s.id === songKeyOrTitle || s.title === songKeyOrTitle);
  if (!found && songs.length > 0) {
    found = songs[0];
  }
  return found;
}

function renderSelectedSongResource(songKey) {
  const container = document.getElementById("dynamicResourceContainer");
  if (!container) return;

  const song = getSongResource(songKey);
  if (!song) {
    container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted); font-size:0.85rem;">No piece selected.</div>`;
    return;
  }

  let actionsHtml = "";

  if (song.sheetUrl) {
    const isGoogleDrive = song.sheetUrl.includes("drive.google.com");
    if (isGoogleDrive) {
      actionsHtml += `<button class="btn-link" type="button" onclick="openResourceModal('${escapeHtml(song.title)} (Sheet)', '${escapeHtml(song.sheetUrl)}', 'doc')">🎼 Preview Sheet (In-App)</button> `;
      const directFolderUrl = song.sheetUrl.replace('/embeddedfolderview', '/drive/folders').split('#')[0];
      actionsHtml += `<a class="btn-link" href="${escapeHtml(directFolderUrl)}" target="_blank" rel="noopener noreferrer">📁 Open Drive Folder ↗</a> `;
    } else {
      actionsHtml += `<a class="btn-link" href="${escapeHtml(song.sheetUrl)}" target="_blank" rel="noopener noreferrer">🎼 Interactive Sheet & Audio ↗</a> `;
    }
  }

  if (song.videoUrl) {
    const embedUrl = formatYouTubeEmbedUrl(song.videoUrl);
    actionsHtml += `<button class="btn-link" type="button" onclick="openResourceModal('${escapeHtml(song.title)} (Video)', '${escapeHtml(embedUrl)}', 'video')">▶️ Watch Video (In-App)</button> `;
  }

  let embedHtml = "";
  if (song.videoUrl) {
    const embedUrl = formatYouTubeEmbedUrl(song.videoUrl);
    embedHtml = `
      <div style="margin-top: 12px; border-radius: 8px; overflow: hidden; background: #000; position: relative; padding-bottom: 56.25%; height: 0;">
        <iframe src="${escapeHtml(embedUrl)}" style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
  }

  const isPrimary = (song.part || "").toLowerCase() === "primary" ? "primary-piece" : "";
  const tagStyle = isPrimary ? "style='color:var(--accent);'" : "";
  const mins = getUserSettings().timerMinutes || 15;
  const noteText = song.note !== undefined ? song.note : (song.sheetUrl ? `ℹ️ Opens in external tab. Your ${mins}-minute timer will keep running while you practice!` : "");
  const noteHtml = noteText ? `<div class="external-note">${escapeHtml(noteText)}</div>` : "";

  container.innerHTML = `
    <div class="song-item ${isPrimary} fade-in">
      <span class="song-tag" ${tagStyle}>${escapeHtml(song.part || 'Repertoire')}</span>
      <div class="song-title">${escapeHtml(song.title)}</div>
      <div class="song-actions">${actionsHtml}</div>
      ${noteHtml}
      ${embedHtml}
    </div>
  `;
}

function handleSongSelectionChange() {
  const selectedSong = document.getElementById("targetSong").value;
  localStorage.setItem("kantime_target_song", selectedSong);
  renderSelectedSongResource(selectedSong);
}


// --- PROFILE STORAGE & GATED DASHBOARD ACCESS ---
function updateActiveProfileDisplay(name, section, avatar) {
  const activeName = document.getElementById("activeProfileName");
  const activeBadge = document.getElementById("activeProfileBadge");
  const avatarWrap = document.getElementById("activeProfileAvatarWrap");

  if (activeName) activeName.innerText = name;
  if (activeBadge) {
    activeBadge.innerText = section;
    activeBadge.setAttribute("data-voice", section);
  }

  // 40x40px avatar badge in header banner
  if (avatarWrap) {
    if (avatar && avatar.trim()) {
      const src = getAvatarImgSrc(avatar);
      avatarWrap.innerHTML = `
        <img src="${src}" 
             alt="${name}" 
             class="banner-avatar-badge" 
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="banner-avatar-badge avatar-fallback" style="display:none;" title="${name}">🎵</div>
      `;
    } else {
      avatarWrap.innerHTML = `
        <div class="banner-avatar-badge avatar-fallback" title="${name}">🎵</div>
      `;
    }
  }
}

function loadProfile() {
  applyHeaderTargetDate();
  applyTimerDuration(getUserSettings().timerMinutes, false);
  populateSongSelectDropdown();

  const savedName = localStorage.getItem("choir_name");
  const savedSection = localStorage.getItem("choir_voice") || localStorage.getItem("choir_section");
  const savedAvatar = localStorage.getItem("choir_avatar") || "";
  const profileCard = document.getElementById("profileCard");
  const activeBanner = document.getElementById("activeProfileBanner");
  const mainDashboard = document.getElementById("mainDashboard");
  const cancelBtn = document.getElementById("cancelProfileBtn");

  renderAvatarPicker(savedAvatar);

  if (savedName && savedSection) {
    document.getElementById("memberName").value = savedName;
    document.getElementById("memberSection").value = savedSection;
    updateActiveProfileDisplay(savedName, savedSection, savedAvatar);

    profileCard.style.display = "none";
    activeBanner.style.display = "flex";
    mainDashboard.style.display = "block";

    if (cancelBtn) cancelBtn.style.display = "inline-flex";

    const targetSelect = document.getElementById("targetSong");
    const activeSong = (targetSelect && targetSelect.value) ? targetSelect.value : (localStorage.getItem("kantime_target_song") || "");
    renderSelectedSongResource(activeSong);

    loadLeaderboard();
  } else {
    profileCard.style.display = "block";
    activeBanner.style.display = "none";
    mainDashboard.style.display = "none";
    if (cancelBtn) cancelBtn.style.display = "none";
  }
}

function handleProfileSubmit() {
  const name = document.getElementById("memberName").value.trim();
  const section = document.getElementById("memberSection").value;
  const avatar = selectedAvatarFile;

  if (!name) {
    alert("Please enter your full name first!");
    document.getElementById("memberName").focus();
    return;
  }
  if (!section) {
    alert("Please select your voice part (Soprano, Alto, Tenor, Bass, or Primary)!");
    document.getElementById("memberSection").focus();
    return;
  }

  localStorage.setItem("choir_name", name);
  localStorage.setItem("choir_section", section);
  localStorage.setItem("choir_voice", section);
  if (avatar) {
    localStorage.setItem("choir_avatar", avatar);
  } else {
    localStorage.removeItem("choir_avatar");
  }

  updateActiveProfileDisplay(name, section, avatar);

  document.getElementById("profileCard").style.display = "none";
  document.getElementById("activeProfileBanner").style.display = "flex";
  
  const dashboard = document.getElementById("mainDashboard");
  dashboard.style.display = "block";

  const cancelBtn = document.getElementById("cancelProfileBtn");
  if (cancelBtn) cancelBtn.style.display = "inline-flex";

  const currentSong = document.getElementById("targetSong").value || "Know This, That Every Soul Is Free";
  renderSelectedSongResource(currentSong);

  showToast("Profile updated!");
  loadLeaderboard();
  initEncouragementBanner();

  // Smoothly scroll down to the practice workspace
  const practiceWorkspace = document.getElementById("practiceWorkspace");
  if (practiceWorkspace) {
    practiceWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function saveProfileFromSettings() {
  const nameInput = document.getElementById("settingMemberName");
  const sectionSelect = document.getElementById("settingMemberSection");
  const name = nameInput ? nameInput.value.trim() : "";
  const section = sectionSelect ? sectionSelect.value : "";
  const avatar = selectedSettingAvatarFile;

  if (!name) {
    alert("Please enter your full name!");
    if (nameInput) nameInput.focus();
    return false;
  }
  if (!section) {
    alert("Please select your choir voice part (Soprano, Alto, Tenor, Bass, or Primary)!");
    if (sectionSelect) sectionSelect.focus();
    return false;
  }

  localStorage.setItem("choir_name", name);
  localStorage.setItem("choir_section", section);
  localStorage.setItem("choir_voice", section);
  if (avatar) {
    localStorage.setItem("choir_avatar", avatar);
  } else {
    localStorage.removeItem("choir_avatar");
  }

  // Synchronize in-page form inputs & avatar if present
  const pageNameInput = document.getElementById("memberName");
  if (pageNameInput) pageNameInput.value = name;
  const pageSecSelect = document.getElementById("memberSection");
  if (pageSecSelect) pageSecSelect.value = section;
  renderAvatarPicker(avatar);

  updateActiveProfileDisplay(name, section, avatar);

  // If page was in setup mode, reveal dashboard and banner
  const profileCard = document.getElementById("profileCard");
  if (profileCard) profileCard.style.display = "none";
  const activeBanner = document.getElementById("activeProfileBanner");
  if (activeBanner) activeBanner.style.display = "flex";
  const mainDashboard = document.getElementById("mainDashboard");
  if (mainDashboard) mainDashboard.style.display = "block";

  const targetSelect = document.getElementById("targetSong");
  const currentSong = (targetSelect && targetSelect.value) ? targetSelect.value : (localStorage.getItem("kantime_target_song") || "");
  if (currentSong) renderSelectedSongResource(currentSong);

  loadLeaderboard();
  showToast("Profile & Voice updated! ✨");
  return true;
}

function switchProfile() {
  const inactModal = document.getElementById("inactivityModal");
  if (inactModal) inactModal.classList.remove("active");
  isIdleModalOpen = false;

  openSettingsModal('profile');
}

function cancelProfileEdit() {
  const savedName = localStorage.getItem("choir_name");
  const savedSection = localStorage.getItem("choir_voice") || localStorage.getItem("choir_section");
  const savedAvatar = localStorage.getItem("choir_avatar") || "";

  if (savedName && savedSection) {
    document.getElementById("memberName").value = savedName;
    document.getElementById("memberSection").value = savedSection;
    updateActiveProfileDisplay(savedName, savedSection, savedAvatar);

    document.getElementById("profileCard").style.display = "none";
    document.getElementById("activeProfileBanner").style.display = "flex";
    document.getElementById("mainDashboard").style.display = "block";
  }
}

function validateUser() {
  const name = document.getElementById("memberName").value.trim();
  const section = document.getElementById("memberSection").value;
  if (!name || !section) {
    alert("Please confirm your name and voice part before starting!");
    switchProfile();
    return false;
  }
  return true;
}

// --- INACTIVITY / IDLE DETECTION SYSTEM (Typing.com style) ---
const IDLE_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes (300,000 ms)
const IDLE_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
let idleTimerId = null;
let lastActivityTime = Date.now();
let isIdleTrackingActive = false;
let isIdleModalOpen = false;
let lastThrottleTime = 0;

function getFirstName(fullName) {
  if (!fullName) return "Singer";
  const clean = fullName.trim();
  const parts = clean.split(/\s+/);
  return parts[0] || "Singer";
}

function handleUserInteraction() {
  const now = Date.now();
  // Throttle interaction checks to max once per second
  if (now - lastThrottleTime < 1000) return;
  lastThrottleTime = now;

  // Do not reset while the inactivity modal is open
  if (isIdleModalOpen) return;

  lastActivityTime = now;
  localStorage.setItem("kantime_last_activity", now);

  // If practice timer is currently running, reset the 5m countdown
  if (timerInterval && targetEndTime) {
    if (idleTimerId) {
      clearTimeout(idleTimerId);
    }
    idleTimerId = setTimeout(triggerInactivityTimeout, IDLE_TIMEOUT_MS);
  }
}

function startIdleTracking() {
  if (!timerInterval && !targetEndTime) return; // Only track while active practice session is running

  lastActivityTime = Date.now();
  localStorage.setItem("kantime_last_activity", lastActivityTime);

  if (!isIdleTrackingActive) {
    isIdleTrackingActive = true;
    IDLE_EVENTS.forEach(evt => {
      window.addEventListener(evt, handleUserInteraction, { passive: true });
    });
  }

  if (idleTimerId) {
    clearTimeout(idleTimerId);
  }
  idleTimerId = setTimeout(triggerInactivityTimeout, IDLE_TIMEOUT_MS);
}

function stopIdleTracking() {
  if (isIdleTrackingActive) {
    isIdleTrackingActive = false;
    IDLE_EVENTS.forEach(evt => {
      window.removeEventListener(evt, handleUserInteraction);
    });
  }

  if (idleTimerId) {
    clearTimeout(idleTimerId);
    idleTimerId = null;
  }
}

function triggerInactivityTimeout() {
  // Only trigger when timer is active
  if (!timerInterval && !targetEndTime) return;

  // 1. Pause active practice countdown timer (preserve remaining time)
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  if (targetEndTime) {
    timeRemaining = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
  }
  targetEndTime = null;
  localStorage.removeItem("kantime_target_end");
  localStorage.setItem("kantime_paused_remaining", timeRemaining);

  const timerDisp = document.getElementById("timerDisplay");
  if (timerDisp) timerDisp.innerText = formatTime(timeRemaining);

  const curMins = getUserSettings().timerMinutes || 15;
  const btn = document.getElementById("timerBtn");
  if (btn) {
    btn.innerText = `Resume ${curMins}m Session`;
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-primary");
  }

  stopIdleTracking();

  // 2. Open inactivity modal
  openInactivityModal();
}

function openInactivityModal() {
  isIdleModalOpen = true;
  const modal = document.getElementById("inactivityModal");
  if (!modal) return;

  const fullName = localStorage.getItem("choir_name") || "Singer";
  const firstName = getFirstName(fullName);
  const avatar = localStorage.getItem("choir_avatar") || "";

  const titleEl = document.getElementById("inactivityTitle");
  if (titleEl) {
    titleEl.innerText = `Are you still practicing, ${firstName}?`;
  }

  const avatarWrap = document.getElementById("inactivityAvatarWrap");
  if (avatarWrap) {
    if (avatar && avatar.trim()) {
      const src = getAvatarImgSrc(avatar);
      avatarWrap.innerHTML = `
        <img src="${src}" alt="${firstName}" class="inactivity-avatar-circle" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
        <div class="inactivity-avatar-circle avatar-fallback" style="display:none;" title="${firstName}">🎵</div>
      `;
    } else {
      avatarWrap.innerHTML = `
        <div class="inactivity-avatar-circle avatar-fallback" title="${firstName}">🎵</div>
      `;
    }
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function dismissInactivityModal(resumeSession) {
  isIdleModalOpen = false;
  const modal = document.getElementById("inactivityModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";

  if (resumeSession) {
    // Resume countdown timer
    if (timeRemaining > 0) {
      targetEndTime = Date.now() + (timeRemaining * 1000);
      localStorage.setItem("kantime_target_end", targetEndTime);
      localStorage.setItem("kantime_target_song", document.getElementById("targetSong").value);
      localStorage.removeItem("kantime_paused_remaining");

      const btn = document.getElementById("timerBtn");
      if (btn) {
        btn.innerText = "Pause Session";
        btn.classList.remove("btn-primary");
        btn.classList.add("btn-outline");
      }

      updateTimerTick();
      timerInterval = setInterval(updateTimerTick, 500);
      startIdleTracking();
      showToast("Resumed! Keep going! 🎶");
    }
  } else {
    // Keep session paused
    stopIdleTracking();
    showToast("Session paused.");
  }
}

function closeInactivityOnBackdrop(e) {
  if (e.target.id === "inactivityModal") {
    dismissInactivityModal(false);
  }
}

function checkInactivityOnRestore() {
  const savedTargetEnd = localStorage.getItem("kantime_target_end");
  if (!savedTargetEnd) return false;

  const now = Date.now();
  const savedLastActivity = Number(localStorage.getItem("kantime_last_activity") || now);
  const elapsedSinceActivity = now - savedLastActivity;

  // If user was away / inactive for >= 5 minutes while timer was running
  if (elapsedSinceActivity >= IDLE_TIMEOUT_MS) {
    // Session is credited only up to the 5-minute inactivity boundary
    const idlePauseTime = savedLastActivity + IDLE_TIMEOUT_MS;
    const remainingMs = Math.max(0, Number(savedTargetEnd) - idlePauseTime);
    timeRemaining = Math.max(0, Math.ceil(remainingMs / 1000));

    targetEndTime = null;
    localStorage.removeItem("kantime_target_end");
    localStorage.setItem("kantime_paused_remaining", timeRemaining);

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }

    const timerDisp = document.getElementById("timerDisplay");
    if (timerDisp) timerDisp.innerText = formatTime(timeRemaining);

    const curMins = getUserSettings().timerMinutes || 15;
    const btn = document.getElementById("timerBtn");
    if (btn) {
      btn.innerText = `Resume ${curMins}m Session`;
      btn.classList.remove("btn-outline");
      btn.classList.add("btn-primary");
    }

    stopIdleTracking();
    openInactivityModal();
    return true;
  }
  return false;
}

// --- ENCOURAGING CHOIR QUOTES & MILESTONE SYSTEM ---
const CHOIR_ENCOURAGEMENT_QUOTES = [
  "The song of the righteous is a prayer unto Him.",
  "Every note you practice lifts the entire choir.",
  "Tenors & Basses, Sopranos & Altos—united in one voice.",
  "Consistency turns good music into sacred praise.",
  "You don't have to be perfect; you just have to sing with heart.",
  "Thank you for sharing your time and talent today!",
  "Music has the power to invite the Spirit into every heart.",
  "Faithful rehearsal brings celestial harmony on Sunday.",
  "Lift up your voice with strength, be not afraid!",
  "A prepared choir is a choir that ministers with power."
];

const HALFWAY_ENCOURAGEMENT_QUOTES = [
  "Halfway there! Your voice makes a difference!",
  "50% completed! Sounding wonderful—keep it going!",
  "Halfway point reached! Your dedication blesses the choir!",
  "Over the hump! Every minute of practice counts!"
];

const CELEBRATION_MESSAGES = [
  "Thank you for sharing your time and talent today! Every note lifts the entire choir.",
  "Sacred music begins with faithful practice. Thank you for your dedication!",
  "Your devotion to choir rehearsal strengthens our whole congregation.",
  "Well done! Beautiful harmony is built one faithful practice session at a time."
];

let isHalfwayTriggered = false;

function getSessionHistory() {
  try {
    const raw = localStorage.getItem("kantime_session_history");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function recordCompletedSession(mins) {
  const history = getSessionHistory();
  const now = Date.now();
  history.push({ timestamp: now, minutes: mins });
  if (history.length > 100) history.splice(0, history.length - 100);
  localStorage.setItem("kantime_session_history", JSON.stringify(history));
}

function getWeekSessionStats() {
  const history = getSessionHistory();
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  const weekSessions = history.filter(item => item.timestamp >= oneWeekAgo);
  return {
    totalSessions: history.length,
    weekCount: weekSessions.length
  };
}

function showEncouragementBanner(text, icon = "🎵", mode = "normal") {
  const banner = document.getElementById("encouragementBanner");
  const iconEl = document.getElementById("encouragementIcon");
  const textEl = document.getElementById("encouragementText");
  if (!banner || !textEl) return;

  banner.className = "encouragement-banner" + (mode !== "normal" ? " " + mode : "");
  if (iconEl) iconEl.innerText = icon;
  textEl.innerText = `"${text}"`;
  banner.style.display = "inline-flex";
}

function hideEncouragementBanner() {
  const banner = document.getElementById("encouragementBanner");
  if (banner) banner.style.display = "none";
}

function initEncouragementBanner() {
  const banner = document.getElementById("encouragementBanner");
  if (!banner) return;

  const savedTargetEnd = localStorage.getItem("kantime_target_end");
  const savedPaused = localStorage.getItem("kantime_paused_remaining");
  const curMins = getUserSettings().timerMinutes || 15;
  const totalSecs = curMins * 60;

  if (savedTargetEnd) {
    const diff = Math.max(0, Math.ceil((Number(savedTargetEnd) - Date.now()) / 1000));
    if (diff <= totalSecs / 2) {
      isHalfwayTriggered = true;
      showEncouragementBanner("Halfway there! Your voice makes a difference!", "✨", "halfway");
      return;
    }
  } else if (savedPaused && Number(savedPaused) < totalSecs) {
    if (Number(savedPaused) <= totalSecs / 2) {
      isHalfwayTriggered = true;
      showEncouragementBanner("Halfway there! Your voice makes a difference!", "✨", "halfway");
      return;
    }
  }

  // Pre-session welcome state: acknowledge streak if member has >= 2 sessions this week
  const stats = getWeekSessionStats();
  if (stats && stats.weekCount >= 2) {
    showEncouragementBanner(`${stats.weekCount} sessions this week—thank you for your dedication!`, "🔥", "normal");
  } else {
    const quote = CHOIR_ENCOURAGEMENT_QUOTES[Math.floor(Math.random() * CHOIR_ENCOURAGEMENT_QUOTES.length)];
    showEncouragementBanner(quote, "🎵", "normal");
  }
}

function openCompletionModal(mins, stats) {
  const modal = document.getElementById("completionModal");
  if (!modal) {
    alert(`🎉 Session Complete! You've logged ${mins} minutes of solid practice!`);
    return;
  }

  const badge = document.getElementById("completionDurationBadge");
  if (badge) badge.innerText = `⭐ ${mins} Minutes Logged`;

  const msgEl = document.getElementById("completionCelebrationMessage");
  if (msgEl) {
    const praise = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
    msgEl.innerText = `"${praise}"`;
  }

  const streakPill = document.getElementById("completionStreakPill");
  const streakCount = document.getElementById("completionStreakCount");
  if (streakPill && streakCount) {
    if (stats && stats.weekCount >= 2) {
      streakCount.innerText = `${stats.weekCount} sessions this week`;
      streakPill.style.display = "inline-flex";
    } else {
      streakPill.style.display = "none";
    }
  }

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeCompletionModal() {
  const modal = document.getElementById("completionModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function closeCompletionModalOnBackdrop(e) {
  if (e.target.id === "completionModal") {
    closeCompletionModal();
  }
}

function updateTimerTick() {
  if (!targetEndTime) return;
  const now = Date.now();
  const diffMs = targetEndTime - now;
  timeRemaining = Math.max(0, Math.ceil(diffMs / 1000));
  document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);

  const curMins = getUserSettings().timerMinutes || 15;
  const totalSecs = curMins * 60;

  // Dynamic Trigger: Halfway Mark (50%)
  if (!isHalfwayTriggered && timeRemaining <= (totalSecs / 2) && timeRemaining > 0) {
    isHalfwayTriggered = true;
    localStorage.setItem("kantime_halfway_triggered", "true");
    const halfwayQuote = HALFWAY_ENCOURAGEMENT_QUOTES[Math.floor(Math.random() * HALFWAY_ENCOURAGEMENT_QUOTES.length)];
    showEncouragementBanner(halfwayQuote, "✨", "halfway");
    showToast("✨ Halfway there! Your voice makes a difference! 🎶");
  }

  if (timeRemaining <= 0) {
    completeTimerSession();
  }
}

function completeTimerSession() {
  stopIdleTracking();
  const modal = document.getElementById("inactivityModal");
  if (modal) modal.classList.remove("active");
  isIdleModalOpen = false;

  const currentDurationMins = getUserSettings().timerMinutes || 15;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  targetEndTime = null;
  timerDuration = currentDurationMins * 60;
  timeRemaining = timerDuration;
  isHalfwayTriggered = false;
  localStorage.removeItem("kantime_target_end");
  localStorage.removeItem("kantime_target_song");
  localStorage.removeItem("kantime_paused_remaining");
  localStorage.removeItem("kantime_last_activity");
  localStorage.removeItem("kantime_halfway_triggered");

  document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);

  const btn = document.getElementById("timerBtn");
  if (btn) {
    btn.innerText = `Start ${currentDurationMins}m Session`;
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-primary");
  }

  // Record completed session in history for consistency tracking
  recordCompletedSession(currentDurationMins);
  const stats = getWeekSessionStats();

  // Dynamic Trigger: Session Complete Milestone Banner
  const celebrationPraise = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
  showEncouragementBanner(celebrationPraise, "🎉", "milestone");

  // Dynamic Trigger: Session Complete Celebration Modal
  openCompletionModal(currentDurationMins, stats);

  submitPracticeSession(currentDurationMins);
}

function restoreTimerState() {
  if (isIdleModalOpen) return;

  const currentDurationMins = getUserSettings().timerMinutes || 15;
  const savedTargetEnd = localStorage.getItem("kantime_target_end");
  const btn = document.getElementById("timerBtn");
  const savedSong = localStorage.getItem("kantime_target_song");
  if (savedSong && document.getElementById("targetSong")) {
    document.getElementById("targetSong").value = savedSong;
  }

  if (savedTargetEnd) {
    // Check if idle timeout elapsed while tab was inactive or backgrounded
    if (checkInactivityOnRestore()) {
      return;
    }

    const savedEndTime = Number(savedTargetEnd);
    const now = Date.now();

    if (now < savedEndTime) {
      // Timer is running
      targetEndTime = savedEndTime;
      timeRemaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);

      btn.innerText = "Pause Session";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");

      if (!timerInterval) {
        timerInterval = setInterval(updateTimerTick, 500);
      }

      startIdleTracking();
    } else {
      completeTimerSession();
    }
  } else {
    // Paused state
    stopIdleTracking();
    const savedPaused = localStorage.getItem("kantime_paused_remaining");
    if (savedPaused && Number(savedPaused) > 0 && Number(savedPaused) < timerDuration) {
      timeRemaining = Number(savedPaused);
      document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);
      btn.innerText = `Resume ${currentDurationMins}m Session`;
      btn.classList.remove("btn-outline");
      btn.classList.add("btn-primary");
    } else {
      timerDuration = currentDurationMins * 60;
      timeRemaining = timerDuration;
      document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);
      btn.innerText = `Start ${currentDurationMins}m Session`;
      btn.classList.remove("btn-outline");
      btn.classList.add("btn-primary");
    }
  }

  initEncouragementBanner();
}

function toggleTimer() {
  if (!validateUser()) return;

  const currentDurationMins = getUserSettings().timerMinutes || 15;
  const btn = document.getElementById("timerBtn");
  if (timerInterval) {
    // Pause timer
    clearInterval(timerInterval);
    timerInterval = null;
    if (targetEndTime) {
      timeRemaining = Math.max(0, Math.ceil((targetEndTime - Date.now()) / 1000));
    }
    targetEndTime = null;
    localStorage.removeItem("kantime_target_end");
    localStorage.setItem("kantime_paused_remaining", timeRemaining);

    document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);
    btn.innerText = `Resume ${currentDurationMins}m Session`;
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-primary");

    stopIdleTracking();
  } else {
    // Start or Resume timer
    targetEndTime = Date.now() + (timeRemaining * 1000);
    localStorage.setItem("kantime_target_end", targetEndTime);
    localStorage.setItem("kantime_target_song", document.getElementById("targetSong").value);
    localStorage.removeItem("kantime_paused_remaining");

    btn.innerText = "Pause Session";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");

    // Dynamic Encouragement Trigger: Session Start
    const totalSecs = currentDurationMins * 60;
    if (timeRemaining > (totalSecs / 2)) {
      isHalfwayTriggered = false;
      const stats = getWeekSessionStats();
      if (stats.weekCount >= 3 && Math.random() < 0.35) {
        showEncouragementBanner(`${stats.weekCount} sessions this week—thank you for your dedication!`, "🔥", "normal");
      } else {
        const randomQuote = CHOIR_ENCOURAGEMENT_QUOTES[Math.floor(Math.random() * CHOIR_ENCOURAGEMENT_QUOTES.length)];
        showEncouragementBanner(randomQuote, "🎵", "normal");
      }
    } else {
      showEncouragementBanner("Halfway there! Your voice makes a difference!", "✨", "halfway");
    }

    updateTimerTick();
    timerInterval = setInterval(updateTimerTick, 500);

    startIdleTracking();
  }
}

// Tab and browser focus handlers
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    restoreTimerState();
  }
});
window.addEventListener("focus", () => {
  restoreTimerState();
});


function showToast(msg) {
  const t = document.getElementById("toast");
  if (!t) return;
  t.innerText = msg;
  t.style.display = "block";
  setTimeout(() => { t.style.display = "none"; }, 3000);
}

// --- SUBMIT PRACTICE LOG TO GOOGLE SHEETS ---
function submitPracticeSession(minutes) {
  const name = document.getElementById("memberName").value.trim();
  const section = document.getElementById("memberSection").value;
  const song = document.getElementById("targetSong").value;
  const avatar = localStorage.getItem("choir_avatar") || "";

  showToast("Logging session...");

  const payload = {
    name: name,
    section: section,
    song: song,
    minutes: minutes,
    avatar: avatar
  };

  fetch(APPS_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(() => {
      showToast("Logged! Salamat sa practice! 🔥");
      setTimeout(loadLeaderboard, 1500);
    })
    .catch(err => {
      showToast("Error logging. Please check connection.");
      console.error(err);
    });
}

// --- LOAD LEADERBOARDS (TOP 10 & SECTIONS) ---
function loadLeaderboard() {
  fetch(APPS_SCRIPT_URL)
    .then(res => res.json())
    .then(data => {
      const topSingersEl = document.getElementById("topSingersList");
      const sectionEl = document.getElementById("sectionList");

      if (!data || data.length === 0) {
        if (topSingersEl) {
          topSingersEl.innerHTML = `<div style="text-align:center; padding:8px; font-size:0.85rem; color:var(--text-muted);">No practice sessions logged yet. Be the first!</div>`;
        }
        if (sectionEl) {
          sectionEl.innerHTML = `<div style="text-align:center; padding:8px; font-size:0.85rem; color:var(--text-muted);">No section data yet.</div>`;
        }
        return;
      }

      // 1. Group by Individual Singer
      const singerTotals = {};
      // 2. Group by Section
      const sectionTotals = { "Soprano": 0, "Alto": 0, "Tenor": 0, "Bass": 0, "Primary": 0 };

      data.forEach(entry => {
        const trimmedName = (entry.name || "Unknown").trim();
        const sec = entry.section || "Choir";
        const mins = Number(entry.minutes) || 0;
        const av = (entry.avatar || "").trim();

        if (!singerTotals[trimmedName]) {
          singerTotals[trimmedName] = { 
            name: trimmedName, 
            section: sec, 
            avatar: av, 
            totalMins: 0 
          };
        } else {
          // Update avatar if a later entry has one recorded
          if (av) {
            singerTotals[trimmedName].avatar = av;
          }
        }
        singerTotals[trimmedName].totalMins += mins;

        if (sectionTotals[sec] !== undefined) {
          sectionTotals[sec] += mins;
        }
      });

      // Render Top 10 Singers with 28x28px circular avatars
      const sortedSingers = Object.values(singerTotals).sort((a, b) => b.totalMins - a.totalMins).slice(0, 10);
      const currentUserName = (localStorage.getItem("choir_name") || "").trim().toLowerCase();
      const currentUserAvatar = localStorage.getItem("choir_avatar") || "";

      let singersHtml = "";
      sortedSingers.forEach((s, idx) => {
        const isTop3 = idx < 3 ? "rank-top3" : "";
        const medal = idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : idx === 2 ? "🥉 " : "";
        const hours = (s.totalMins / 60).toFixed(1);

        // Fallback to local avatar if current signed-in user hasn't logged a new session with avatar yet
        let avatarToShow = s.avatar;
        if (!avatarToShow && currentUserName && s.name.toLowerCase() === currentUserName) {
          avatarToShow = currentUserAvatar;
        }

        const avatarBadgeHtml = getLeaderboardAvatarHtml(avatarToShow, s.name);

        singersHtml += `
          <div class="board-row">
            <span class="rank ${isTop3}">${medal}#${idx + 1}</span>
            ${avatarBadgeHtml}
            <div style="flex:1; min-width:0; padding-right:6px;">
              <strong style="font-size:0.92rem;">${s.name}</strong>
              <span class="part-badge" data-voice="${s.section}">${s.section}</span>
            </div>
            <span class="mins-badge">${s.totalMins}m <span style="font-weight:400; font-size:0.75rem; color:var(--text-muted);">(${hours}h)</span></span>
          </div>
        `;
      });
      if (topSingersEl) topSingersEl.innerHTML = singersHtml;

      // Render Section Standings
      const sortedSections = Object.entries(sectionTotals).sort((a, b) => b[1] - a[1]);
      let sectionHtml = "";
      sortedSections.forEach(([sec, mins], idx) => {
        const isTop3 = idx < 3 ? "rank-top3" : "";
        const medal = idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : idx === 2 ? "🥉 " : "";
        const hours = (mins / 60).toFixed(1);
        sectionHtml += `
          <div class="board-row">
            <span class="rank ${isTop3}">${medal}#${idx + 1}</span>
            <div style="flex:1; display:flex; align-items:center; min-width:0;">
              <span style="font-weight:700;">${sec}</span>
              <span class="part-badge" data-voice="${sec}">Section</span>
            </div>
            <span class="mins-badge">${mins}m <span style="font-weight:400; font-size:0.75rem; color:var(--text-muted);">(${hours}h)</span></span>
          </div>
        `;
      });
      if (sectionEl) sectionEl.innerHTML = sectionHtml;

    })
    .catch(() => {
      const topSingersEl = document.getElementById("topSingersList");
      if (topSingersEl) {
        topSingersEl.innerHTML = `<div style="text-align:center; color:var(--text-muted); font-size:0.85rem;">Could not load standings.</div>`;
      }
    });
}

// --- IN-APP RESOURCE VIEWER MODAL ---
function openResourceModal(title, url, type) {
  const modal = document.getElementById("resourceModal");
  const modalTitle = document.getElementById("modalTitle");
  const iframe = document.getElementById("resourceIframe");
  const wrapper = document.getElementById("modalWrapper");

  if (modalTitle) modalTitle.innerText = title;
  if (iframe) iframe.src = url;
  if (wrapper) {
    if (type === 'doc') {
      wrapper.classList.add('doc-view');
    } else {
      wrapper.classList.remove('doc-view');
    }
  }
  if (modal) modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeResourceModal() {
  const modal = document.getElementById("resourceModal");
  const iframe = document.getElementById("resourceIframe");
  if (modal) modal.classList.remove("active");
  if (iframe) iframe.src = "";
  document.body.style.overflow = "";
}

function closeModalOnBackdrop(e) {
  if (e.target.id === "resourceModal") {
    closeResourceModal();
  }
}

// --- PERSONAL SETTINGS & REPERTOIRE EDITOR MODAL ---
function openSettingsModal(defaultTab = 'profile') {
  const modal = document.getElementById("settingsModal");
  if (!modal) return;

  // 1. Populate Profile Tab inputs
  const savedName = localStorage.getItem("choir_name") || "";
  const savedVoice = localStorage.getItem("choir_voice") || localStorage.getItem("choir_section") || "";
  const savedAvatar = localStorage.getItem("choir_avatar") || "";

  const nameInput = document.getElementById("settingMemberName");
  if (nameInput) nameInput.value = savedName;

  const sectionSelect = document.getElementById("settingMemberSection");
  if (sectionSelect) sectionSelect.value = savedVoice;

  renderSettingAvatarPicker(savedAvatar);

  // 2. Populate Preferences & Repertoire Tab inputs
  const settings = getUserSettings();
  const targetDateInput = document.getElementById("settingTargetDate");
  if (targetDateInput) {
    targetDateInput.value = settings.targetDate || "";
  }

  const timerDurSelect = document.getElementById("settingTimerDuration");
  if (timerDurSelect) {
    timerDurSelect.value = settings.timerMinutes || 15;
  }

  closeSongForm();
  renderRepertoireList();

  // 3. Switch to target tab (defaults to 'profile' or 'preferences')
  switchSettingsTab(defaultTab || 'profile');

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeSettingsModal() {
  // Check if user made unsaved profile changes in Settings and auto-commit if valid
  const nameInput = document.getElementById("settingMemberName");
  const sectionSelect = document.getElementById("settingMemberSection");
  if (nameInput && sectionSelect) {
    const curName = nameInput.value.trim();
    const curSec = sectionSelect.value;
    const savedName = localStorage.getItem("choir_name") || "";
    const savedSec = localStorage.getItem("choir_voice") || localStorage.getItem("choir_section") || "";
    const savedAv = localStorage.getItem("choir_avatar") || "";

    if (curName && curSec && (curName !== savedName || curSec !== savedSec || selectedSettingAvatarFile !== savedAv)) {
      saveProfileFromSettings();
    }
  }

  // Ensure any newly selected duration value is applied
  const timerDurSelect = document.getElementById("settingTimerDuration");
  if (timerDurSelect) {
    const selectedMins = Number(timerDurSelect.value) || 15;
    const settings = getUserSettings();
    if (settings.timerMinutes !== selectedMins) {
      handleTimerDurationChange(selectedMins);
    }
  }

  const modal = document.getElementById("settingsModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function closeSettingsOnBackdrop(e) {
  if (e.target.id === "settingsModal") {
    closeSettingsModal();
  }
}

function switchSettingsTab(tabName) {
  const tabs = ["profile", "preferences", "tutorial"];
  const target = tabs.includes(tabName) ? tabName : "profile";

  const tabBtns = {
    profile: document.getElementById("tabBtnProfile"),
    preferences: document.getElementById("tabBtnPreferences"),
    tutorial: document.getElementById("tabBtnTutorial")
  };

  const tabPanels = {
    profile: document.getElementById("tabPanelProfile"),
    preferences: document.getElementById("tabPanelPreferences"),
    tutorial: document.getElementById("tabPanelTutorial")
  };

  tabs.forEach(t => {
    const btn = tabBtns[t];
    const panel = tabPanels[t];
    const isCurrent = t === target;

    if (btn) {
      if (isCurrent) {
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");
        try {
          btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
        } catch (e) {}
      } else {
        btn.classList.remove("active");
        btn.setAttribute("aria-selected", "false");
      }
    }

    if (panel) {
      panel.style.display = isCurrent ? "block" : "none";
      if (isCurrent) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    }
  });
}

function handleTargetDateInput(val) {
  const subtitleEl = document.getElementById("headerSubtitle");
  const displayVal = val.trim() ? val : "Stake Choir Prep • Oct 24–25";
  if (subtitleEl) {
    subtitleEl.innerText = displayVal;
  }
  const settings = getUserSettings();
  settings.targetDate = val;
  saveUserSettings(settings);
}

function handleTimerDurationChange(val) {
  const newMins = Number(val) || 15;
  const settings = getUserSettings();
  const oldMins = settings.timerMinutes || 15;

  // If already matches current ready clock duration and not running, no-op
  if (newMins === oldMins && timeRemaining === newMins * 60 && !timerInterval && !targetEndTime) {
    return;
  }

  // If a session is currently running or paused with active progress, confirm reset
  const isRunning = Boolean(timerInterval || targetEndTime);
  const pausedVal = localStorage.getItem("kantime_paused_remaining");
  const hasPausedProgress = Boolean(pausedVal && Number(pausedVal) > 0 && Number(pausedVal) < timerDuration);
  const hasActiveSession = isRunning || hasPausedProgress;

  if (hasActiveSession) {
    const proceed = confirm("Changing practice duration will reset your current timer countdown. Do you wish to continue?");
    if (!proceed) {
      const select = document.getElementById("settingTimerDuration");
      if (select) select.value = oldMins;
      return;
    }

    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    targetEndTime = null;
    localStorage.removeItem("kantime_target_end");
    localStorage.removeItem("kantime_paused_remaining");
    stopIdleTracking();
  }

  settings.timerMinutes = newMins;
  saveUserSettings(settings);
  applyTimerDuration(newMins, true);

  const currentSong = document.getElementById("targetSong") ? document.getElementById("targetSong").value : "";
  if (currentSong) renderSelectedSongResource(currentSong);

  showToast(`Timer set to ${newMins} minutes! ⏱️`);
}

function renderRepertoireList() {
  const container = document.getElementById("repertoireListContainer");
  const countEl = document.getElementById("repertoireCount");
  if (!container) return;

  const settings = getUserSettings();
  const songs = settings.songs || [];
  if (countEl) countEl.innerText = songs.length;

  if (songs.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted); font-size:0.85rem;">No pieces in repertoire yet. Click "+ Add Song" above!</div>`;
    return;
  }

  let html = "";
  songs.forEach(song => {
    const partBadge = song.part && song.part !== "All"
      ? `<span class="part-badge" data-voice="${escapeHtml(song.part)}">${escapeHtml(song.part)}</span>`
      : `<span class="part-badge" style="background:#f1f5f9; color:#475569;">All Parts</span>`;

    const videoTag = song.videoUrl ? `<span class="link-tag">📹 Video</span>` : "";
    const sheetTag = song.sheetUrl ? `<span class="link-tag">🎼 Sheet</span>` : "";

    html += `
      <div class="repertoire-list-item">
        <div class="repertoire-item-info">
          <div class="repertoire-item-title-row">
            <strong>${escapeHtml(song.title)}</strong>
            ${partBadge}
          </div>
          <div class="repertoire-item-links">
            ${videoTag}
            ${sheetTag}
          </div>
        </div>
        <div class="repertoire-item-actions">
          <button type="button" class="btn-icon" onclick="openSongForm('${song.id}')" title="Edit piece" aria-label="Edit ${escapeHtml(song.title)}">✏️</button>
          <button type="button" class="btn-icon btn-icon-danger" onclick="deleteSong('${song.id}')" title="Delete piece" aria-label="Delete ${escapeHtml(song.title)}">🗑️</button>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function openSongForm(songId) {
  const formCard = document.getElementById("songEditorForm");
  const heading = document.getElementById("songFormHeading");
  const titleInput = document.getElementById("songFormTitle");
  const partSelect = document.getElementById("songFormPart");
  const videoInput = document.getElementById("songFormVideo");
  const sheetInput = document.getElementById("songFormSheet");
  const idInput = document.getElementById("editingSongId");

  if (!formCard) return;

  if (songId) {
    // Edit existing piece
    const settings = getUserSettings();
    const song = settings.songs.find(s => s.id === songId);
    if (!song) return;

    idInput.value = songId;
    heading.innerText = `✏️ Edit Repertoire Piece`;
    titleInput.value = song.title || "";
    partSelect.value = song.part || "All";
    videoInput.value = song.videoUrl || "";
    sheetInput.value = song.sheetUrl || "";
  } else {
    // Add new piece
    idInput.value = "";
    heading.innerText = `➕ Add New Repertoire Piece`;
    titleInput.value = "";
    partSelect.value = "All";
    videoInput.value = "";
    sheetInput.value = "";
  }

  formCard.style.display = "block";
  titleInput.focus();
  formCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeSongForm() {
  const formCard = document.getElementById("songEditorForm");
  if (formCard) formCard.style.display = "none";
}

function saveSongFromForm() {
  const title = document.getElementById("songFormTitle").value.trim();
  const part = document.getElementById("songFormPart").value;
  let videoUrl = document.getElementById("songFormVideo").value.trim();
  const sheetUrl = document.getElementById("songFormSheet").value.trim();
  const songId = document.getElementById("editingSongId").value;

  if (!title) {
    alert("Please enter a song title!");
    document.getElementById("songFormTitle").focus();
    return;
  }

  if (videoUrl) {
    videoUrl = formatYouTubeEmbedUrl(videoUrl);
  }

  const settings = getUserSettings();

  if (songId) {
    // Update existing
    const idx = settings.songs.findIndex(s => s.id === songId);
    if (idx !== -1) {
      settings.songs[idx] = {
        ...settings.songs[idx],
        title: title,
        part: part,
        videoUrl: videoUrl,
        sheetUrl: sheetUrl
      };
    }
  } else {
    // Add new song
    const newId = "song_" + Date.now();
    settings.songs.push({
      id: newId,
      title: title,
      part: part,
      videoUrl: videoUrl,
      sheetUrl: sheetUrl,
      note: sheetUrl ? `ℹ️ Opens in external tab. Your timer will keep running while you practice!` : ""
    });
  }

  saveUserSettings(settings);
  closeSongForm();
  renderRepertoireList();
  populateSongSelectDropdown();

  // If currently selected piece was edited or if it's the only one, update player
  const targetSelect = document.getElementById("targetSong");
  if (targetSelect) {
    if (!targetSelect.value || targetSelect.value === title) {
      targetSelect.value = title;
      localStorage.setItem("kantime_target_song", title);
    }
    renderSelectedSongResource(targetSelect.value);
  }

  showToast("Repertoire saved! 🎶");
}

function deleteSong(songId) {
  const settings = getUserSettings();
  const song = settings.songs.find(s => s.id === songId);
  if (!song) return;

  const confirmDelete = confirm(`Remove "${song.title}" from your personal repertoire?`);
  if (!confirmDelete) return;

  settings.songs = settings.songs.filter(s => s.id !== songId);
  saveUserSettings(settings);

  renderRepertoireList();
  populateSongSelectDropdown();

  const targetSelect = document.getElementById("targetSong");
  if (targetSelect) {
    renderSelectedSongResource(targetSelect.value);
  }

  showToast("Piece removed.");
}

function resetUserSettingsToDefault() {
  const confirmReset = confirm("Reset all your personal preferences, schedule target, and repertoire back to the default Stake Choir setup?");
  if (!confirmReset) return;

  localStorage.removeItem("kantime_user_settings");
  closeSongForm();

  // Apply default settings
  const defaults = getUserSettings();
  applyHeaderTargetDate();
  applyTimerDuration(defaults.timerMinutes, true);
  populateSongSelectDropdown();

  const targetSelect = document.getElementById("targetSong");
  if (targetSelect && defaults.songs.length > 0) {
    targetSelect.value = defaults.songs[0].title;
    localStorage.setItem("kantime_target_song", defaults.songs[0].title);
    renderSelectedSongResource(defaults.songs[0].title);
  }

  // Update Settings form inputs
  const targetDateInput = document.getElementById("settingTargetDate");
  if (targetDateInput) targetDateInput.value = defaults.targetDate;

  const timerDurSelect = document.getElementById("settingTimerDuration");
  if (timerDurSelect) timerDurSelect.value = defaults.timerMinutes;

  renderRepertoireList();

  showToast("Reset to Choir Defaults! ✨");
}

// --- EXPORT TUTORIAL GUIDE TO PDF ---
function exportTutorialToPdf() {
  showToast("Opening printable PDF guide... 📄");

  const settings = getUserSettings();
  const targetDate = settings.targetDate || "Stake Choir Prep • Oct 24–25";
  const year = new Date().getFullYear();
  const dateStr = new Date().toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const memberName = localStorage.getItem("choir_name") || "";
  const memberVoice = localStorage.getItem("choir_voice") || localStorage.getItem("choir_section") || "";
  const singerInfo = memberName ? `${escapeHtml(memberName)} (${escapeHtml(memberVoice || 'Choir Singer')})` : "";

  const printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>KanTime - Choir Member Practice Guide</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      line-height: 1.45;
      padding: 8px 10px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .guide-doc {
      max-width: 780px;
      margin: 0 auto;
    }
    .guide-header {
      border-bottom: 2.5px solid #1d4ed8;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .guide-header-title h1 {
      font-size: 19pt;
      font-weight: 850;
      color: #1e3a8a;
      letter-spacing: -0.5px;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .guide-header-title p {
      font-size: 10pt;
      color: #475569;
      font-weight: 600;
    }
    .guide-header-meta {
      text-align: right;
      font-size: 8.5pt;
      color: #64748b;
      line-height: 1.35;
    }
    .guide-header-meta strong {
      color: #1e293b;
    }
    .guide-intro {
      background: #f1f5f9;
      border-left: 4px solid #1d4ed8;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 9pt;
      color: #334155;
      margin-bottom: 14px;
      line-height: 1.4;
    }
    .steps-container {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .step-item {
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px 13px;
      background: #f8fafc;
      page-break-inside: avoid;
    }
    .step-header {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 4px;
    }
    .step-badge {
      font-size: 7.5pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      padding: 2px 7px;
      border-radius: 999px;
    }
    .badge-1 { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-2 { background: #f0fdfa; color: #0f766e; border: 1px solid #99f6e4; }
    .badge-3 { background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; }
    .badge-4 { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
    .badge-5 { background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; }
    .step-title {
      font-size: 10.5pt;
      font-weight: 750;
      color: #0f172a;
    }
    .step-desc {
      font-size: 9pt;
      color: #475569;
      line-height: 1.4;
    }
    .step-desc strong {
      color: #0f172a;
    }
    .step-desc em {
      font-style: normal;
      color: #1d4ed8;
      font-weight: 600;
    }
    .guide-footer {
      margin-top: 18px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="guide-doc">
    <div class="guide-header">
      <div class="guide-header-title">
        <h1>🎵 KanTime | Choir Member Practice Guide</h1>
        <p>${escapeHtml(targetDate)}</p>
      </div>
      <div class="guide-header-meta">
        <div>Stake Choir Practice Hub</div>
        ${singerInfo ? `<div>Member: <strong>${singerInfo}</strong></div>` : ''}
        <div>Date: ${dateStr}</div>
      </div>
    </div>

    <div class="guide-intro">
      Welcome to KanTime! Follow this 5-step guide to personalize your rehearsal routine, practice parts with dynamic audio/sheet resources, and track verified minutes for your choir section.
    </div>

    <div class="steps-container">
      <div class="step-item">
        <div class="step-header">
          <span class="step-badge badge-1">Step 1</span>
          <span class="step-title">Set Up Profile &amp; Avatar</span>
        </div>
        <div class="step-desc">
          Select your choir voice section (<strong>Soprano, Alto, Tenor, Bass, or Primary</strong>), enter your full name, and pick an illustrated choir portrait to represent you on the community leaderboards.
        </div>
      </div>

      <div class="step-item">
        <div class="step-header">
          <span class="step-badge badge-2">Step 2</span>
          <span class="step-title">Configure Preferences</span>
        </div>
        <div class="step-desc">
          Adjust your rehearsal timer block anywhere from <strong>5 to 60 minutes</strong> (15-minute default) and personalize your target Stake Conference or performance date in Practice Preferences.
        </div>
      </div>

      <div class="step-item">
        <div class="step-header">
          <span class="step-badge badge-3">Step 3</span>
          <span class="step-title">Practice &amp; Background Timer</span>
        </div>
        <div class="step-desc">
          Choose your rehearsal anthem and tap <strong>Start Session</strong>. Click <em>"🎼 Interactive Sheet &amp; Audio"</em> or <em>"▶️ Watch Video"</em>—the countdown timer continues accurately in the background while you sing along!
        </div>
      </div>

      <div class="step-item">
        <div class="step-header">
          <span class="step-badge badge-4">Step 4</span>
          <span class="step-title">Inactivity Auto-Pause</span>
        </div>
        <div class="step-desc">
          KanTime features automatic idle detection. If no interaction (mouse, touch, or keys) occurs for <strong>5 minutes</strong> during an active session, the timer pauses with an <em>"Are you still practicing?"</em> modal to keep recorded time honest.
        </div>
      </div>

      <div class="step-item">
        <div class="step-header">
          <span class="step-badge badge-5">Step 5</span>
          <span class="step-title">Leaderboards &amp; Standings</span>
        </div>
        <div class="step-desc">
          When the countdown reaches 00:00, your rehearsal minutes are submitted automatically to the Stake Choir Sheet, instantly updating the <strong>Top 10 Dedicated Singers</strong> and the <strong>Section Standings</strong>.
        </div>
      </div>
    </div>

    <div class="guide-footer">
      <div>&copy; ${year} James Phillip De Guzman • Stake Choir Practice Hub</div>
      <div>Official KanTime Member Handout</div>
    </div>
  </div>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(printHtml);
  doc.close();

  setTimeout(() => {
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => {
      if (iframe.parentNode) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 350);
}

// Initial load
window.addEventListener("DOMContentLoaded", function () {
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.innerText = new Date().getFullYear();
  }
  applyHeaderTargetDate();
  applyTimerDuration(getUserSettings().timerMinutes, false);
  populateSongSelectDropdown();
  loadProfile();
  restoreTimerState();
});
