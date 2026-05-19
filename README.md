# ⚽ Konnecteer — Find Your Crowd

> AI-powered social coordination platform for FIFA World Cup fans. Find nearby watch parties, meet fans from your country, and coordinate real-world meetups — all in real time.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, TailwindCSS v4 |
| UI | Custom shadcn-style components, Framer Motion, Radix UI |
| Auth | NextAuth v5 (Google + Email) |
| Database | PostgreSQL (via Supabase) + Prisma ORM |
| Realtime | Supabase Realtime |
| AI | OpenAI GPT-4o-mini |
| Maps | Google Maps JS API |
| State | Zustand |
| Deployment | Vercel |

## ✨ Core Features

- 🗺️ **Live Map Discovery** — Real-time watch party pins with popularity heatmaps
- 🤖 **AI Match Assistant** — Konnect AI for recommendations and safety tips
- 👥 **Going Alone Mode** — AI matches solo travelers with nearby fan groups
- 💬 **Live Chatrooms** — Real-time multilingual chat per match
- 🌍 **AI Translation** — Auto-translate messages to 16+ languages
- ⚡ **AI Vibe Analysis** — Crowd energy, safety ratings, nationality distribution
- 🎉 **Watch Party Creation** — Full party management with AI summaries
- 📱 **Mobile-First** — Glassmorphism dark UI optimized for mobile

## 🛠️ Local Setup

### Prerequisites

**Node.js 20+** is REQUIRED (Prisma 6 and Next.js 15 both require Node 20+).

### 1. Install

```bash
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
# Fill in all values — see .env.example for details
```

### 3. Database Setup

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to Supabase
npm run db:seed       # Seed demo data
```

### 4. Run

```bash
npm run dev
```

Open http://localhost:3000

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/login + register
│   ├── (dashboard)/dashboard, explore, matches, map, create-party, profile, notifications, settings
│   ├── api/auth, ai (assistant/recommend/translate/vibe), matches, watch-parties
│   └── page.tsx (landing)
├── components/ui, layout, matches, watch-party, chat
├── lib/ai, supabase, auth, db.ts, mock-data.ts, utils.ts
├── store/useAppStore.ts (Zustand)
├── hooks/useCountdown.ts, useRealtime.ts
└── types/index.ts
```

## 🤖 AI Features

All in `/src/lib/ai/`:
- `assistant.ts` — Konnect chatbot
- `recommendation.ts` — Personalized watch party ranking  
- `vibe.ts` — AI crowd/atmosphere analysis
- `translation.ts` — Real-time message translation

## 🚀 Deploy to Vercel

1. Push to GitHub
2. Import to Vercel (vercel.com/new)
3. Add all env vars from `.env.example`
4. **Set Node.js version to 20.x** in Project Settings
5. Deploy!

## 🔑 Services Needed

- **Supabase** (free) — database + realtime
- **Google OAuth** — authentication
- **Google Maps API** — map features
- **OpenAI** — AI features (uses gpt-4o-mini for cost efficiency)

## Required Node Version

⚠️ Node.js 20+ required. Check with: `node --version`

If you have Node 18, upgrade via [nodejs.org](https://nodejs.org) or use nvm:
```bash
nvm install 20
nvm use 20
```

---

MIT License — Built for football fans worldwide ⚽
