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
      localSheetUrl: "kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day.pdf",
      videoUrl: "https://www.youtube.com/embed/q54H2OqWBcY?enablejsapi=1",
      audioTracks: [
        { name: "Full Choir", src: "kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day.mp3" },
        { name: "Soprano", src: "kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20SOPRANO.mp3" },
        { name: "Alto", src: "kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20ALTO.mp3" },
        { name: "Tenor", src: "kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20TENOR.mp3" },
        { name: "Bass", src: "kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20-%20BASS.mp3" },
        { name: "Piano", src: "kantime-resources/Choose%20You%20This%20Day/Choose%20You%20This%20Day%20(piano).mp3" }
      ],
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
    let songs = Array.isArray(parsed.songs) && parsed.songs.length > 0 ? parsed.songs : DEFAULT_USER_SETTINGS.songs;

    // Merge default audioTracks and localSheetUrl for bundled songs if missing
    songs = songs.map(s => {
      const def = DEFAULT_USER_SETTINGS.songs.find(d => d.id === s.id || d.title === s.title);
      if (def) {
        if (!s.audioTracks && def.audioTracks) s.audioTracks = def.audioTracks;
        if (!s.localSheetUrl && def.localSheetUrl) s.localSheetUrl = def.localSheetUrl;
      }
      return s;
    });

    return {
      targetDate: parsed.targetDate !== undefined ? parsed.targetDate : DEFAULT_USER_SETTINGS.targetDate,
      timerMinutes: Number(parsed.timerMinutes) || DEFAULT_USER_SETTINGS.timerMinutes,
      songs: songs
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

  updateDurationSelectorUI(mins, Boolean(timerInterval));
}

function updateDurationSelectorUI(mins, isLocked) {
  const currentMins = Number(mins) || getUserSettings().timerMinutes || 15;
  const locked = Boolean(isLocked);

  // Synchronize Settings modal dropdown if present
  const settingsSelect = document.getElementById("settingTimerDuration");
  if (settingsSelect && Number(settingsSelect.value) !== currentMins) {
    settingsSelect.value = currentMins;
  }

  // Synchronize quick-duration pills
  const pills = document.querySelectorAll(".quick-duration-pill");
  pills.forEach(pill => {
    const pillMins = Number(pill.getAttribute("data-mins"));
    const isSelected = pillMins === currentMins;

    pill.classList.toggle("active", isSelected);
    pill.setAttribute("aria-pressed", isSelected ? "true" : "false");

    pill.disabled = locked;
    pill.classList.toggle("locked", locked);
    if (locked) {
      pill.setAttribute("title", "Timer is running. Pause or reset to change duration.");
    } else {
      pill.setAttribute("title", `Set rehearsal timer to ${pillMins} minutes`);
    }
  });

  const wrapper = document.getElementById("quickDurationWrapper");
  if (wrapper) {
    wrapper.classList.toggle("running-locked", locked);
  }
}

