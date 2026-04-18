# Orthodontic Clinical Records System

**Designed & Developed by Dr. Mohammed Homam Alsamman**

A complete, offline-capable orthodontic clinical records web application. No backend, no database — runs entirely in the browser.

## 🚀 Deploy to Vercel

### Option 1 — Vercel Dashboard (Easiest)
1. Download all project files
2. Create a free account at [vercel.com](https://vercel.com)
3. Click **"Add New → Project"**
4. Drag and drop the project folder, or connect your GitHub repo
5. Click **Deploy** — your site is live instantly!

### Option 2 — Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Option 3 — GitHub Integration
1. Push files to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → Import Git Repository
3. Select your repo and deploy with one click

> `vercel.json` is already configured for proper SPA routing and security headers.

## 📁 File Structure

```
/
├── index.html        ← Main clinical records form (7 tabs)
├── admin.html        ← Admin panel for customizing options
├── vercel.json       ← Vercel routing & headers configuration
└── README.md         ← This file
```

## 🔒 Privacy & Data

All patient data is saved locally in the browser (localStorage). Nothing is sent to any server.

## 🦷 Features

### Clinical Forms (7 tabs)
- **Examination** — Full clinical exam with interactive dental chart
- **Treatment Plan** — Fixed or aligner, with financial planning
- **Bond-Up** — Fixed braces or clear aligner start
- **Fixed Follow-Up** — Archwires, mechanics, bond/rebond, elastics
- **Aligner Follow-Up** — Tracking, IPR, attachments, progress bar
- **Emergency** — Quick-select emergency types, treatment actions
- **Debond & Retainer** — Debonding procedure, retainer placement, discharge

---
*© 2025 Dr. Mohammed Homam Alsamman. All Rights Reserved.*
