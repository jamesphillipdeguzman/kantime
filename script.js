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

// --- SONG REPERTOIRE DATA ---
const SONG_RESOURCES = {
  "Know This, That Every Soul Is Free": {
    tag: "Adult Choir #1",
    title: "Know This, That Every Soul Is Free (Hymn #240)",
    primaryPiece: false,
    actions: [
      { type: "link", text: "🎼 Interactive Sheet & Audio ↗", url: "https://www.churchofjesuschrist.org/media/music/songs/know-this-that-every-soul-is-free?crumbs=hymns&order=number&lang=eng" }
    ],
    note: "ℹ️ Opens in external tab. Your 15-minute timer will keep running while you practice!"
  },
  "Rise, Ye Saints, and Temples Enter": {
    tag: "Adult Choir #2",
    title: "Rise, Ye Saints, and Temples Enter (Hymn #287)",
    primaryPiece: false,
    actions: [
      { type: "link", text: "🎼 Interactive Sheet & Audio ↗", url: "https://www.churchofjesuschrist.org/media/music/songs/rise-ye-saints-and-temples-enter?crumbs=hymns&order=number&lang=eng" }
    ],
    note: "ℹ️ Opens in external tab. Your 15-minute timer will keep running while you practice!"
  },
  "Choose You This Day": {
    tag: "Adult Choir #3",
    title: "Choose You This Day",
    primaryPiece: false,
    embedVideo: "https://www.youtube.com/embed/q54H2OqWBcY?enablejsapi=1",
    actions: [
      { type: "modal_video", text: "▶️ Watch Video (In-App)", title: "▶️ Choose You This Day (Video Track)", url: "https://www.youtube.com/embed/q54H2OqWBcY?enablejsapi=1" },
      { type: "modal_doc", text: "🎼 Preview Sheet (In-App)", title: "🎼 Choose You This Day (Sheet Music)", url: "https://drive.google.com/embeddedfolderview?id=1bBnCakJGBj-zfka8wVbz42_ykvipMnwU#grid" },
      { type: "link", text: "📁 Open Drive Folder ↗", url: "https://drive.google.com/drive/folders/1bBnCakJGBj-zfka8wVbz42_ykvipMnwU?usp=sharing" }
    ],
    note: null
  },
  "Holy Places": {
    tag: "Primary Presentation",
    title: "Holy Places",
    primaryPiece: true,
    actions: [
      { type: "link", text: "🎼 Interactive Sheet & Audio ↗", url: "https://www.churchofjesuschrist.org/media/music/songs/holy-places?crumbs=hymns-for-home-and-church&order=number&lang=eng" }
    ],
    note: "ℹ️ Opens in external tab. Your 15-minute timer will keep running while you practice!"
  }
};