function selectQuickDuration(mins) {
  const isRunning = Boolean(timerInterval || targetEndTime);
  if (isRunning) {
    showToast("Rehearsal timer is running! Pause or reset to change duration.");
    return;
  }
  handleTimerDurationChange(mins);
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

// Helper to check if rehearsal session is active (countdown running or paused with progress)
function isPracticeSessionActive() {
  const isRunning = Boolean(timerInterval || targetEndTime);
  const pausedVal = localStorage.getItem("kantime_paused_remaining");
  const hasPausedProgress = Boolean(pausedVal && Number(pausedVal) > 0 && Number(pausedVal) < timerDuration);
  return isRunning || hasPausedProgress;
}

function renderSelectedSongResource(songKey) {
  const container = document.getElementById("dynamicResourceContainer");
  if (!container) return;

  const song = getSongResource(songKey);
  if (!song) {
    container.innerHTML = `<div style="text-align:center; padding:16px; color:var(--text-muted); font-size:0.85rem;">No piece selected.</div>`;
    return;
  }

  const isPrimary = (song.part || "").toLowerCase() === "primary" ? "primary-piece" : "";
  const tagStyle = isPrimary ? "style='color:var(--accent);'" : "";
  const sessionActive = isPracticeSessionActive();
  const isOffline = !navigator.onLine;

  // 🔒 GATED STATE: Prior to timer start or upon reset/completion, hide interactive materials & show prompt
  if (!sessionActive) {
    container.innerHTML = `
      <div class="song-item ${isPrimary} fade-in">
        <span class="song-tag" ${tagStyle}>${escapeHtml(song.part || 'Repertoire')}</span>
        <div class="song-title">${escapeHtml(song.title)}</div>
        
        <div class="resource-gated-box">
          <div class="resource-gated-icon" aria-hidden="true">🔒</div>
          <div class="resource-gated-content">
            <h4 class="resource-gated-title">Rehearsal Material Locked</h4>
            <p class="resource-gated-prompt">
              Select your hymn, then press <strong>&ldquo;Start Practice&rdquo;</strong> to unlock sheet music and rehearsal audio.
            </p>
          </div>
        </div>
      </div>
    `;
    return;
  }

  // 🔓 UNLOCKED STATE: Session is active (running or paused) — reveal interactive sheet music, player, and part rehearsal links
  let actionsHtml = "";

  // Local Sheet Music PDF (cached offline in kantime-resources/)
  if (song.localSheetUrl) {
    actionsHtml += `<button class="btn-link" type="button" onclick="openResourceModal('${escapeHtml(song.title)} (Local Sheet)', '${escapeHtml(song.localSheetUrl)}', 'doc')">🎼 Preview Sheet (Offline PDF) <span class="badge-cached-offline">Offline Ready</span></button> `;
  }

  if (song.sheetUrl) {
    const isGoogleDrive = song.sheetUrl.includes("drive.google.com");
    const offlineBadge = isOffline ? ` <span class="badge-offline-req">⚠️ Requires Internet</span>` : "";
    if (isGoogleDrive) {
      actionsHtml += `<button class="btn-link ${isOffline ? 'link-disabled-offline' : ''}" type="button" onclick="${isOffline ? "showToast('Google Drive requires an active internet connection.')" : `openResourceModal('${escapeHtml(song.title)} (Sheet)', '${escapeHtml(song.sheetUrl)}', 'doc')`}">🎼 Preview Drive Sheet${offlineBadge}</button> `;
      const directFolderUrl = song.sheetUrl.replace('/embeddedfolderview', '/drive/folders').split('#')[0];
      actionsHtml += `<a class="btn-link ${isOffline ? 'link-disabled-offline' : ''}" href="${isOffline ? 'javascript:void(0);' : escapeHtml(directFolderUrl)}" ${isOffline ? `onclick="showToast('Google Drive requires an active internet connection.')"` : 'target="_blank" rel="noopener noreferrer"'}>📁 Open Drive Folder ↗${offlineBadge}</a> `;
    } else {
      actionsHtml += `<a class="btn-link ${isOffline ? 'link-disabled-offline' : ''}" href="${isOffline ? 'javascript:void(0);' : escapeHtml(song.sheetUrl)}" ${isOffline ? `onclick="showToast('Online sheet requires an active internet connection.')"` : 'target="_blank" rel="noopener noreferrer"'}>🎼 Interactive Sheet & Audio ↗${offlineBadge}</a> `;
    }
  }

  if (song.videoUrl) {
    const offlineBadge = isOffline ? ` <span class="badge-offline-req">⚠️ Requires Internet</span>` : "";
    const embedUrl = formatYouTubeEmbedUrl(song.videoUrl);
    actionsHtml += `<button class="btn-link ${isOffline ? 'link-disabled-offline' : ''}" type="button" onclick="${isOffline ? "showToast('YouTube streaming requires an active internet connection.')" : `openResourceModal('${escapeHtml(song.title)} (Video)', '${escapeHtml(embedUrl)}', 'video')`}">▶️ Watch Video${offlineBadge}</button> `;
  }

  // Bundled Local Audio Tracks Player (<audio> tags referencing bundled mp3s)
  let localAudioHtml = "";
  if (song.audioTracks && song.audioTracks.length > 0) {
    let pillsHtml = "";
    song.audioTracks.forEach((track, idx) => {
      const isActive = idx === 0 ? "active" : "";
      pillsHtml += `<button type="button" class="audio-part-pill ${isActive}" onclick="selectAudioTrack('${escapeHtml(track.src)}', this)">${escapeHtml(track.name)}</button>`;
    });

    localAudioHtml = `
      <div class="local-audio-card">
        <div class="local-audio-header">
          <div class="local-audio-title">
            <span>🎧 Rehearsal Audio Tracks</span>
            <span class="badge-cached-offline">⚡ Offline Ready</span>
          </div>
        </div>
        <div class="local-audio-part-selector" role="group" aria-label="Select Voice Part Track">
          ${pillsHtml}
        </div>
        <audio id="activeLocalAudio" class="local-audio-element" controls preload="metadata" src="${escapeHtml(song.audioTracks[0].src)}">
          Your browser does not support local audio playback.
        </audio>
      </div>
    `;
  }

  let embedHtml = "";
  if (song.videoUrl) {
    if (isOffline) {
      embedHtml = `
        <div style="margin-top: 12px; padding: 14px; background: #fffbeb; border: 1px dashed #fde68a; border-radius: 8px; text-align: center; color: #92400e; font-size: 0.82rem;">
          ▶️ <strong>YouTube Video:</strong> <span class="badge-offline-req">Requires Internet</span>
          <p style="margin: 4px 0 0; font-size: 0.76rem; color: #b45309;">Streaming video is disabled in Offline Mode. Use the cached rehearsal audio player above to practice.</p>
        </div>
      `;
    } else {
      const embedUrl = formatYouTubeEmbedUrl(song.videoUrl);
      embedHtml = `
        <div style="margin-top: 12px; border-radius: 8px; overflow: hidden; background: #000; position: relative; padding-bottom: 56.25%; height: 0;">
          <iframe src="${escapeHtml(embedUrl)}" style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
      `;
    }
  }

  const mins = getUserSettings().timerMinutes || 15;
  const defaultNote = song.sheetUrl ? `ℹ️ Opens in external tab. Your ${mins}-minute timer will keep running while you practice!` : "";
  const noteText = song.note !== undefined && song.note !== "" ? song.note : defaultNote;
  const noteHtml = noteText ? `<div class="external-note">${escapeHtml(noteText)}</div>` : "";

  container.innerHTML = `
    <div class="song-item ${isPrimary} fade-in">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
        <span class="song-tag" ${tagStyle}>${escapeHtml(song.part || 'Repertoire')}</span>
        <span class="resource-status-badge">🔓 Session Active &bull; Unlocked</span>
      </div>
      <div class="song-title">${escapeHtml(song.title)}</div>
      
      <div class="resource-unlocked-container">
        ${localAudioHtml}
        <div class="song-actions">${actionsHtml}</div>
        ${noteHtml}
        ${embedHtml}
      </div>
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

  if (savedName && savedName.trim().length >= 5 && savedSection) {
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

    const pitchWidget = document.getElementById("pitchCheckerWidget");
    if (pitchWidget) pitchWidget.style.display = "block";
    updatePitchTargetVoice();

    loadLeaderboard();
  } else {
    profileCard.style.display = "block";
    activeBanner.style.display = "none";
    mainDashboard.style.display = "none";
    if (cancelBtn) cancelBtn.style.display = "none";

    const pitchWidget = document.getElementById("pitchCheckerWidget");
    if (pitchWidget) pitchWidget.style.display = "none";
  }
}

function handleProfileSubmit() {
  const nameInput = document.getElementById("memberName");
  const msgEl = document.getElementById("memberNameValidationMsg");
  const submitBtn = document.getElementById("saveProfileBtn");
  const name = nameInput ? nameInput.value.trim() : "";
  const section = document.getElementById("memberSection").value;
  const avatar = selectedAvatarFile;

  if (!name || name.length <= 4) {
    if (nameInput) nameInput.classList.add("input-invalid");
    if (msgEl) msgEl.style.display = "block";
    if (submitBtn) submitBtn.disabled = true;
    showToast("⚠️ Please enter a valid full name (at least 5 characters).");
    if (nameInput) nameInput.focus();
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

  const pitchWidget = document.getElementById("pitchCheckerWidget");
  if (pitchWidget) pitchWidget.style.display = "block";
  updatePitchTargetVoice();

  // Smoothly scroll down to the practice workspace
  const practiceWorkspace = document.getElementById("practiceWorkspace");
  if (practiceWorkspace) {
    practiceWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function saveProfileFromSettings() {
  const nameInput = document.getElementById("settingMemberName");
  const msgEl = document.getElementById("settingMemberNameValidationMsg");
  const saveBtn = document.getElementById("saveSettingsProfileBtn");
  const sectionSelect = document.getElementById("settingMemberSection");
  const name = nameInput ? nameInput.value.trim() : "";
  const section = sectionSelect ? sectionSelect.value : "";
  const avatar = selectedSettingAvatarFile;

  if (!name || name.length <= 4) {
    if (nameInput) nameInput.classList.add("input-invalid");
    if (msgEl) msgEl.style.display = "block";
    if (saveBtn) saveBtn.disabled = true;
    showToast("⚠️ Please enter a valid full name (at least 5 characters).");
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
  updatePitchTargetVoice();
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
  if (!name || name.length <= 4 || !section) {
    if (name && name.length <= 4) {
      showToast("⚠️ Please enter a valid full name (at least 5 characters).");
    } else {
      alert("Please confirm your name and voice part before starting!");
    }
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

  updateDurationSelectorUI(currentDurationMins, false);

  // Record completed session in history for consistency tracking
  recordCompletedSession(currentDurationMins);
  const stats = getWeekSessionStats();

  // Dynamic Trigger: Session Complete Milestone Banner
  const celebrationPraise = CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)];
  showEncouragementBanner(celebrationPraise, "🎉", "milestone");

  // Dynamic Trigger: Session Complete Celebration Modal
  openCompletionModal(currentDurationMins, stats);

  submitPracticeSession(currentDurationMins);

  // Return song resource section to hidden/prompt state
  const currentSong = document.getElementById("targetSong") ? document.getElementById("targetSong").value : "";
  renderSelectedSongResource(currentSong);
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
      updateDurationSelectorUI(currentDurationMins, true);
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
    updateDurationSelectorUI(currentDurationMins, false);
  }

  // Restore resource state (unlocked if running/paused, gated if session not started)
  const currentSong = document.getElementById("targetSong") ? document.getElementById("targetSong").value : "";
  renderSelectedSongResource(currentSong);

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
    updateDurationSelectorUI(currentDurationMins, false);
  } else {
    // Start or Resume timer
    targetEndTime = Date.now() + (timeRemaining * 1000);
    localStorage.setItem("kantime_target_end", targetEndTime);
    localStorage.setItem("kantime_target_song", document.getElementById("targetSong").value);
    localStorage.removeItem("kantime_paused_remaining");

    btn.innerText = "Pause Session";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");

    // Reveal interactive sheet music, player, and part rehearsal links smoothly upon timer start
    renderSelectedSongResource(document.getElementById("targetSong").value);

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
    updateDurationSelectorUI(currentDurationMins, true);
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

// --- SUBMIT PRACTICE LOG TO GOOGLE SHEETS (WITH OFFLINE QUEUE) ---
function submitPracticeSession(minutes) {
  const name = document.getElementById("memberName").value.trim();
  const section = document.getElementById("memberSection").value;
  const song = document.getElementById("targetSong").value;
  const avatar = localStorage.getItem("choir_avatar") || "";
  const timestamp = new Date().toISOString();

  const payload = {
    name: name,
    section: section,
    song: song,
    minutes: minutes,
    avatar: avatar,
    timestamp: timestamp
  };

  if (!navigator.onLine) {
    saveOfflinePracticeSession(payload);
    showToast("Session saved offline! It will sync to the leaderboard when you reconnect. 📡");
    return;
  }

  showToast("Logging session...");

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
      saveOfflinePracticeSession(payload);
      showToast("Session saved offline! It will sync to the leaderboard when you reconnect. 📡");
      console.warn("Network request failed, queued offline:", err);
    });
}

// --- LOAD LEADERBOARDS (TOP 10 & SECTIONS) ---
function loadLeaderboard() {
  if (!navigator.onLine) {
    const topSingersEl = document.getElementById("topSingersList");
    const sectionEl = document.getElementById("sectionList");
    if (topSingersEl) {
      topSingersEl.innerHTML = `<div style="text-align:center; padding:12px; font-size:0.85rem; color:var(--text-muted);">📡 Offline: Leaderboard syncs when reconnected.</div>`;
    }
    if (sectionEl) {
      sectionEl.innerHTML = `<div style="text-align:center; padding:12px; font-size:0.85rem; color:var(--text-muted);">📡 Offline: Standings sync when reconnected.</div>`;
    }
    return;
  }

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

// --- REAL-TIME IN-BROWSER VOICE PITCH CHECKER & REFERENCE TONES ---
const REFERENCE_PITCHES = {
  Soprano: { note: "C5", freq: 523.25, label: "S: C5" },
  Alto: { note: "A3", freq: 220.00, label: "A: A3" },
  Tenor: { note: "E3", freq: 164.81, label: "T: E3" },
  Bass: { note: "C3", freq: 130.81, label: "B: C3" },
  Primary: { note: "D4", freq: 293.66, label: "Pri: D4" }
};

const MUSICAL_NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

let pitchAudioContext = null;
let pitchMediaStream = null;
let pitchAnalyserNode = null;
let pitchAnimFrameId = null;
let isPitchDetecting = false;
let pitchTimeBuffer = null;
let activeRefOscillator = null;
let activeRefGain = null;
let activeRefTimeout = null;

// Pitch Smoothing (Anti-Jitter / Damping) & Lock-In State
const PITCH_EMA_ALPHA = 0.20; // low-pass filter alpha (0.15 - 0.25)
let smoothedPitchHz = 0;
let pitchFrameBuffer = []; // rolling median buffer (last 4 frames)
let jumpCandidateHz = null;
let jumpCandidateCount = 0;
let lastDisplayedCents = null;

// Pitch Lock-In & Chime State
let pitchLockStartTime = null;
let isPitchLocked = false;
let pitchOffTargetStartTime = null;
let lastLockChimeTime = 0;

function getPitchAudioContext() {
  if (!pitchAudioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) {
      pitchAudioContext = new AudioCtx();
    }
  }
  return pitchAudioContext;
}

// 1. Reference Starting Pitches (Pitch Pipe Oscillators)
function playReferenceTone(part) {
  const ref = REFERENCE_PITCHES[part] || REFERENCE_PITCHES.Tenor;
  const audioCtx = getPitchAudioContext();
  if (!audioCtx) {
    showToast("Audio is not supported in this browser.");
    return;
  }

  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  stopReferenceTone();

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(ref.freq, audioCtx.currentTime);

    const now = audioCtx.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.28, now + 0.08);
    gain.gain.setValueAtTime(0.28, now + 1.5);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 2.1);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now);
    osc.stop(now + 2.15);

    activeRefOscillator = osc;
    activeRefGain = gain;

    document.querySelectorAll(".pitch-ref-btn").forEach(btn => btn.classList.remove("playing"));
    const activeBtn = document.querySelector(`.pitch-ref-btn[data-part="${part}"]`);
    if (activeBtn) activeBtn.classList.add("playing");

    activeRefTimeout = setTimeout(() => {
      if (activeBtn) activeBtn.classList.remove("playing");
    }, 2150);

    showToast(`🎵 ${part} starting pitch: ${ref.note} (${ref.freq.toFixed(1)} Hz)`);
  } catch (err) {
    console.error("Reference pitch error:", err);
  }
}

function stopReferenceTone() {
  if (activeRefTimeout) {
    clearTimeout(activeRefTimeout);
    activeRefTimeout = null;
  }
  if (activeRefOscillator) {
    try {
      activeRefOscillator.stop();
      activeRefOscillator.disconnect();
    } catch (e) {}
    activeRefOscillator = null;
  }
  if (activeRefGain) {
    try { activeRefGain.disconnect(); } catch (e) {}
    activeRefGain = null;
  }
  document.querySelectorAll(".pitch-ref-btn").forEach(btn => btn.classList.remove("playing"));
}

// 2. Widget UI Expansion & Collapse
function expandPitchWidget() {
  const mini = document.getElementById("pitchWidgetMinimized");
  const card = document.getElementById("pitchWidgetCard");
  if (mini) mini.style.display = "none";
  if (card) {
    card.style.display = "block";
    card.classList.add("fade-in");
  }
  updatePitchTargetVoice();
}

function collapsePitchWidget() {
  const mini = document.getElementById("pitchWidgetMinimized");
  const card = document.getElementById("pitchWidgetCard");
  if (card) card.style.display = "none";
  if (mini) mini.style.display = "inline-flex";
}

function updatePitchTargetVoice() {
  const targetSub = document.getElementById("pitchTargetSub");
  const voicePart = localStorage.getItem("choir_voice") || localStorage.getItem("choir_section") || "Choir";
  if (targetSub) {
    const ref = REFERENCE_PITCHES[voicePart];
    if (ref) {
      targetSub.innerText = `Target: ${voicePart} (${ref.note})`;
    } else {
      targetSub.innerText = `Target: ${voicePart} Voice`;
    }
  }

  document.querySelectorAll(".pitch-ref-btn").forEach(btn => {
    if (btn.getAttribute("data-part") === voicePart) {
      btn.classList.add("active-part");
    } else {
      btn.classList.remove("active-part");
    }
  });
}

// 3. Real-Time Pitch Detection & Autocorrelation
function togglePitchDetection() {
  if (isPitchDetecting) {
    stopPitchDetection();
  } else {
    startPitchDetection();
  }
}

async function startPitchDetection() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast("⚠️ Microphone access is not supported in this browser environment.");
    return;
  }

  const audioCtx = getPitchAudioContext();
  if (!audioCtx) {
    showToast("⚠️ Web Audio API is not supported on this device.");
    return;
  }

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      }
    });

    pitchMediaStream = stream;
    const source = audioCtx.createMediaStreamSource(stream);
    pitchAnalyserNode = audioCtx.createAnalyser();
    pitchAnalyserNode.fftSize = 2048;

    source.connect(pitchAnalyserNode);
    pitchTimeBuffer = new Float32Array(pitchAnalyserNode.fftSize);

    isPitchDetecting = true;
    updatePitchToggleUI(true);

    showToast("🎙️ Voice Check active — sing into your microphone!");

    pitchAnalysisLoop();
  } catch (err) {
    console.error("Microphone capture error:", err);
    if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
      showToast("🔒 Mic permission denied. Please allow microphone access in settings.");
    } else {
      showToast("⚠️ Could not access microphone: " + (err.message || "Error"));
    }
    stopPitchDetection();
  }
}

function stopPitchDetection() {
  isPitchDetecting = false;

  if (pitchAnimFrameId) {
    cancelAnimationFrame(pitchAnimFrameId);
    pitchAnimFrameId = null;
  }

  if (pitchMediaStream) {
    try {
      pitchMediaStream.getTracks().forEach(track => track.stop());
    } catch (e) {}
    pitchMediaStream = null;
  }

  pitchAnalyserNode = null;
  pitchTimeBuffer = null;

  updatePitchToggleUI(false);
  resetPitchDisplay();
}

function updatePitchToggleUI(active) {
  const toggleBtn = document.getElementById("pitchMicToggleBtn");
  const icon = document.getElementById("pitchMicIcon");
  const text = document.getElementById("pitchMicText");
  const statusDot = document.getElementById("pitchMiniStatusDot");
  const miniLabel = document.getElementById("pitchWidgetMiniLabel");

  if (active) {
    if (toggleBtn) {
      toggleBtn.classList.add("recording");
      toggleBtn.title = "Stop Pitch Check";
    }
    if (icon) icon.innerText = "⏹️";
    if (text) text.innerText = "Stop";
    if (statusDot) statusDot.classList.add("active");
    if (miniLabel) miniLabel.innerText = "Listening...";
  } else {
    if (toggleBtn) {
      toggleBtn.classList.remove("recording");
      toggleBtn.title = "Start Pitch Check";
    }
    if (icon) icon.innerText = "🎙️";
    if (text) text.innerText = "Start";
    if (statusDot) statusDot.classList.remove("active");
    if (miniLabel) miniLabel.innerText = "Voice Check";
  }
}

function resetPitchDisplay() {
  unlockPitch();
  smoothedPitchHz = 0;
  pitchFrameBuffer = [];
  jumpCandidateHz = null;
  jumpCandidateCount = 0;
  lastDisplayedCents = null;

  const card = document.getElementById("pitchWidgetCard");
  const noteBadge = document.getElementById("pitchNoteBadge");
  const noteVal = document.getElementById("pitchNoteValue");
  const hzVal = document.getElementById("pitchHzValue");
  const centsVal = document.getElementById("pitchCentsReadout");
  const needle = document.getElementById("centsNeedle");
  const prompt = document.getElementById("pitchFeedbackPrompt");
  const gaugeTrack = document.querySelector(".cents-gauge-track");

  if (card) {
    card.classList.remove("state-in-tune", "state-near-tune", "state-off-pitch", "pitch-locked");
  }
  if (noteBadge) {
    noteBadge.classList.remove("in-tune", "off-pitch", "pitch-locked");
  }
  if (gaugeTrack) {
    gaugeTrack.classList.remove("pitch-locked");
  }
  if (needle) {
    needle.classList.remove("pitch-locked");
    needle.style.left = "50%";
  }
  if (noteVal) noteVal.innerText = "--";
  if (hzVal) hzVal.innerText = "0.0 Hz";
  if (centsVal) {
    centsVal.innerText = "-- cents";
    centsVal.classList.remove("in-tune");
  }
  if (prompt) prompt.innerText = 'Tap "Start" to check your pitch in real time.';
}

function triggerPitchLock(fullNote) {
  const card = document.getElementById("pitchWidgetCard");
  const noteBadge = document.getElementById("pitchNoteBadge");
  const gaugeTrack = document.querySelector(".cents-gauge-track");
  const needle = document.getElementById("centsNeedle");
  const centsVal = document.getElementById("pitchCentsReadout");
  const prompt = document.getElementById("pitchFeedbackPrompt");

  if (card) {
    card.classList.remove("state-near-tune", "state-off-pitch");
    card.classList.add("state-in-tune", "pitch-locked");
  }
  if (noteBadge) {
    noteBadge.classList.remove("off-pitch");
    noteBadge.classList.add("in-tune", "pitch-locked");
  }
  if (gaugeTrack) {
    gaugeTrack.classList.add("pitch-locked");
  }
  if (needle) {
    needle.classList.add("pitch-locked");
    needle.style.left = "50%"; // Snap directly to target center (0 cents)
  }
  if (centsVal) {
    centsVal.innerText = "🎯 0 cents (Locked)";
    centsVal.classList.add("in-tune");
  }
  if (prompt) {
    prompt.innerText = "Locked in! Perfect pitch 🎯";
  }

  playPitchLockChime();
}

function unlockPitch() {
  if (!isPitchLocked && !pitchLockStartTime) return;
  isPitchLocked = false;
  pitchLockStartTime = null;
  pitchOffTargetStartTime = null;

  const card = document.getElementById("pitchWidgetCard");
  const noteBadge = document.getElementById("pitchNoteBadge");
  const gaugeTrack = document.querySelector(".cents-gauge-track");
  const needle = document.getElementById("centsNeedle");

  if (card) card.classList.remove("pitch-locked");
  if (noteBadge) noteBadge.classList.remove("pitch-locked");
  if (gaugeTrack) gaugeTrack.classList.remove("pitch-locked");
  if (needle) needle.classList.remove("pitch-locked");
}

// Synthesize pleasant, warm two-note success chime (C6 at 1046 Hz -> E6 at 1318 Hz)
function playPitchLockChime() {
  const now = performance.now();
  if (now - lastLockChimeTime < 2500) return; // 2.5s debounce cooldown
  lastLockChimeTime = now;

  const audioCtx = getPitchAudioContext();
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }

  const t0 = audioCtx.currentTime;

  // Bell Tone 1: C6 (1046.50 Hz)
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(1046.50, t0);
  gain1.gain.setValueAtTime(0.0001, t0);
  gain1.gain.linearRampToValueAtTime(0.12, t0 + 0.05); // 0.05s attack
  gain1.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.40); // 0.35s decay
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.start(t0);
  osc1.stop(t0 + 0.42);

  // Bell Tone 2: E6 (1318.51 Hz) - swelling warmly right after C6
  const t1 = t0 + 0.06;
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(1318.51, t1);
  gain2.gain.setValueAtTime(0.0001, t1);
  gain2.gain.linearRampToValueAtTime(0.14, t1 + 0.05); // 0.05s attack
  gain2.gain.exponentialRampToValueAtTime(0.0001, t1 + 0.42); // 0.35s decay
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start(t1);
  osc2.stop(t1 + 0.45);
}

function pitchAnalysisLoop() {
  if (!isPitchDetecting || !pitchAnalyserNode || !pitchAudioContext) return;

  pitchAnalyserNode.getFloatTimeDomainData(pitchTimeBuffer);
  const freq = autoCorrelate(pitchTimeBuffer, pitchAudioContext.sampleRate);

  updatePitchUI(freq);

  pitchAnimFrameId = requestAnimationFrame(pitchAnalysisLoop);
}

// Normalized Autocorrelation algorithm with energy confidence check & parabolic peak refinement
function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;
  let sumOfSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    const val = buf[i];
    sumOfSquares += val * val;
  }
  const rms = Math.sqrt(sumOfSquares / SIZE);
  if (rms < 0.015) return -1;

  const minPeriod = Math.floor(sampleRate / 1200);
  const maxPeriod = Math.floor(sampleRate / 55);

  let bestPeriod = -1;
  let bestCorrelation = 0;

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let correlation = 0;
    for (let i = 0; i < SIZE - period; i++) {
      correlation += buf[i] * buf[i + period];
    }
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestPeriod = period;
    }
  }

  if (bestCorrelation <= 0 || bestPeriod === -1) return -1;

  const confidence = bestCorrelation / sumOfSquares;
  if (confidence < 0.36) return -1;

  let shift = 0;
  if (bestPeriod > minPeriod && bestPeriod < maxPeriod) {
    let prev = 0, next = 0;
    for (let i = 0; i < SIZE - (bestPeriod - 1); i++) prev += buf[i] * buf[i + bestPeriod - 1];
    for (let i = 0; i < SIZE - (bestPeriod + 1); i++) next += buf[i] * buf[i + bestPeriod + 1];
    const a = prev + next - 2 * bestCorrelation;
    const b = (next - prev) / 2;
    if (Math.abs(a) > 1e-5) {
      shift = -b / a;
    }
  }

  const exactPeriod = bestPeriod + shift;
  return sampleRate / exactPeriod;
}

// Frequency to Note mapping, cents gauge (-50 to +50), and dynamic feedback colors
function updatePitchUI(freq) {
  const card = document.getElementById("pitchWidgetCard");
  const noteBadge = document.getElementById("pitchNoteBadge");
  const noteVal = document.getElementById("pitchNoteValue");
  const hzVal = document.getElementById("pitchHzValue");
  const centsVal = document.getElementById("pitchCentsReadout");
  const needle = document.getElementById("centsNeedle");
  const prompt = document.getElementById("pitchFeedbackPrompt");
  const now = performance.now();

  if (freq === -1) {
    if (isPitchLocked) {
      if (!pitchOffTargetStartTime) {
        pitchOffTargetStartTime = now;
      } else if (now - pitchOffTargetStartTime > 200) {
        unlockPitch();
      }
    } else {
      unlockPitch();
    }

    // Reset smoothing & jump candidate on silence / below RMS threshold
    smoothedPitchHz = 0;
    pitchFrameBuffer = [];
    jumpCandidateHz = null;
    jumpCandidateCount = 0;
    lastDisplayedCents = null;

    if (card && !isPitchLocked) {
      card.classList.remove("state-in-tune", "state-near-tune", "state-off-pitch");
    }
    if (noteBadge && !isPitchLocked) {
      noteBadge.classList.remove("in-tune", "off-pitch");
    }
    if (centsVal && !isPitchLocked) centsVal.classList.remove("in-tune");
    if (prompt && isPitchDetecting && !isPitchLocked) {
      const voicePart = localStorage.getItem("choir_voice") || "your part";
      prompt.innerText = `Singing your ${voicePart} part? Watching pitch...`;
    }
    return;
  }

  // 1. Octave / Erratic Jump Filter (> 1.5 semitones)
  if (smoothedPitchHz > 0) {
    const semitoneDiff = Math.abs(12 * Math.log2(freq / smoothedPitchHz));
    if (semitoneDiff > 1.5) {
      // Check if singer intentionally changed to a new note (sustained for 3 consecutive frames)
      if (jumpCandidateHz !== null && Math.abs(12 * Math.log2(freq / jumpCandidateHz)) <= 0.8) {
        jumpCandidateCount++;
      } else {
        jumpCandidateHz = freq;
        jumpCandidateCount = 1;
      }

      if (jumpCandidateCount >= 3) {
        // Confirmed intentional note shift
        smoothedPitchHz = freq;
        pitchFrameBuffer = [freq];
        jumpCandidateHz = null;
        jumpCandidateCount = 0;
        unlockPitch();
      } else {
        // Transient octave glitch or erratic jump — ignore this frame
        return;
      }
    } else {
      jumpCandidateHz = null;
      jumpCandidateCount = 0;
    }
  } else {
    smoothedPitchHz = freq;
    pitchFrameBuffer = [freq];
  }

  // 2. Exponential Moving Average (EMA) smoothing
  smoothedPitchHz = (PITCH_EMA_ALPHA * freq) + ((1 - PITCH_EMA_ALPHA) * smoothedPitchHz);

  // 3. Rolling Median Buffer (last 4 frames) to eliminate micro-jitter and sub-cent vibrato
  pitchFrameBuffer.push(smoothedPitchHz);
  if (pitchFrameBuffer.length > 4) pitchFrameBuffer.shift();
  const sortedBuf = [...pitchFrameBuffer].sort((a, b) => a - b);
  const effectiveHz = sortedBuf[Math.floor(sortedBuf.length / 2)];

  // 4. Frequency to Note & Cents calculation
  const n = 12 * (Math.log(effectiveHz / 440) / Math.LN2) + 69;
  const roundedNote = Math.round(n);
  const rawCents = Math.round((n - roundedNote) * 100);

  const noteName = MUSICAL_NOTE_NAMES[((roundedNote % 12) + 12) % 12];
  const octave = Math.floor(roundedNote / 12) - 1;
  const fullNote = `${noteName}${octave}`;
  const absCents = Math.abs(rawCents);

  // 5. Pitch Lock-In Detection: within ±8 cents held continuously for at least 350ms
  if (absCents <= 8) {
    pitchOffTargetStartTime = null;
    if (!pitchLockStartTime) {
      pitchLockStartTime = now;
    } else if (!isPitchLocked && (now - pitchLockStartTime >= 350)) {
      isPitchLocked = true;
      triggerPitchLock(fullNote);
    }
  } else {
    pitchLockStartTime = null;
    if (isPitchLocked) {
      if (!pitchOffTargetStartTime) {
        pitchOffTargetStartTime = now;
      } else if (now - pitchOffTargetStartTime > 200) {
        unlockPitch();
      }
    }
  }

  // 6. Deadzone damping on cents needle (suppress < 1.0c micro-fluctuations when unlocked)
  let displayCents = rawCents;
  if (lastDisplayedCents !== null && !isPitchLocked) {
    if (Math.abs(rawCents - lastDisplayedCents) < 1.0) {
      displayCents = lastDisplayedCents;
    }
  }
  lastDisplayedCents = displayCents;

  // 7. Update UI Elements
  if (noteVal) noteVal.innerText = fullNote;
  if (hzVal) hzVal.innerText = `${effectiveHz.toFixed(1)} Hz`;

  if (isPitchLocked) {
    if (needle) needle.style.left = "50%"; // Locked at exact center
    if (centsVal) {
      centsVal.innerText = "🎯 0 cents (Locked)";
      centsVal.classList.add("in-tune");
    }
    if (prompt) prompt.innerText = "Locked in! Perfect pitch 🎯";
    if (card) {
      card.classList.remove("state-near-tune", "state-off-pitch");
      card.classList.add("state-in-tune", "pitch-locked");
    }
    if (noteBadge) {
      noteBadge.classList.remove("off-pitch");
      noteBadge.classList.add("in-tune", "pitch-locked");
    }
    return;
  }

  // Normal / Unlocked UI rendering
  const clampedCents = Math.max(-50, Math.min(50, displayCents));
  const needlePct = clampedCents + 50;
  if (needle) needle.style.left = `${needlePct}%`;

  const centsSign = displayCents > 0 ? "+" : "";
  if (centsVal) {
    centsVal.innerText = `${centsSign}${displayCents} cents`;
  }

  if (card && noteBadge && centsVal && prompt) {
    card.classList.remove("state-in-tune", "state-near-tune", "state-off-pitch", "pitch-locked");
    noteBadge.classList.remove("in-tune", "off-pitch", "pitch-locked");
    centsVal.classList.remove("in-tune");

    if (absCents <= 10) {
      card.classList.add("state-in-tune");
      noteBadge.classList.add("in-tune");
      centsVal.classList.add("in-tune");
      prompt.innerText = `Spot on! In tune (${fullNote}) ✨`;
    } else if (absCents <= 20) {
      card.classList.add("state-near-tune");
      const dir = displayCents < 0 ? "flat" : "sharp";
      prompt.innerText = `Close! Slightly ${dir} (${centsSign}${displayCents}¢)`;
    } else {
      card.classList.add("state-off-pitch");
      noteBadge.classList.add("off-pitch");
      const dir = displayCents < 0 ? "Flat" : "Sharp";
      prompt.innerText = `${dir} by ${absCents}¢ — guide voice toward center`;
    }
  }
}

// Mobile WebView lifecycle: suspend AudioContext on hidden, resume on active
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    if (pitchAudioContext && pitchAudioContext.state === "running") {
      pitchAudioContext.suspend();
    }
  } else {
    if (isPitchDetecting && pitchAudioContext && pitchAudioContext.state === "suspended") {
      pitchAudioContext.resume();
    }
  }
});

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

  const settingNameInput = document.getElementById("settingMemberName");
  const settingMsg = document.getElementById("settingMemberNameValidationMsg");
  const settingBtn = document.getElementById("saveSettingsProfileBtn");
  validateNameInput(settingNameInput, settingMsg, settingBtn);

  updateThemeSegmentedControl(getSavedThemeMode());

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

    if (curName && curName.length >= 5 && curSec && (curName !== savedName || curSec !== savedSec || selectedSettingAvatarFile !== savedAv)) {
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

// --- MULTILINGUAL TUTORIAL LOCALIZATION ---
const TUTORIAL_I18N = {
  en: {
    guide_title: "Choir Member Quick Guide",
    guide_subtitle: "Master your rehearsal routine, background tracking, and choir standings in 5 simple steps.",
    step_label_1: "Step 1",
    step1_title: "Set Up Profile & Avatar",
    step1_desc: "Choose your voice part, name, and illustrated avatar.",
    step_label_2: "Step 2",
    step2_title: "Configure Preferences",
    step2_desc: "Adjust timer length from 5\u201360 mins via settings.",
    step_label_3: "Step 3",
    step3_title: "Sing with Sheet & Audio",
    step3_desc: "Tap Interactive Sheet & Audio; timer continues in the background.",
    step_label_4: "Step 4",
    step4_title: "Voice Pitch Check",
    step4_desc: "Use the mic tool to test starting pitch and lock in your target note.",
    step_label_5: "Step 5",
    step5_title: "Log & Leaderboard",
    step5_desc: "Complete the countdown to record practice minutes for your section."
  },
  hil: {
    guide_title: "Giya para sa mga Miyembro sang Koro",
    guide_subtitle: "Aramon ang imo rutina sang praktis, background timer, kag choir standings sa 5 ka mga hakop.",
    step_label_1: "Hakop 1",
    step1_title: "I-set ang Profile kag Avatar",
    step1_desc: "Pilia ang imo tingog, ngalan, kag avatar sa \u2018Switch voice / change name\u2019.",
    step_label_2: "Hakop 2",
    step2_title: "Huwaron ang Oras sang Praktis",
    step2_desc: "I-adjust ang timer halin 5 tubtob 60 minutos sa Preferences \u2699\ufe0f.",
    step_label_3: "Hakop 3",
    step3_title: "Magpraktis Upod ang Piesa kag Audio",
    step3_desc: "Pinduta ang Interactive Sheet & Audio; padayon nga magadalagan ang timer samtang nagakanta ka.",
    step_label_4: "Hakop 4",
    step4_title: "Pag-check sang Tono sang Tingog",
    step4_desc: "Gamita ang mic para ma-test ang starting note kag ma-lock ang husto nga pitch.",
    step_label_5: "Hakop 5",
    step5_title: "Pag-log kag Leaderboard",
    step5_desc: "Tapusa ang countdown para awtomatiko nga marekord ang imo minuto sa Section Standings."
  },
  tl: {
    guide_title: "Gabay para sa mga Miyembro ng Koro",
    guide_subtitle: "Linangin ang inyong rutina sa ensayo, background timer, at choir standings sa 5 simpleng hakbang.",
    step_label_1: "Hakbang 1",
    step1_title: "Ayusin ang Profile at Avatar",
    step1_desc: "Piliin ang boses, pangalan, at avatar sa \u2018Switch voice / change name\u2019.",
    step_label_2: "Hakbang 2",
    step2_title: "I-set ang Practice Preferences",
    step2_desc: "I-adjust ang haba ng timer mula 5 hanggang 60 minuto sa Preferences \u2699\ufe0f.",
    step_label_3: "Hakbang 3",
    step3_title: "Mag-ensayo Gamit ang Pyesa at Audio",
    step3_desc: "Pindutin ang Interactive Sheet & Audio; tuloy-tuloy ang timer sa background habang kumakanta.",
    step_label_4: "Hakbang 4",
    step4_title: "Pagsusuri ng Pitch ng Boses",
    step4_desc: "Gamitin ang mikropono upang subukan ang starting note at makuha ang tamang tono.",
    step_label_5: "Hakbang 5",
    step5_title: "Pag-save at Leaderboard",
    step5_desc: "Tapusin ang buong countdown upang awtomatikong maitala ang oras sa Section Standings."
  },
  ceb: {
    guide_title: "Giya alang sa mga Miyembro sa Koro",
    guide_subtitle: "Hukma ang imong rutina sa praktis, background timer, ug choir standings sa 5 ka yano nga lakang.",
    step_label_1: "Lakang 1",
    step1_title: "I-set ang Profile ug Avatar",
    step1_desc: "Pilia ang imong boses, ngalan, ug avatar sa \u2018Switch voice / change name\u2019.",
    step_label_2: "Lakang 2",
    step2_title: "Usba ang Oras sa Praktis",
    step2_desc: "I-adjust ang gitas-on sa timer gikan 5 hangtod 60 minutos sa Preferences \u2699\ufe0f.",
    step_label_3: "Lakang 3",
    step3_title: "Pagpraktis Uban sa Pyesa ug Audio",
    step3_desc: "Pindota ang Interactive Sheet & Audio; magpadayon ang timer sa luyo samtang nagkanta ka.",
    step_label_4: "Lakang 4",
    step4_title: "Pagsusi sa Pitch sa Tingog",
    step4_desc: "Gamita ang mic aron masulayan ang starting note ug ma-lock ang insaktong tono.",
    step_label_5: "Lakang 5",
    step5_title: "Pag-save ug Leaderboard",
    step5_desc: "Humanon ang countdown aron awtomatikong marekord ang imong oras sa Section Standings."
  }
};

let currentTutorialLang = "en";

function initTutorialLang() {
  const saved = localStorage.getItem("kantime_lang") || "en";
  currentTutorialLang = TUTORIAL_I18N[saved] ? saved : "en";
  applyTutorialLang(currentTutorialLang);
}

function setTutorialLang(lang) {
  if (!TUTORIAL_I18N[lang]) return;
  currentTutorialLang = lang;
  localStorage.setItem("kantime_lang", lang);
  applyTutorialLang(lang);
}

function applyTutorialLang(lang) {
  const strings = TUTORIAL_I18N[lang];
  if (!strings) return;

  // Swap all data-i18n text nodes inside the tutorial tab panel
  const panel = document.getElementById("tabPanelTutorial");
  if (panel) {
    panel.querySelectorAll("[data-i18n]").forEach(function (el) {
      const key = el.getAttribute("data-i18n");
      if (strings[key] !== undefined) {
        el.textContent = strings[key];
      }
    });
  }

  // Update the active pill highlight
  document.querySelectorAll(".lang-pill").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

// --- EXPORT TUTORIAL GUIDE TO PDF (MOBILE-OPTIMIZED VIA HTML2PDF) ---
function exportTutorialToPdf() {
  const exportBtn = document.querySelector(".btn-export-pdf");
  const origBtnContent = exportBtn ? exportBtn.innerHTML : "";
  if (exportBtn) {
    exportBtn.disabled = true;
    exportBtn.innerHTML = "⏳ Exporting PDF...";
  }

  showToast("Generating mobile-optimized PDF guide... 📄");

  // Call window.scrollTo(0, 0) before capture as required
  window.scrollTo(0, 0);

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
  const singerInfo = memberName ? `${memberName} (${memberVoice || 'Choir Singer'})` : "";

  // Use the currently selected tutorial language for PDF content
  const lang = currentTutorialLang || "en";
  const s = TUTORIAL_I18N[lang] || TUTORIAL_I18N.en;

  // Isolate the Export Target:
  // Clone only tutorial steps content into a temporary, off-screen container with fixed width (700px).
  // Excludes modal headers, close buttons (✕), tab navigation bars, language toggles, and the export button itself.
  const exportContainer = document.createElement("div");
  exportContainer.id = "pdfIsolatedExportContainer";
  exportContainer.className = "pdf-isolated-container";

  // Prepend clean header: "KanTime: Choir Member Quick Guide • Stake Choir Prep"
  const headerHtml = `
    <div class="pdf-header">
      <div class="pdf-header-main">
        <div class="pdf-header-logo">🎵</div>
        <div>
          <h1 class="pdf-header-title">KanTime: Choir Member Quick Guide &bull; Stake Choir Prep</h1>
          <p class="pdf-header-subtitle">5 Simple Steps &bull; ${escapeHtml(targetDate)} &bull; Language: ${lang.toUpperCase()}</p>
        </div>
      </div>
      <div class="pdf-header-meta">
        ${singerInfo ? `<div>Member: <strong>${escapeHtml(singerInfo)}</strong></div>` : ''}
        <div>Stake Choir Practice Hub</div>
        <div>${dateStr}</div>
      </div>
    </div>
    <div class="pdf-intro-banner">
      ${escapeHtml(s.guide_subtitle || "Master your rehearsal routine, background tracking, and choir standings in 5 simple steps.")}
    </div>
  `;

  // Tutorial Steps Content (Cloned from i18n data, completely isolated from modal elements)
  const stepsList = [
    { label: s.step_label_1, title: s.step1_title, desc: s.step1_desc, cls: "s1", badgeCls: "step-badge-1" },
    { label: s.step_label_2, title: s.step2_title, desc: s.step2_desc, cls: "s2", badgeCls: "step-badge-2" },
    { label: s.step_label_3, title: s.step3_title, desc: s.step3_desc, cls: "s3", badgeCls: "step-badge-3" },
    { label: s.step_label_4, title: s.step4_title, desc: s.step4_desc, cls: "s4", badgeCls: "step-badge-4" },
    { label: s.step_label_5, title: s.step5_title, desc: s.step5_desc, cls: "s5", badgeCls: "step-badge-5" }
  ];

  let stepsHtml = '<div class="pdf-steps-container">';
  stepsList.forEach(step => {
    stepsHtml += `
      <div class="pdf-step-item ${step.cls}">
        <div class="pdf-step-header">
          <span class="step-badge ${step.badgeCls}">${escapeHtml(step.label)}</span>
          <h5 class="pdf-step-title">${escapeHtml(step.title)}</h5>
        </div>
        <p class="pdf-step-desc">${escapeHtml(step.desc)}</p>
      </div>
    `;
  });
  stepsHtml += '</div>';

  // Append clean footer: "Developed for Iloilo Stake Choir | Built by James Phillip De Guzman"
  const footerHtml = `
    <div class="pdf-footer">
      <div class="pdf-footer-left">Developed for Iloilo Stake Choir | Built by James Phillip De Guzman</div>
      <div class="pdf-footer-right">&copy; ${year} KanTime Practice Hub</div>
    </div>
  `;

  exportContainer.innerHTML = headerHtml + stepsHtml + footerHtml;
  document.body.appendChild(exportContainer);

  const cleanup = () => {
    if (exportContainer && exportContainer.parentNode) {
      exportContainer.parentNode.removeChild(exportContainer);
    }
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.innerHTML = origBtnContent;
    }
  };

  const executeExport = () => {
    const opt = {
      margin: [10, 12, 10, 12],
      filename: `KanTime-Choir-Guide-${lang.toUpperCase()}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    html2pdf().set(opt).from(exportContainer).save()
      .then(() => {
        showToast("PDF guide downloaded successfully! 📄");
      })
      .catch((err) => {
        console.error("html2pdf error:", err);
        showToast("PDF export failed. Opening print fallback... 📄");
        _printTutorialFallback();
      })
      .finally(() => {
        // Remove temporary clone immediately after the PDF promise resolves
        cleanup();
      });
  };

  if (typeof html2pdf !== "undefined") {
    executeExport();
  } else {
    // Dynamic loader fallback
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => executeExport();
    script.onerror = () => {
      cleanup();
      showToast("PDF library unavailable. Opening print dialog... 📄");
      _printTutorialFallback();
    };
    document.head.appendChild(script);
  }
}

