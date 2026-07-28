# PlanSmart AI 🌍✈️

> **AI-powered travel itinerary generator** — Generate personalised, budget-aware trip plans in seconds using Google Gemini 1.5 Flash. Interact, reorder, and manage every activity with an intuitive drag-and-drop interface.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![dnd-kit](https://img.shields.io/badge/dnd--kit-sortable-FF6B6B)](https://dndkit.com)

---

## 📸 Live Demo

> **Demo Trip**: [Sample Tokyo Itinerary](http://localhost:5173/itinerary/sample-tokyo-2026) (runs locally without a backend)

---

## ✨ Features

| Feature | Description |
|---|---|
| **AI Trip Generation** | Enter destination, duration, budget, and style → Gemini produces a full day-by-day itinerary |
| **Activity Interactions** | Mark complete ✅, favourite ⭐, delete 🗑, expand notes 📝 |
| **Drag & Drop Reorder** | Reorder activities per day with pointer or keyboard (fully accessible) |
| **Live Progress Tracker** | Auto-computed completion percentage and favourite counter |
| **Dark / Light Mode** | Toggle with OS preference fallback, persisted to localStorage |
| **Saved Trips Gallery** | All itineraries persisted to localStorage, viewable and deletable |
| **Loading & Error States** | Skeleton shimmer, error boundary, retry button, malformed-JSON fallback |
| **Responsive Layout** | Mobile-first — works on 320px to 4K screens |
| **Accessibility** | Skip link, ARIA landmarks, focus-visible rings, keyboard DnD, screen-reader announcements |

---

## 🏗 Project Architecture

```
plansmart-ai/
├── index.html                 # HTML entry point — SEO meta, skip link, font preloads
├── vite.config.ts             # Vite + Tailwind CSS v4 plugin
├── server/                    # Express.js backend
│   ├── index.js               # Server entry — CORS, dotenv, route registration
│   ├── routes/generate.js     # POST /api/generate-trip handler
│   ├── services/geminiService.js  # Google Gemini SDK integration
│   └── .env                   # GEMINI_API_KEY (never committed)
└── src/
    ├── App.tsx                # Root — ThemeContext + TripProvider + Router
    ├── main.tsx               # React 19 StrictMode render
    ├── index.css              # Design tokens, glassmorphism, animations, a11y
    ├── routes/AppRoutes.tsx   # React.lazy code-split routes
    ├── context/
    │   ├── TripContext.tsx    # TripProvider — localStorage-backed state
    │   ├── TripContextState.ts# Context object + interface
    │   ├── ThemeContext.ts    # Dark/light theme context
    │   └── useTripContext.ts  # Context consumer hook
    ├── hooks/
    │   ├── useTheme.ts        # OS preference detection + localStorage persistence
    │   └── useTripPlanner.ts  # API call state machine (idle→loading→success/error)
    ├── features/
    │   ├── itinerary/
    │   │   ├── ItineraryView.tsx       # Main DnD orchestrator + state updaters
    │   │   ├── SortableActivityCard.tsx# dnd-kit useSortable wrapper + drag handle
    │   │   ├── ActivityCard.tsx        # Interactive card (complete/fav/delete/notes)
    │   │   ├── ItineraryOverview.tsx   # Trip header + live progress bar
    │   │   └── DaySelector.tsx         # Day tab navigation
    │   ├── planner/
    │   │   └── PlannerForm.tsx         # Trip planning form with validation
    │   └── saved-trips/
    │       └── SavedTripCard.tsx        # Gallery card for saved itineraries
    ├── components/
    │   ├── common/
    │   │   ├── Navbar.tsx     # Sticky nav + dark mode toggle + mobile drawer
    │   │   ├── Footer.tsx     # Site footer + AI disclosure notice
    │   │   ├── Button.tsx     # Reusable button (variants: glow/primary/secondary/outline/ghost)
    │   │   ├── Card.tsx       # Glass card wrapper
    │   │   └── Badge.tsx      # Category / status badge
    │   ├── feedback/
    │   │   ├── ErrorBoundary.tsx  # Catches render errors globally
    │   │   └── LoadingSkeleton.tsx# Shimmer placeholder during AI fetch
    │   └── layout/
    │       └── MainLayout.tsx  # Navbar + Outlet + Footer shell
    ├── pages/                  # Route-level page components
    ├── services/
    │   ├── tripService.ts      # localStorage CRUD with QuotaExceededError handling
    │   ├── aiService.ts        # Frontend → backend API call
    │   └── api/client.ts       # Axios/fetch base config
    ├── types/trip.ts           # TripItinerary, Activity, DayItinerary interfaces
    └── utils/
        ├── constants.ts        # APP_CONFIG, NAV_LINKS
        ├── cn.ts               # clsx + tailwind-merge utility
        └── sanitizeItinerary.ts# JSON defensive parsing — adds defaults for interactive fields
```

---

## 🔧 Tech Stack

### Frontend
| Library | Version | Purpose |
|---|---|---|
| React | 19.2 | UI framework (concurrent features) |
| TypeScript | 6.0 | Type safety |
| Vite | 8.1 | Build tool + HMR |
| Tailwind CSS | v4 | Utility-first styling |
| React Router | v7 | Client-side routing |
| dnd-kit | core 6 / sortable 10 | Accessible drag-and-drop |
| lucide-react | 1.27 | Icon library |
| clsx + tailwind-merge | latest | Conditional class names |

### Backend
| Library | Version | Purpose |
|---|---|---|
| Express.js | 4.x | REST API server |
| @google/generative-ai | latest | Gemini 1.5 Flash SDK |
| cors | 2.x | Cross-origin request handling |
| dotenv | 16.x | Environment variable loading |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Google Gemini API key** from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 1. Clone the repository
```bash
git clone https://github.com/Tejamanoj/plansmart-ai.git
cd plansmart-ai
```

### 2. Install dependencies
```bash
# Frontend
npm install

# Backend
cd server && npm install && cd ..
```

### 3. Configure environment variables
```bash
# Create backend .env
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

> ⚠️ **Never commit `.env` to version control.** It is already listed in `.gitignore`.

### 4. Run both servers
```bash
# Terminal 1 — Backend (port 3001)
cd server && node index.js

# Terminal 2 — Frontend (port 5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Try the demo without a backend
Navigate to [http://localhost:5173/itinerary/sample-tokyo-2026](http://localhost:5173/itinerary/sample-tokyo-2026) to explore the full interactive itinerary without any API key.

---

## 📡 API Reference

### `POST /api/generate-trip`

Accepts a trip planning request and returns a structured itinerary JSON via Gemini.

**Request body:**
```json
{
  "destination": "Tokyo, Japan",
  "durationDays": 5,
  "travelStyle": "balanced",
  "budgetTotal": 2000,
  "currency": "USD",
  "interests": ["culture", "food", "technology"]
}
```

**Success response (200):**
```json
{
  "success": true,
  "itinerary": {
    "id": "...",
    "title": "Tokyo Cultural Expedition",
    "destination": "Tokyo, Japan",
    "durationDays": 5,
    "days": [
      {
        "dayNumber": 1,
        "title": "Arrival & Asakusa",
        "activities": [...]
      }
    ]
  }
}
```

**Error response (500):**
```json
{
  "success": false,
  "error": "Gemini API error",
  "fallback": true,
  "itinerary": { ... } // Mock data served when AI is unavailable
}
```

---

## 🤖 AI Usage Disclosure

PlanSmart AI uses **Google Gemini 1.5 Flash** to generate travel itineraries.

**What the AI generates:**
- Day-by-day activity plans
- Time slots and estimated costs
- Location names and descriptions
- Budget breakdowns

**Important limitations:**
- AI output is **non-deterministic** — the same prompt may produce different results on each call
- Cost estimates are **approximate** and may not reflect current prices
- Opening hours, availability, and specific venues may be **inaccurate or out of date**
- The AI may **hallucinate** location names or activities that do not exist

**Always verify AI suggestions** with official tourism websites, Google Maps, booking platforms, and local travel advisories before making travel commitments.

---

## ⚠️ Known Limitations

| Limitation | Detail |
|---|---|
| **No user authentication** | Data is stored only in the browser's localStorage — clearing browser data will erase saved trips |
| **localStorage quota** | Browsers limit localStorage to ~5 MB. Saving many large itineraries may hit this limit. The app handles `QuotaExceededError` gracefully (warns in console, does not crash). |
| **No real-time data** | Activity costs, opening hours, and availability are AI estimates, not live API data |
| **Gemini rate limits** | Free-tier Gemini API has request-per-minute limits. If hit, the backend returns mock data automatically |
| **No offline support** | The app requires a network connection for AI generation (Service Worker / PWA not implemented) |
| **No undo/redo** | Deleted activities cannot be recovered unless the page is refreshed before navigating away |
| **English only** | The Gemini prompt is in English; responses in other languages are not supported |
| **No map integration** | Locations are text-only — no Google Maps or OpenStreetMap embed |

---

## ⏱ Time Spent

| Milestone | Task | Approx. Time |
|---|---|---|
| 1 | Project setup (Vite, TypeScript, Tailwind v4, router) | 2h |
| 2 | Express backend + Gemini API service + mock fallback | 3h |
| 3 | Frontend API service + loading/error handling | 2h |
| 4 | AI response rendering (Overview, DayTabs, ActivityCards) | 4h |
| 5 | Application states (skeleton, error boundary, retry) | 2h |
| 6 | Navbar, Footer, Layout, design system | 2h |
| 7 | Home page, Planner form, Saved trips page | 3h |
| 8 | Itinerary interactions (complete, favourite, delete, notes) | 4h |
| 9 | Drag-and-drop reordering with dnd-kit (a11y + keyboard) | 3h |
| 10 | Dark mode, localStorage hardening, a11y, perf, README | 3h |
| **Total** | | **~28 hours** |

---

## 🎯 Interview Readiness Checklist

- [x] **TypeScript** — All types explicitly declared, no `any` usage
- [x] **Component architecture** — Single-responsibility, reusable, composable
- [x] **State management** — Context API with immutable update patterns
- [x] **Performance** — `React.lazy` code-splitting, `useCallback`/`useMemo` for stable references, `activationConstraint` on DnD sensor to prevent accidental drags
- [x] **Accessibility** — Skip link, ARIA landmarks (`banner`, `main`, `contentinfo`, `navigation`), `aria-label` on all icon buttons, `aria-expanded`/`aria-controls` on mobile toggle, keyboard DnD with screen-reader announcements
- [x] **Error handling** — ErrorBoundary, try/catch throughout, `QuotaExceededError`, malformed JSON fallback, network error states
- [x] **Security** — API key stored only in `server/.env` (never in frontend), CORS restricted to localhost in dev
- [x] **Responsive** — Mobile-first layout, 320px → 4K tested
- [x] **Dark mode** — Persisted, OS-preference-aware, smooth transition
- [x] **AI transparency** — Disclosure notice in footer, README section on AI limitations
- [x] **Git hygiene** — Atomic commits per milestone, descriptive messages
- [x] **README** — Architecture diagram, setup steps, API docs, known limitations, time spent

---

## 🤝 Contributing

This project is an internship assignment demonstration. For questions or feedback, please open an issue on the GitHub repository.

---

## 📄 License

MIT License © 2026 PlanSmart AI
