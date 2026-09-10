# 🎶 KanTime

> **Track your kanta time!**  
> A lightweight, mobile-first rehearsal companion and practice tracker built for Stake Choir preparation (October 24–25).

---

## 📌 Overview

**KanTime** is a modern, offline-first Progressive Web App (PWA) designed to encourage steady, focused choir practice.

It provides choir members with:
- Direct access to sheet music and rehearsal audio tracks
- An honest rehearsal countdown timer with inactivity tracking and one-tap duration adjustments
- A built-in, Web Audio-powered Metronome with dynamic tempo marks and visual beat pulse
- A comprehensive Vocal Warm-Ups & Singing Tips reference catalog with audio pitch helpers
- Real-time vocal pitch detection with a cents deviation meter
- A customizable Dark & Light theme system with device system auto-detection
- Live individual and choir voice section leaderboards to celebrate commitment

---

## ✨ Features

### ⏱️ Rehearsal Practice Timer & Quick Duration Adjuster
- **"Start Practice" Flow**: One-touch session launch that unlatches practice resources.
- **Quick Duration Selector**: Select **5m, 10m, 15m, 20m, 30m, 45m, or 60m** directly on the landing page without opening settings.
- **Mid-Session Lock**: Prevents accidental duration changes while rehearsal countdown is running.
- **Timestamp Persistence**: Rehearsal countdown stays synchronized across browser restarts and background tabs.

### ℹ️ Vocal Warm-Ups & Singing Tips Catalog
- Quick-access **"ℹ️ Vocal Tips & Warm-Ups"** trigger button on the rehearsal card.
- **6-Category Choir Drill Catalog**:
  1. **Physical Prep & Tension Release (⏱️ 1 Min)**: Shoulder Drops & Neck Rolls, Tongue Stretch & Jaw Drops.
  2. **Breath Support & Core Control (💨 Breath)**: The "Hiss" Release, Staccato Pant / "Kuh-Kuh-Kuh" core pulses.
  3. **Low-Pressure & Gentle Resonance (🐝 SOVT)**: Sirens / Humming Slides, Lip Trills (Motorboat), Straw Phonation, Puffy Cheeks / Raspberry "Bzz".
  4. **Forward Placement & Resonance (🎯 Resonance)**: The "Ngy-Ah" Glide, The Friendly "Yawn-Sigh", Quiet Head Voice "Koo-Koo-Koo".
  5. **Articulation & Agility (🗣️ Diction)**: "Mah-Meh-Mee-Moh-Moo", "Mam-Mam-Mam", "Tip of the Tongue, Teeth, and Lips", "B-D-G-P-T-K" Plosives.
  6. **Legato & Choir Blending (🎶 Blend)**: Five-Tone Vowel Chaining (1-2-3-4-5-4-3-2-1), Choir Golden Rules (Tall Vowels, Palatal Lift, Section Blend).
- **Integrated Audio Helpers**: One-tap `🎵 Play C4 Pitch (261 Hz)` Web Audio oscillator reference tones directly next to vocal scale drills.

### ⏱️ Built-in In-Browser Metronome
- **Drift-Free Audio Engine**: Built with the native Web Audio API lookahead scheduler (`lookahead = 25ms`, `0.1s` window) for rock-solid timing.
- **Dynamic Tempo Controls**: Continuous range slider (40 to 220 BPM) with fine-tuning `-1` / `+1` BPM buttons.
- **Italian Tempo Markings**: Updates in real-time (*Largo*, *Adagio*, *Andante*, *Moderato*, *Allegro*, *Vivace*, *Presto*).
- **Tap Tempo**: Real-time pulse averaging based on consecutive user tap intervals.
- **Time Signatures & Pulsing LEDs**: Selectable `2/4`, `3/4`, `4/4`, and `6/8` meters with synchronized pulsing beat LEDs (accented downbeat on beat 1).
- **Battery Auto-Pause**: Automatically halts audio playback when minimizing the app, switching tabs, or collapsing the metronome drawer.

### 🌙 Adaptive Dark & Light Theme System
- **CSS Design Tokens**: Complete semantic color system (`--bg-page`, `--bg-card`, `--bg-modal`, `--bg-input`, `--text-primary`, `--border-subtle`).
- **Dark Slate Aesthetic (`[data-theme="dark"]`)**: Deep slate backgrounds (`#090d16`, `#131b2e`, `#1a243c`) with high-contrast text and zero contrast clipping.
- **1-Click Quick Toggle**: Sun/Moon button (`#themeQuickToggleBtn`) directly in the header bar.
- **Settings Segmented Control**: Choose between **System**, **Light**, or **Dark** mode with persistence in `localStorage`.
- **System Theme Sync**: Auto-detects device mode and reacts dynamically to OS changes via `matchMedia`.

### 📡 Offline-First Progressive Web App (PWA)
- **Service Worker (`sw.js`)**: Cache-First strategy pre-caching all core HTML, CSS, JavaScript, avatars, and bundled audio/PDF assets.
- **Web App Manifest (`manifest.json`)**: Configured for standalone mobile installation with home screen icons and theme colors.
- **Offline Audio & Sheet Music Fallback**: Offline badges and cached offline resources; graceful alerts for external links when disconnected.
- **Offline Practice Queue**: Practice sessions logged while disconnected are queued in `localStorage` and automatically synced to Google Sheets when connection resumes.