// --- @media print fallback: isolate only the tutorial panel on the main window ---
function _printTutorialFallback() {
  const panel = document.getElementById("tabPanelTutorial");
  if (!panel) { window.print(); return; }

  panel.classList.add("tutorial-print-area");
  document.body.classList.add("printing-tutorial");

  window.print();

  // Restore UI after the print dialog is dismissed
  setTimeout(function () {
    panel.classList.remove("tutorial-print-area");
    document.body.classList.remove("printing-tutorial");
  }, 1500);
}

// --- PWA, OFFLINE QUEUE & AUDIO HELPERS ---
function selectAudioTrack(trackSrc, pillEl) {
  const audioEl = document.getElementById("activeLocalAudio");
  if (audioEl) {
    const wasPlaying = !audioEl.paused;
    audioEl.src = trackSrc;
    if (wasPlaying) {
      audioEl.play().catch(() => {});
    }
  }
  const pills = document.querySelectorAll(".audio-part-pill");
  pills.forEach(p => p.classList.remove("active"));
  if (pillEl) {
    pillEl.classList.add("active");
  }
}

function saveOfflinePracticeSession(sessionObj) {
  try {
    const queue = JSON.parse(localStorage.getItem("offline_practice_queue") || "[]");
    queue.push(sessionObj);
    localStorage.setItem("offline_practice_queue", JSON.stringify(queue));
  } catch (e) {
    console.error("Failed to queue offline session:", e);
  }
}

