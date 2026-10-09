<div align="center">

# 📈 StockPulse

**An interactive, real-time stock price tracker with advanced state management and data fetching.**

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-UI%20state-orange)
![React Query](https://img.shields.io/badge/TanStack%20Query-server%20state-FF4154)
![Tests](https://img.shields.io/badge/tests-36%20passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-97%25-brightgreen)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker&logoColor=white)

**Author:** Mohammad Riyaz · [GitHub](https://github.com/riyaz7799) · [LinkedIn](https://linkedin.com/in/md-riyaz-bb584a2b6)
**Repository:** https://github.com/riyaz7799/stockpulse

</div>

---

## Table of Contents
1. [Overview](#overview)
2. [Demo](#demo)
3. [Features](#features)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Project Structure](#project-structure)
7. [Getting Started](#getting-started)
8. [Environment Variables](#environment-variables)
9. [Docker](#docker)
10. [Testing](#testing)
11. [API Integration & Rate Limits](#api-integration--rate-limits)
12. [Caching & Real-time Strategy](#caching--real-time-strategy)
13. [Error Handling](#error-handling)
14. [Accessibility](#accessibility)
15. [Responsive Design](#responsive-design)
16. [Requirements Checklist](#requirements-checklist)
17. [Design Decisions & Trade-offs](#design-decisions--trade-offs)
18. [Future Improvements](#future-improvements)

---

## Overview
StockPulse is a single-page application that lets users browse popular stocks, inspect a selected stock's live price and daily statistics, and explore a 30-day price history chart. Prices refresh automatically every 10 seconds without a page reload.

The project focuses on **clean separation of state**:

| Kind of state | Tool | Examples |
|---|---|---|
| Server state | TanStack React Query | quotes, historical prices |
| Global UI state | Zustand | selected stock, theme |
| Local UI state | `useState` | search text, validation errors |

It works out of the box with a built-in **mock data service** (no API key required) and switches to live data from [Twelve Data](https://twelvedata.com/) when a key is provided.

## Demo
**Video walkthrough (core functionality, responsiveness, accessibility):**
👉 [Watch the demo](ADD_YOUR_VIDEO_LINK_HERE)

### Screenshots
| Mobile (375px) | Tablet (768px) | Desktop (1280px) |
|:---:|:---:|:---:|
| ![Mobile](screenshots/mobile.png) | ![Tablet](screenshots/tablet.png) | ![Desktop](screenshots/desktop.png) |

## Features
- **Popular stocks list** with price, change and percentage change
- **Live price polling** (every 10s) for the selected stock via React Query `refetchInterval`
- **Stock details**: current price, open, high, low, previous close, volume
- **Interactive 30-day chart** (Recharts area chart with tooltip)
- **Search / filter** by symbol or company name with input validation
- **Dark / light theme**, persisted across sessions
- **Loading skeletons and spinners** for every async region
- **Graceful error handling** with friendly messages and retry buttons
- **Fully responsive**, mobile-first layout
- **Accessible**: semantic HTML, keyboard navigation, ARIA live regions, skip link
- **Containerised** with a multi-stage Docker build served by Nginx
- **Unit and integration tests** (36 tests, ~97% coverage)

## Tech Stack
| Area | Technology |
|---|---|
| Framework | React 19, TypeScript (strict) |
| Build tool | Vite |
| UI state | Zustand (with `persist` middleware) |
| Server state | TanStack React Query v5 |
| Charts | Recharts |
| Styling | Plain CSS with custom properties (themeable, mobile-first) |
| Data source | Twelve Data REST API (+ local mock fallback) |
| Testing | Vitest, React Testing Library, user-event, jsdom |
| Containerisation | Docker (multi-stage), Docker Compose, Nginx |

## Architecture
```
┌──────────────────────────── React UI ────────────────────────────┐
│  Dashboard ── StockSearch (local state)                          │
│     │                                                            │
│     ├── StockList ──── click ──► Zustand uiStore.selectedSymbol  │
│     │                                  │                         │
│     └── StockDetails ◄─────────────────┘                         │
│            │            │                                        │
│     useStockDetails  useHistoricalData      (React Query hooks)  │
└────────────┼────────────┼────────────────────────────────────────┘
             ▼            ▼
        src/api/stockService.ts  ── live ──► Twelve Data API
                                 └─ no key ─► mockData.ts
```

**Data flow:** the user clicks a stock → `StockList` writes the symbol to the Zustand store → `StockDetails` reads it and its React Query hooks fetch the quote (polled) and history (cached) through the API service layer.

## Project Structure
```
stockpulse/
├── src/
│   ├── api/
│   │   ├── stockService.ts     # API client, response mapping, error normalisation
│   │   └── mockData.ts         # Offline fallback with simulated price movement
│   ├── components/
│   │   ├── StockList.tsx       # Stock list, selection
│   │   ├── StockDetails.tsx    # Quote, stats, chart container
│   │   ├── PriceChart.tsx      # Accessible Recharts wrapper
│   │   ├── StockSearch.tsx     # Validated search input
│   │   ├── ThemeToggle.tsx
│   │   └── Feedback.tsx        # Spinner, skeleton, ErrorMessage
│   ├── hooks/useStocks.ts      # React Query hooks and query keys
│   ├── pages/Dashboard.tsx     # Page layout
│   ├── stores/uiStore.ts       # Zustand store
│   ├── utils/                  # format.ts, validation.ts
│   ├── test/                   # Test setup and helpers
│   ├── App.tsx, main.tsx, styles.css, types.ts
├── Dockerfile                  # Multi-stage: node build → nginx serve
├── docker-compose.yml
├── nginx.conf
├── .env.example
└── vite.config.ts              # Vite + Vitest + coverage thresholds
```

## Getting Started

### Prerequisites
- Node.js 20+ and npm
- (Optional) Docker Desktop
- (Optional) a free [Twelve Data](https://twelvedata.com/) API key

### Install and run
```bash
git clone https://github.com/riyaz7799/stockpulse.git
cd stockpulse
cp .env.example .env        # Windows CMD: copy .env.example .env
npm install
npm run dev
```
Open **http://localhost:5173**.

### Available scripts
| Command | Description |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and create a production build |
| `npm run preview` | Preview the production build |
| `npm test` | Run all tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run coverage` | Run tests with coverage (fails below 70%) |

## Environment Variables
Copy `.env.example` to `.env`.

| Variable | Default | Description |
|---|---|---|
| `VITE_STOCK_API_KEY` | _empty_ | Twelve Data API key. If empty, mock data is used. |
| `VITE_USE_MOCK` | `false` | Set to `true` to force mock data even when a key is set. |
| `VITE_POLL_INTERVAL_MS` | `10000` | Refresh interval for the selected stock's price (ms). |

> The API key is read from environment variables and never committed (`.env` is git-ignored). Note that any `VITE_*` variable is embedded in the client bundle, so use a free-tier/demo key for front-end-only apps.

## Docker
```bash
cp .env.example .env              # Windows CMD: copy .env.example .env
docker compose up --build
```
Open **http://localhost:8080**.

- **Stage 1** (`node:20-alpine`): installs dependencies with `npm ci` and builds the app.
- **Stage 2** (`nginx:alpine`): serves the static build with SPA fallback routing, gzip and long-lived asset caching, plus a health check.
- Vite inlines `VITE_*` variables at **build time**, so `docker-compose.yml` passes them as **build args**. After changing `.env`, rebuild with `docker compose up --build`.

Stop with `docker compose down`.

## Testing
```bash
npm test
npm run coverage
```
**36 tests across 8 files, ~97% statement coverage** (threshold enforced at 70%).

| Area | What is tested |
|---|---|
| Zustand store | initial state, select/clear symbol, theme set/toggle |
| API service | mock mode, batch/quote/history parsing, ordering, empty data, rate-limit, API errors, HTTP errors, network failure |
| `StockList` | rendering, store update on click, `aria-pressed`, keyboard activation, empty state |
| `StockSearch` | valid input propagation, validation errors, `aria-invalid` |
| `StockDetails` | empty prompt, loading → data, error + retry |
| `PriceChart` | accessible summary, empty state |
| `Dashboard` (integration) | skeleton → list, error + retry, filter + select, theme toggle |
| Utilities | formatters and validation |

API calls are mocked with `vi.mock`; no network access is needed to run the tests.

## API Integration & Rate Limits
All network access is isolated in `src/api/stockService.ts`, which exposes:

| Function | Endpoint | Purpose |
|---|---|---|
| `fetchPopularStocks()` | `/quote` (batched) | List of popular stocks |
| `fetchStockDetails(symbol)` | `/quote` | Selected stock details |
| `fetchHistoricalData(symbol)` | `/time_series` (1day, 30 points) | Chart data |

The service normalises responses (string → number), reverses history to oldest-first, and converts API-level errors (Twelve Data returns HTTP 200 with `status: "error"`) into typed `ApiError`s.

**Rate-limit strategy** (free tier ≈ 8 credits/minute):
- The popular list is a **single batched request**, cached for 60s.
- **Only the selected stock** is polled, not the whole list.
- History is cached for 5 minutes.
- HTTP/API 429 responses show a friendly message and React Query retries with exponential backoff.
- If you hit limits, raise `VITE_POLL_INTERVAL_MS` (e.g. `15000`) or use mock mode.

## Caching & Real-time Strategy
| Query | `staleTime` | Refresh | Notes |
|---|---|---|---|
| Popular stocks | 60s | on mount / window focus | stale-while-revalidate |
| Stock details | ½ poll interval | `refetchInterval` = 10s | `keepPreviousData` avoids flicker when switching |
| Historical data | 5 min | on demand | rarely changes |

Global defaults: 2 retries with exponential backoff (max 10s) and refetch on window focus. Because a WebSocket feed is not available on most free tiers, "real-time" is implemented via **polling**, an accepted pattern for this task.

## Error Handling
- Each region (list, quote, chart) handles its own `loading` / `error` / `empty` state, so one failure never breaks the page.
- Errors render as `role="alert"` messages with a **Try again** button.
- If a background refresh fails, the previous data stays visible with a "last refresh failed" note rather than blanking the UI.
- No errors are only logged to the console; users always get actionable feedback.

## Accessibility
- Semantic landmarks: `header`, `main`, `section`, `footer`, `figure`, `dl`
- **Skip link** to main content
- Every interactive element is reachable and operable by keyboard; visible focus rings
- Search input has a `<label>`, `aria-invalid`, and a `role="alert"` error message
- Selected stock exposed with `aria-pressed`
- Live price in an `aria-live="polite"` region
- Focus moves to the details heading when a stock is selected
- Chart has a text summary (`role="img"` + `aria-label` + caption)
- Trend conveyed with arrows and +/− signs, **not colour alone**
- Respects `prefers-reduced-motion`; colour tokens designed for contrast in both themes

## Responsive Design
Mobile-first CSS with breakpoints tested at **375px**, **768px** and **1280px**:
- **< 768px:** single column (list above details)
- **≥ 768px:** two-column layout (list + details)
- **≥ 1280px:** wider list column
- Chart resizes with its container; stats grid auto-fits.

## Requirements Checklist
- [x] Fetches and displays a list of popular stocks from a public API
- [x] Select a stock to see current price and historical data
- [x] Prices update periodically (10s) via React Query polling, no page reload
- [x] Interactive historical chart (Recharts)
- [x] Zustand for global UI state (selected stock, theme)
- [x] React Query for all data fetching, caching, background refetching, stale-while-revalidate
- [x] Loading indicators (skeletons, spinners)
- [x] Graceful error messages with retry
- [x] Fully responsive UI
- [x] Keyboard-accessible interactive elements
- [x] Semantic HTML5
- [x] Input validation on search
- [x] Unit tests with ≥ 70% coverage (≈ 97%)
- [x] README with setup, API key configuration and architecture
- [x] Dockerfile (multi-stage) and `docker-compose.yml`
- [x] `.env.example`

## Design Decisions & Trade-offs
- **Zustand for UI state only.** Minimal API, no provider, selector-based subscriptions so components re-render only for the slice they read. Server data deliberately lives in React Query, not the store, to avoid duplicated/stale caches.
- **React Query for all server state.** Polling, caching, retries and status flags come built in, removing hand-written `useEffect` fetching.
- **Service layer with mock fallback.** Components never know where data comes from, which keeps them testable and lets the app run without credentials.
- **Polling over WebSockets.** Free-tier APIs rarely expose sockets; polling with `refetchInterval` is simpler and reliable.
- **Plain CSS with custom properties.** No framework dependency; theming is a single attribute swap.
- **Client-side API key.** Acceptable for a front-end-only assignment; a production app should proxy requests through a backend.

## Future Improvements
- WebSocket streaming where the provider supports it
- Watchlist persisted per user
- Additional chart ranges (1D / 1W / 1M / 1Y) and candlestick view
- Server-side proxy to protect the API key
- Code-splitting the chart bundle
- End-to-end tests (Playwright/Cypress)

---

<div align="center">

Built by **Mohammad Riyaz** · For the Partnr Global Placement Program

</div>
