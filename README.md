# 🎶 KanTime

> **Track your kanta time!**  
> A lightweight, mobile-first rehearsal companion and practice tracker built for Stake Choir preparation (October 24–25).

---

## 📌 Overview

**KanTime** is a lightweight web application designed to encourage steady, focused choir practice.

It provides choir members with direct access to sheet music and rehearsal audio, an honest countdown timer with inactivity tracking, real-time vocal pitch verification, customizable personal goals, and live leaderboards to celebrate individual and section commitment.

---

## ✨ Features

### 🎤 Real-Time Voice Pitch Tracker & Tuner

- Zero-lag, client-side vocal pitch detection powered by the native **Web Audio API** and an autocorrelation frequency engine.
- Real-time note identification such as **A3** and **C5**.
- Interactive **cents deviation meter** from **-50 to +50 cents** to identify:
  - 🔵 Flat
  - 🟢 In tune
  - 🔴 Sharp
- Floating, non-intrusive rehearsal overlay providing instant color-coded visual feedback.
- Built-in reference starting pitch generator using oscillator tones.
- Starting pitches are tailored for each voice section:
  - Soprano
  - Alto
  - Tenor
  - Bass

### ⏱️ Configurable Rehearsal Timer

- Flexible practice sessions from **5 to 60 minutes**.
- **15-minute default session**.
- Smooth pause and resume controls.
- Tracks completed practice time for leaderboard statistics.

### 💤 5-Minute Inactivity Auto-Pause

KanTime automatically monitors activity during practice sessions.

If no activity is detected for **5 minutes**, the timer pauses and displays:

> **"Are you still practicing?"**

This helps keep logged practice hours accurate and fair.

### 👤 Personalized Member Profiles

Members can create a personal choir profile with:

- Voice section:
  - Soprano
  - Alto
  - Tenor
  - Bass
  - Primary
- One of **8 custom choir avatars**.
- Personal practice preferences and goals.

### ⚙️ Personal Preferences & Repertoire Manager

KanTime uses a **local-first** approach for personal settings.

Members can:

- Customize the target event title.
- Customize conference dates.
- Adjust the default rehearsal duration.
- Add custom choir pieces.
- Edit existing custom pieces.
- Organize rehearsal resources.
- Add audio rehearsal links.
- Store personal preferences using browser `localStorage`.

A one-tap:

> **Reset to Choir Defaults**

option is available to restore the original choir settings.

### 📖 In-App Tutorial & PDF Export

The Settings interface includes a **3-tab settings modal** containing:

1. Personal preferences
2. Repertoire management
3. Choir rehearsal tutorial

The tutorial provides a step-by-step guide for effective choir practice.

A clean, print-ready stylesheet is also included for **PDF export**.

### 💬 Dynamic Encouragement

KanTime displays uplifting musical and spiritual messages during practice milestones.

These messages are designed to help singers stay motivated and maintain consistent practice habits.

### 🏆 Live Individual & Section Leaderboards

#### Top 10 Dedicated Singers

Displays the top 10 choir members based on recorded practice time.

#### Section Standings

Tracks collective practice totals across:

- 🎵 Soprano
- 🎵 Alto
- 🎵 Tenor
- 🎵 Bass
- 🎵 Primary

This allows individual singers and entire sections to monitor their progress.

### 🎼 Active Repertoire Hub

KanTime provides quick access to sheet music and rehearsal tracks for selected choir pieces.

Current repertoire includes:

- *Know This, That Every Soul Is Free* (#240)
- *Rise, Ye Saints, and Temples Enter* (#287)
- *Choose You This Day*
- *Holy Places* — Primary

### 📱 Messenger & Mobile Optimized

KanTime is designed as a lightweight, mobile-first application.

It is optimized for:

- Mobile phones
- Tablets
- Desktop browsers
- Messenger and other restricted in-app browsers

When necessary, the application can prompt users to open the experience in an external browser for better microphone and audio support.

---

## 🛠️ Tech Stack & Architecture

### Frontend

- **HTML5**
- **Vanilla JavaScript (ES6+)**
- **CSS3**
- Modular stylesheet:
  - `css/style.css`

### 🎧 Audio Engine

KanTime uses the native **Web Audio API** for client-side pitch detection.

Primary browser APIs include:

- `AudioContext`
- `AnalyserNode`
- `MediaStreamAudioSourceNode`

The application uses a pure JavaScript mathematical **autocorrelation algorithm** to detect vocal frequency.

This provides:

- On-device processing
- No external pitch-detection libraries
- Privacy-focused audio analysis
- Real-time pitch feedback

The microphone audio is analyzed directly in the browser rather than being uploaded to an external audio-processing service.

### 💾 State & Storage

Personal application data is persisted using browser `localStorage`.

Stored information includes:

- Member profile
- Voice section
- Selected avatar
- Custom repertoire
- Audio links
- Timer preferences
- Personal settings

### ☁️ Backend API

KanTime uses a **Google Apps Script Web App** as its lightweight backend API.

The API provides:

- `doGet` — Retrieves leaderboard information.
- `doPost` — Logs completed practice sessions.

### 📊 Database

**Google Sheets** acts as the centralized practice log.

The database records information such as:

- Timestamp
- Singer name
- Voice section
- Song practiced
- Session duration
- Completed practice sessions

### 🌐 Hosting

KanTime can be hosted using:

- **Netlify**
- **GitHub Pages**

---

## 📂 Project Structure

```text
kantime/
├── css/
│   └── style.css
│       # Responsive layout, pitch meter UI,
│       # modal styling, and print rules
│
├── docs/
│   # Repertoire documentation and guides
│
├── images/
│   # Choir avatars, Open Graph banners, and icons
│
├── kantime-resources/
│   # Audio tracks and sheet music assets
│
├── index.html
│   # Main application entry point,
│   # pitch overlay, and modals
│
├── script.js
│   # Pitch detection engine, timer,
│   # inactivity checks, API sync, and storage
│
└── README.md