function syncOfflinePracticeQueue() {
  if (!navigator.onLine) return;
  let queue = [];
  try {
    queue = JSON.parse(localStorage.getItem("offline_practice_queue") || "[]");
  } catch (e) {
    queue = [];
  }

  if (!queue || queue.length === 0) return;

  const count = queue.length;
  showToast(`Syncing ${count} offline session${count > 1 ? 's' : ''} to leaderboard... 📡`);

  const syncPromises = queue.map(session => {
    return fetch(APPS_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(session)
    });
  });

  Promise.all(syncPromises)
    .then(() => {
      localStorage.removeItem("offline_practice_queue");
      showToast(`Synced ${count} offline session${count > 1 ? 's' : ''} successfully! 🔥`);
      setTimeout(loadLeaderboard, 1200);
    })
    .catch(err => {
      console.warn("Failed to sync offline practice queue:", err);
    });
}

function updateOnlineStatus() {
  const banner = document.getElementById("offlineStatusBanner");
  const isOffline = !navigator.onLine;

  if (banner) {
    banner.style.display = isOffline ? "flex" : "none";
  }

  // Refresh active repertoire view to show/hide "Requires Internet" badges
  const targetSongEl = document.getElementById("targetSong");
  if (targetSongEl && targetSongEl.value) {
    renderSelectedSongResource(targetSongEl.value);
  }

  if (!isOffline) {
    syncOfflinePracticeQueue();
    loadLeaderboard();
  }
}