function renderSelectedSongResource(songKey) {
  const container = document.getElementById("dynamicResourceContainer");
  if (!container) return;
  const data = SONG_RESOURCES[songKey] || SONG_RESOURCES["Know This, That Every Soul Is Free"];

  let actionsHtml = "";
  data.actions.forEach(act => {
    if (act.type === "link") {
      actionsHtml += `<a class="btn-link" href="${act.url}" target="_blank" rel="noopener noreferrer">${act.text}</a> `;
    } else if (act.type === "modal_video") {
      actionsHtml += `<button class="btn-link" type="button" onclick="openResourceModal('${act.title}', '${act.url}', 'video')">${act.text}</button> `;
    } else if (act.type === "modal_doc") {
      actionsHtml += `<button class="btn-link" type="button" onclick="openResourceModal('${act.title}', '${act.url}', 'doc')">${act.text}</button> `;
    }
  });

  let embedHtml = "";
  if (data.embedVideo) {
    embedHtml = `
      <div style="margin-top: 12px; border-radius: 8px; overflow: hidden; background: #000; position: relative; padding-bottom: 56.25%; height: 0;">
        <iframe src="${data.embedVideo}" style="position: absolute; top:0; left:0; width:100%; height:100%; border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
    `;
  }

  const isPrimary = data.primaryPiece ? "primary-piece" : "";
  const tagStyle = data.primaryPiece ? "style='color:var(--accent);'" : "";
  const noteHtml = data.note ? `<div class="external-note">${data.note}</div>` : "";

  container.innerHTML = `
    <div class="song-item ${isPrimary} fade-in">
      <span class="song-tag" ${tagStyle}>${data.tag}</span>
      <div class="song-title">${data.title}</div>
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
  const savedName = localStorage.getItem("choir_name");
  const savedSection = localStorage.getItem("choir_section");
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

    const savedSong = localStorage.getItem("kantime_target_song") || "Know This, That Every Soul Is Free";
    if (document.getElementById("targetSong")) {
      document.getElementById("targetSong").value = savedSong;
    }
    renderSelectedSongResource(savedSong);

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

  // Smoothly scroll down to the practice workspace
  const practiceWorkspace = document.getElementById("practiceWorkspace");
  if (practiceWorkspace) {
    practiceWorkspace.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function switchProfile() {
  const savedAvatar = localStorage.getItem("choir_avatar") || "";
  renderAvatarPicker(savedAvatar);

  document.getElementById("profileCard").style.display = "block";
  document.getElementById("activeProfileBanner").style.display = "none";
  document.getElementById("mainDashboard").style.display = "none";

  const saveBtn = document.getElementById("saveProfileBtn");
  if (saveBtn) saveBtn.innerText = "Save Changes";

  const cancelBtn = document.getElementById("cancelProfileBtn");
  if (cancelBtn) cancelBtn.style.display = "inline-flex";

  document.getElementById("memberName").focus();
  document.getElementById("profileCard").scrollIntoView({ behavior: "smooth", block: "start" });
}

function cancelProfileEdit() {
  const savedName = localStorage.getItem("choir_name");
  const savedSection = localStorage.getItem("choir_section");
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

// --- 15-MINUTE STRICT TIMER (LOCALSTORAGE TIMESTAMP-PERSISTED) ---
const timerDuration = 15 * 60; // 15 minutes (900 seconds)
let timeRemaining = timerDuration;
let targetEndTime = null;
let timerInterval = null;

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function updateTimerTick() {
  if (!targetEndTime) return;
  const now = Date.now();
  const diffMs = targetEndTime - now;
  timeRemaining = Math.max(0, Math.ceil(diffMs / 1000));
  document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);

  if (timeRemaining <= 0) {
    completeTimerSession();
  }
}

function completeTimerSession() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  targetEndTime = null;
  timeRemaining = timerDuration;
  localStorage.removeItem("kantime_target_end");
  localStorage.removeItem("kantime_target_song");
  localStorage.removeItem("kantime_paused_remaining");

  document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);

  const btn = document.getElementById("timerBtn");
  btn.innerText = "Start 15m Session";
  btn.classList.remove("btn-outline");
  btn.classList.add("btn-primary");

  alert("🎉 Session Complete! You've logged 15 minutes of solid practice!");
  submitPracticeSession(15);
}

function restoreTimerState() {
  const savedTargetEnd = localStorage.getItem("kantime_target_end");
  const btn = document.getElementById("timerBtn");
  const savedSong = localStorage.getItem("kantime_target_song");
  if (savedSong && document.getElementById("targetSong")) {
    document.getElementById("targetSong").value = savedSong;
  }

  if (savedTargetEnd) {
    const savedEndTime = Number(savedTargetEnd);
    const now = Date.now();

    if (now < savedEndTime) {
      targetEndTime = savedEndTime;
      timeRemaining = Math.max(0, Math.ceil((targetEndTime - now) / 1000));
      document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);

      btn.innerText = "Pause Session";
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline");

      if (!timerInterval) {
        timerInterval = setInterval(updateTimerTick, 500);
      }
    } else {
      completeTimerSession();
    }
  } else {
    const savedPaused = localStorage.getItem("kantime_paused_remaining");
    if (savedPaused && Number(savedPaused) > 0 && Number(savedPaused) < timerDuration) {
      timeRemaining = Number(savedPaused);
      document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);
      btn.innerText = "Resume 15m Session";
      btn.classList.remove("btn-outline");
      btn.classList.add("btn-primary");
    } else {
      timeRemaining = timerDuration;
      document.getElementById("timerDisplay").innerText = formatTime(timeRemaining);
    }
  }
}

function toggleTimer() {
  if (!validateUser()) return;

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
    btn.innerText = "Resume 15m Session";
    btn.classList.remove("btn-outline");
    btn.classList.add("btn-primary");
  } else {
    // Start or Resume timer
    targetEndTime = Date.now() + (timeRemaining * 1000);
    localStorage.setItem("kantime_target_end", targetEndTime);
    localStorage.setItem("kantime_target_song", document.getElementById("targetSong").value);
    localStorage.removeItem("kantime_paused_remaining");

    btn.innerText = "Pause Session";
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");

    updateTimerTick();
    timerInterval = setInterval(updateTimerTick, 500);
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

// Initial load
window.addEventListener("DOMContentLoaded", function () {
  loadProfile();
  restoreTimerState();
});
