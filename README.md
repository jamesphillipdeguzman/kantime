# 🎶 KanTime

> **Track your *kanta* time!**  
> A lightweight, mobile-first practice portal and session tracker designed for Stake Choir preparation (October 24–25).

---

## 📌 Overview

**KanTime** serves as a centralized hub for choir members to access sheet music, interactive audio tools, and practice recordings. To foster steady habit formation, it incorporates an honest 15-minute countdown session timer, logging practice data directly to a Google Sheets backend and driving live leaderboards.

---

## ✨ Features

- **Centralized Repertoire Hub**: Instant access to hymns and presentation tracks:
  - *Know This, That Every Soul Is Free* (#240) — Official interactive player & sheet music
  - *Rise, Ye Saints, and Temples Enter* (#287) — Official interactive player & sheet music
  - *Choose You This Day* — Sheet music & part rehearsal tracks via Google Drive / YouTube
  - *Holy Places* — Primary presentation sheet music & interactive player
- **Structured 15-Minute Rehearsal Timer**: Enforces full 15-minute practice blocks with pause/resume support before logging to ensure authentic rehearsal tracking.
- **Top 10 Dedicated Singers**: Live ranking showcasing the most committed choir members by total minutes and hours practiced.
- **Voice Section Standings**: Aggregated team standings across Soprano, Alto, Tenor, Bass, and Primary sections.
- **Persistent Profile**: Saves singer name and voice section locally (`localStorage`) for zero-friction repeat visits.
- **Messenger & Mobile Optimized**: Zero-dependency, lightweight single-file build (<50 KB) that runs inside Facebook Messenger's in-app webview.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Single-file HTML5, CSS3, and Vanilla JavaScript (No external frameworks or libraries).
- **Hosting**: GitHub Pages (Static web hosting).
- **Backend API**: Google Apps Script Web App (`doGet` for leaderboard retrieval, `doPost` for logging).
- **Database**: Google Sheets (Stores session logs with timestamps, member names, sections, songs, and durations).

---

## 🚀 Deployment & Local Setup

1. **Clone the Repository:**
   ```bash
   git clone [https://github.com/jamesphillipdeguzman/kantime.git](https://github.com/jamesphillipdeguzman/kantime.git)
   cd kantime