window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js")
      .then(reg => {
        console.log("KanTime ServiceWorker registered with scope:", reg.scope);
      })
      .catch(err => {
        console.warn("KanTime ServiceWorker registration failed:", err);
      });
  }
}

// --- USER NAME REAL-TIME VALIDATION HELPERS ---
function validateNameInput(inputEl, msgEl, btnEl) {
  if (!inputEl) return false;
  const val = inputEl.value.trim();
  const isValid = val.length >= 5;

  if (val.length === 0) {
    inputEl.classList.remove("input-invalid");
    if (msgEl) msgEl.style.display = "none";
    if (btnEl) btnEl.disabled = true;
    return false;
  }

  if (!isValid) {
    inputEl.classList.add("input-invalid");
    if (msgEl) msgEl.style.display = "block";
    if (btnEl) btnEl.disabled = true;
    return false;
  } else {
    inputEl.classList.remove("input-invalid");
    if (msgEl) msgEl.style.display = "none";
    if (btnEl) btnEl.disabled = false;
    return true;
  }
}

function initNameValidation() {
  const setupInput = document.getElementById("memberName");
  const setupMsg = document.getElementById("memberNameValidationMsg");
  const setupBtn = document.getElementById("saveProfileBtn");

  if (setupInput) {
    setupInput.addEventListener("input", () => {
      validateNameInput(setupInput, setupMsg, setupBtn);
    });
    setupInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (!validateNameInput(setupInput, setupMsg, setupBtn)) {
          e.preventDefault();
          showToast("⚠️ Name must be at least 5 characters.");
        }
      }
    });
    validateNameInput(setupInput, setupMsg, setupBtn);
  }

  const settingInput = document.getElementById("settingMemberName");
  const settingMsg = document.getElementById("settingMemberNameValidationMsg");
  const settingBtn = document.getElementById("saveSettingsProfileBtn");

  if (settingInput) {
    settingInput.addEventListener("input", () => {
      validateNameInput(settingInput, settingMsg, settingBtn);
    });
    settingInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        if (!validateNameInput(settingInput, settingMsg, settingBtn)) {
          e.preventDefault();
          showToast("⚠️ Name must be at least 5 characters.");
        }
      }
    });
  }
}