### 🎤 Real-Time Voice Pitch Tracker & Tuner
- Zero-lag, client-side vocal pitch detection powered by the native **Web Audio API** autocorrelation frequency engine.
- Real-time note identification (e.g. **A3**, **C5**).
- Interactive **cents deviation meter** (-50 to +50 cents) with color-coded feedback (Flat, In Tune, Sharp).
- Starting pitch generators tailored for each choir voice part (Soprano C5, Alto A3, Tenor E3, Bass C3).

### 🔒 Gated Repertoire Protection
- Rehearsal sheet music, audio players, and external Drive links remain locked until the choir member starts the practice countdown timer.
- Fosters active, intentional rehearsal habits.

### 💤 5-Minute Inactivity Auto-Pause
- Automatically monitors user activity (mouse, touches, keys, scrolls) during rehearsals.
- If no interaction occurs for 5 minutes, pauses the countdown and displays *"Are you still practicing?"* to protect leaderboard integrity.

### 👤 Member Profiles & Strict Name Validation
- Personalized choir profile with voice part (Soprano, Alto, Tenor, Bass, Primary) and 8 illustrated choir avatars.
- **Strict Validation Rule**: Enforces full names of **at least 5 characters** with real-time warnings and button lockout.

### 📖 Multilingual Tutorial & Mobile PDF Export
- 5-step choir member rehearsal tutorial available in **English (EN)**, **Hiligaynon (HIL)**, **Tagalog (TL)**, and **Cebuano (CEB)**.
- **Mobile-Optimized PDF Export**: Fixed-width off-screen DOM clone via `html2pdf.js` eliminating clipping, duplicate content, or page loops on mobile devices.

### 🏆 Live Individual & Section Leaderboards
- **Top 10 Dedicated Singers**: Displays top members based on cumulative practice minutes.
- **Section Standings**: Real-time progress bars tracking total rehearsal hours across Soprano, Alto, Tenor, Bass, and Primary sections.

---

## 📜 Version History & Changelog

| Version | Date | Key Highlights |
|:---|:---:|:---|
| **v2.5.0** | 2026-09-10 | Added **Vocal Warm-Ups & Singing Tips** modal with 6 drill categories, Middle C Web Audio pitch helper, and **Export All Drills to PDF**; standardized timer action button to **"Start Practice"**; added in-app **Version Number Badges** (Header, Footer, Settings); tucked **Metronome behind an on-demand toggle** (hidden by default); updated full project documentation. |
| **v2.2.0** | 2026-09-10 | Implemented built-in Web Audio **In-Browser Metronome** (BPM 40–220, tap tempo, 2/4, 3/4, 4/4, 6/8, pulsing LEDs) and **Dark/Light Theme System** with 1-click header toggle and system auto-detection. |
| **v2.1.0** | 2026-09-10 | Added **Quick Timer Duration Adjuster** pills (5m–60m) directly on landing page; enforced strict **5+ character member name validation** across setup and settings modals. |
| **v2.0.0** | 2026-09-10 | Converted into **Offline-First Progressive Web App (PWA)** with Service Worker (`sw.js`), Web App Manifest, offline queuing, and mobile-isolated clean **PDF export**. Gated rehearsal sheet music and audio behind timer start. |
| **v1.8.0** | 2026-09-10 | Introduced **5-Minute Inactivity Auto-Pause** guard, weekly practice streak calculations, and Milestone Celebration completion modals. |
| **v1.5.0** | 2026-09-10 | Added client-side **Real-Time Voice Pitch Detector** (autocorrelation engine, ±50 cents gauge, lock detection, and reference starting pitch pipe). |
| **v1.0.0** | 2026-09-10 | Initial release of KanTime Stake Choir Rehearsal Hub with countdown timer, repertoire list, avatar selection, and Google Sheets leaderboard integration. |

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **HTML5 & Vanilla JavaScript (ES6+)**
- **Vanilla CSS3** with semantic `:root` design tokens and `[data-theme="dark"]` overrides
- **Web Audio API**:
  - Autocorrelation pitch detection engine (`AnalyserNode`)
  - Precision Metronome lookahead scheduler (`AudioContext`, `OscillatorNode`, `GainNode`)
  - Vocal reference starting pitches (Middle C / voice section starting notes)
- **Service Worker API**: Offline asset caching and background request queueing
- **Web App Manifest**: Standalone PWA mobile installability

### Backend & Database
- **Google Apps Script Web App**: RESTful endpoints (`doGet` for leaderboard, `doPost` for session logs)
- **Google Sheets**: Centralized cloud database for timestamps, singer names, sections, and minutes logged
- **Browser `localStorage`**: Local-first offline persistence for profile, settings, duration, and theme

---

## 📂 Project Structure

```text
kantime/
├── css/
│   └── style.css            # Responsive layout, design tokens, dark mode, metronome, pitch UI
│
├── docs/                    # Architectural documents and feature walkthroughs
│
├── images/                  # Choir avatars, PWA icons, and background artwork
│
├── kantime-resources/       # Bundled audio tracks and sheet music PDF assets
│
├── index.html               # Main application markup, modals, and templates
│
├── manifest.json            # PWA web app manifest
│
├── script.js                # Metronome engine, pitch tuner, timer, offline sync, UI logic
│
├── sw.js                    # Service worker cache-first offline engine
│
└── README.md                # Project documentation and version history
```

---

## 📄 License & Credits

Built with ❤️ for the Iloilo Stake Choir by **James Phillip De Guzman**.