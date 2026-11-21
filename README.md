# 🌟 Meri Padhai Tracker (Study & Doubt Tracker)

A cheerful, kid-friendly study tracking web application built with **Next.js**, **Tailwind CSS**, and **SQLite (Prisma)**, packaged into **Docker** with a persistent volume for seamless multi-device access.

---

## 🎯 Key Features

1. **👧 Bhanji Mode & 👨‍🏫 Mama / Mentor Mode**
   - Seamless role switcher in the header.
   - Bhanji can log studies, ask doubts, and track upcoming goals.
   - Mama can review study sessions, give stars (1-5 ⭐) with encouraging feedback notes, and write solutions to doubts.

2. **📝 Aaj Kya Padha (Daily Log)**
   - Subject selection with cute icons (Maths 📐, Science 🔬, English 📖, Hindi ✍️, Computer 💻, etc.).
   - Topic/chapter name, time spent (quick 15m/30m/45m/60m pills), and confidence rating (😊 Samajh gaya / 🤔 Doubt hai / 🤯 Mushkil tha).
   - Confetti celebration upon saving entries! 🎉

3. **🎯 Aage Kya Padhna Hai (Planner / To-Do)**
   - Target dates (Today, Tomorrow, or custom).
   - Priority levels (Urgent 🔴 vs Normal 🟡).
   - Checkbox to mark complete + one-click option to log into today's study.

4. **❓ Doubt Box (Mere Sawaal)**
   - Bhanji asks doubts with subject, chapter, and book/page reference.
   - Live badge showing pending doubts.
   - Mama writes step-by-step explanations and marks them solved.

5. **🏆 Trophies & Badges (Padhai Hall of Fame)**
   - Real-time study streak counter (🔥 X Days Streak).
   - Total stars earned.
   - Unlockable achievement badges (First Step, Curious Mind, Streak Champion, Goal Crusher).
   - Subject-wise study time breakdown bars.

---

## 🚀 One-Command Docker Start

To start the full-stack app with persistent database:

```bash
cd /home/neosoft/projects/study-tracker
docker compose up -d
```

To stop:
```bash
docker compose down
```

To view logs:
```bash
docker compose logs -f
```

---

## 📱 Multi-Device Access (Same Wi-Fi / Local Network)

Both you and your niece can access the app simultaneously from different devices:

- **From this computer:** `http://localhost:3000`
- **From phones / tablets / other laptops on the same Wi-Fi:**
  ```text
  http://192.168.0.109:3000
  ```
  *(Replace with your current local IP if it changes: run `hostname -I`)*

---

## 💾 Data Persistence

All data is stored inside the SQLite database at `./prisma/dev.db`, which is mounted as a Docker volume (`./prisma:/app/prisma`). Your data remains completely safe across container restarts, stops, and updates.