// ==========================================================================
// THEME & APPEARANCE SYSTEM (System / Light / Dark)
// ==========================================================================
function getSavedThemeMode() {
  return localStorage.getItem("theme_mode") || "system";
}

function resolveTheme(mode) {
  if (mode === "system") {
    return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? "dark" : "light";
  }
  return mode === "dark" ? "dark" : "light";
}

function applyTheme(mode, persist = true) {
  if (persist) {
    localStorage.setItem("theme_mode", mode);
  }
  const resolved = resolveTheme(mode);
  document.documentElement.setAttribute("data-theme", resolved);

  // Update quick toggle button in header
  const quickBtn = document.getElementById("themeQuickToggleBtn");
  if (quickBtn) {
    quickBtn.innerText = resolved === "dark" ? "☀️" : "🌙";
    quickBtn.title = resolved === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode";
    quickBtn.setAttribute("aria-label", quickBtn.title);
  }

  // Update mobile status bar theme color
  const metaTheme = document.querySelector("meta[name='theme-color']");
  if (metaTheme) {
    metaTheme.setAttribute("content", resolved === "dark" ? "#090d16" : "#1e40af");
  }

  updateThemeSegmentedControl(mode);
}

function updateThemeSegmentedControl(mode) {
  const btnSystem = document.getElementById("themeBtnSystem");
  const btnLight = document.getElementById("themeBtnLight");
  const btnDark = document.getElementById("themeBtnDark");

  if (btnSystem) btnSystem.classList.toggle("active", mode === "system");
  if (btnLight) btnLight.classList.toggle("active", mode === "light");
  if (btnDark) btnDark.classList.toggle("active", mode === "dark");
}

function setThemePreference(mode) {
  applyTheme(mode, true);
  const resolved = resolveTheme(mode);
  const label = mode === "system" ? `System (${resolved})` : (mode === "dark" ? "Dark" : "Light");
  showToast(`Appearance set to ${label}! 🎨`);
}

function toggleQuickTheme() {
  const currentResolved = document.documentElement.getAttribute("data-theme") || "light";
  const newMode = currentResolved === "dark" ? "light" : "dark";
  applyTheme(newMode, true);
  showToast(`Switched to ${newMode === "dark" ? "Dark mode 🌙" : "Light mode ☀️"}`);
}

function initThemeSystem() {
  const savedMode = getSavedThemeMode();
  applyTheme(savedMode, false);

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", () => {
      if (getSavedThemeMode() === "system") {
        applyTheme("system", false);
      }
    });
  }
}

// ==========================================================================
// IN-BROWSER METRONOME ENGINE (Web Audio API Lookahead Scheduler)
// ==========================================================================
let metronomeAudioCtx = null;
let isMetronomeRunning = false;
let metronomeBpm = 100;
let metronomeBeatsPerBar = 4;
let currentBeatInBar = 0;
let nextNoteTime = 0.0;
const METRONOME_LOOKAHEAD_MS = 25.0;
const METRONOME_SCHEDULE_AHEAD_SEC = 0.1;
let metronomeTimerId = null;
let tapTimestamps = [];

function getTempoMarking(bpm) {
  const b = Number(bpm) || 100;
  if (b < 60) return "Largo (Broad & Slow)";
  if (b < 76) return "Adagio (Slow & Stately)";
  if (b < 108) return "Andante (Walking Pace)";
  if (b < 120) return "Moderato (Moderate)";
  if (b < 156) return "Allegro (Fast & Bright)";
  if (b < 176) return "Vivace (Lively)";
  return "Presto (Very Fast)";
}

function updateMetronomeUI() {
  const bpmDisplay = document.getElementById("metronomeBpmDisplay");
  if (bpmDisplay) bpmDisplay.innerText = metronomeBpm;

  const slider = document.getElementById("metronomeSlider");
  if (slider && Number(slider.value) !== metronomeBpm) {
    slider.value = metronomeBpm;
  }

  const tempoMarking = document.getElementById("metronomeTempoMarking");
  if (tempoMarking) tempoMarking.innerText = getTempoMarking(metronomeBpm);

  const headerBadge = document.getElementById("metronomeHeaderBadge");
  if (headerBadge) {
    const timeSigText = metronomeBeatsPerBar === 6 ? "6/8" : `${metronomeBeatsPerBar}/4`;
    headerBadge.innerText = `${metronomeBpm} BPM • ${timeSigText}`;
  }
}

function updateMetronomeBeatDots() {
  const container = document.getElementById("metronomeBeatDots");
  if (!container) return;

  let html = "";
  for (let i = 0; i < metronomeBeatsPerBar; i++) {
    const isDownbeat = (i === 0);
    html += `<span class="metronome-beat-dot ${isDownbeat ? 'downbeat' : ''}" id="metroDot-${i}" title="Beat ${i + 1}"></span>`;
  }
  container.innerHTML = html;
}

function highlightBeat(beatNumber) {
  const container = document.getElementById("metronomeBeatDots");
  if (!container) return;

  const dots = container.querySelectorAll(".metronome-beat-dot");
  dots.forEach((dot, idx) => {
    if (idx === beatNumber) {
      dot.classList.add("active");
      setTimeout(() => {
        dot.classList.remove("active");
      }, 140);
    } else {
      dot.classList.remove("active");
    }
  });
}

function scheduleMetronomeNote(beatNumber, time) {
  if (!metronomeAudioCtx) return;

  try {
    const osc = metronomeAudioCtx.createOscillator();
    const gain = metronomeAudioCtx.createGain();
    const isDownbeat = (beatNumber === 0);

    // High crisp woodblock ping for beat 1, lower blip for subsequent beats
    osc.type = "sine";
    osc.frequency.setValueAtTime(isDownbeat ? 1200 : 800, time);

    gain.gain.setValueAtTime(isDownbeat ? 0.95 : 0.6, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + (isDownbeat ? 0.05 : 0.035));

    osc.connect(gain);
    gain.connect(metronomeAudioCtx.destination);

    osc.start(time);
    osc.stop(time + (isDownbeat ? 0.05 : 0.035));

    // Schedule visual beat pulse synced with audio
    const delayMs = Math.max(0, (time - metronomeAudioCtx.currentTime) * 1000);
    setTimeout(() => {
      if (isMetronomeRunning) {
        highlightBeat(beatNumber);
      }
    }, delayMs);
  } catch (err) {
    console.warn("Metronome note scheduling error:", err);
  }
}

function nextMetronomeNote() {
  const secondsPerBeat = 60.0 / metronomeBpm;
  nextNoteTime += secondsPerBeat;
  currentBeatInBar = (currentBeatInBar + 1) % metronomeBeatsPerBar;
}

function metronomeScheduler() {
  if (!isMetronomeRunning || !metronomeAudioCtx) return;

  while (nextNoteTime < metronomeAudioCtx.currentTime + METRONOME_SCHEDULE_AHEAD_SEC) {
    scheduleMetronomeNote(currentBeatInBar, nextNoteTime);
    nextMetronomeNote();
  }

  metronomeTimerId = setTimeout(metronomeScheduler, METRONOME_LOOKAHEAD_MS);
}

function startMetronome() {
  if (isMetronomeRunning) return;

  if (!metronomeAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      metronomeAudioCtx = new AudioContextClass();
    }
  }

  if (metronomeAudioCtx && metronomeAudioCtx.state === "suspended") {
    metronomeAudioCtx.resume();
  }

  isMetronomeRunning = true;
  currentBeatInBar = 0;
  if (metronomeAudioCtx) {
    nextNoteTime = metronomeAudioCtx.currentTime + 0.05;
  }
  metronomeScheduler();

  const toggleBtn = document.getElementById("metronomeToggleBtn");
  if (toggleBtn) {
    toggleBtn.classList.add("running");
    toggleBtn.innerText = "⏹ Stop Metronome";
  }
}

function stopMetronome() {
  isMetronomeRunning = false;
  if (metronomeTimerId) {
    clearTimeout(metronomeTimerId);
    metronomeTimerId = null;
  }

  // Clear any active beat dots
  const container = document.getElementById("metronomeBeatDots");
  if (container) {
    const dots = container.querySelectorAll(".metronome-beat-dot");
    dots.forEach(d => d.classList.remove("active"));
  }

  const toggleBtn = document.getElementById("metronomeToggleBtn");
  if (toggleBtn) {
    toggleBtn.classList.remove("running");
    toggleBtn.innerText = "▶ Start Metronome";
  }
}

function toggleMetronome() {
  if (isMetronomeRunning) {
    stopMetronome();
  } else {
    startMetronome();
  }
}

function setMetronomeBpm(val) {
  let num = Number(val) || 100;
  num = Math.max(40, Math.min(220, num));
  metronomeBpm = num;
  updateMetronomeUI();
}

function adjustMetronomeBpm(delta) {
  setMetronomeBpm(metronomeBpm + delta);
}

function handleMetronomeSliderInput(val) {
  setMetronomeBpm(val);
}

function handleTapTempo() {
  const now = performance.now();
  const tapBtn = document.getElementById("metronomeTapBtn");
  if (tapBtn) {
    tapBtn.classList.add("tapped");
    setTimeout(() => tapBtn.classList.remove("tapped"), 120);
  }

  if (tapTimestamps.length > 0 && (now - tapTimestamps[tapTimestamps.length - 1]) > 2500) {
    tapTimestamps = [];
  }

  tapTimestamps.push(now);

  if (tapTimestamps.length >= 2) {
    if (tapTimestamps.length > 5) {
      tapTimestamps.shift();
    }
    let intervals = [];
    for (let i = 1; i < tapTimestamps.length; i++) {
      intervals.push(tapTimestamps[i] - tapTimestamps[i - 1]);
    }
    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    if (avgInterval > 0) {
      const calculatedBpm = Math.round(60000 / avgInterval);
      setMetronomeBpm(calculatedBpm);
    }
  }
}

function setMetronomeTimeSignature(beats) {
  metronomeBeatsPerBar = Number(beats) || 4;
  currentBeatInBar = 0;

  const pills = document.querySelectorAll(".metronome-meter-pill");
  pills.forEach(pill => {
    const pBeats = Number(pill.getAttribute("data-beats"));
    pill.classList.toggle("active", pBeats === metronomeBeatsPerBar);
  });

  updateMetronomeBeatDots();
  updateMetronomeUI();
}

function toggleMetronomeCollapse() {
  const card = document.getElementById("metronomeWidget");
  if (!card) return;

  const isCollapsed = card.classList.toggle("collapsed");
  const header = card.querySelector(".metronome-header");
  if (header) {
    header.setAttribute("aria-expanded", !isCollapsed ? "true" : "false");
  }

  // Auto-pause when collapsing to conserve battery
  if (isCollapsed && isMetronomeRunning) {
    stopMetronome();
  }
}

// Auto-pause metronome when backgrounding or switching tabs
document.addEventListener("visibilitychange", () => {
  if (document.hidden && isMetronomeRunning) {
    stopMetronome();
  }
});

// Initial load
window.addEventListener("DOMContentLoaded", function () {
  const footerYear = document.getElementById("footerYear");
  if (footerYear) {
    footerYear.innerText = new Date().getFullYear();
  }
  initThemeSystem();
  registerServiceWorker();
  updateOnlineStatus();
  applyHeaderTargetDate();
  applyTimerDuration(getUserSettings().timerMinutes, false);
  populateSongSelectDropdown();
  loadProfile();
  initNameValidation();
  restoreTimerState();
  updateMetronomeBeatDots();
  updateMetronomeUI();
  initTutorialLang();
  syncOfflinePracticeQueue();
});
