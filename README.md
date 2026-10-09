# StockPulse – Real-time Stock Price Tracker

A responsive, accessible single-page app that tracks stock prices in near real time. Built with **React + TypeScript + Vite**, **Zustand** for global UI state, **TanStack React Query** for data fetching/caching, and **Recharts** for charts.

## Features
- Popular-stocks list with loading skeleton and error/retry states
- Select a stock to see live price (polled every 10s), day stats and a 30-day interactive chart
- Search/filter with input validation
- Light/dark theme (persisted)
- Keyboard accessible, semantic HTML, ARIA live price updates, skip link, reduced-motion support
- Mobile-first responsive layout (375 / 768 / 1280px)
- Works out of the box with built-in mock data when no API key is set

## Screenshots
Add your screenshots to `screenshots/` and link them here:

| Mobile (375px) | Tablet (768px) | Desktop (1280px) |
|---|---|---|
| ![mobile](screenshots/mobile.png) | ![tablet](screenshots/tablet.png) | ![desktop](screenshots/desktop.png) |

## Demo video
[Watch the 2–5 minute demo](ADD_YOUR_VIDEO_LINK_HERE)

## Setup

### Environment variables
Copy `.env.example` to `.env` (Windows CMD: `copy .env.example .env`).

| Variable | Description |
|---|---|
| `VITE_STOCK_API_KEY` | [Twelve Data](https://twelvedata.com/) API key (free tier). Leave empty to use mock data. |
| `VITE_USE_MOCK` | `true` forces mock data even if a key is set. |
| `VITE_POLL_INTERVAL_MS` | Price refresh interval in ms (default `10000`). |

### Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

### Run with Docker Compose
```bash
docker compose up --build   # http://localhost:8080
```
Vite inlines `VITE_*` variables at **build time**, so `docker-compose.yml` passes them as build args. After changing `.env`, rebuild with `docker compose up --build`.

### Tests
```bash
npm test             # run once
npm run coverage     # with coverage report (threshold: 70%)
```

## Architecture
```
src/
  api/         stockService.ts (Twelve Data client + error mapping), mockData.ts (offline fallback)
  stores/      uiStore.ts (Zustand)
  hooks/       useStocks.ts (React Query hooks + query keys)
  components/  StockList, StockDetails, PriceChart, StockSearch, ThemeToggle, Feedback
  pages/       Dashboard.tsx
  utils/       format.ts, validation.ts
```

### State separation
| Kind of state | Where | Example |
|---|---|---|
| Server state | React Query | quotes, history |
| Global UI state | Zustand | selected symbol, theme |
| Local UI state | `useState` | search text, validation error |

### Why Zustand
Tiny API, no providers, selector-based subscriptions so components re-render only for the slice they use, and built-in `persist` middleware for the theme. Only preferences are persisted; the selection is transient.

### Why React Query
- **Polling:** `refetchInterval` on the quote query gives near real-time prices without a full reload.
- **Caching / stale-while-revalidate:** list cached 60s, history 5 min, quote ~5s; stale data is shown while refetching.
- **Resilience:** automatic retries with exponential backoff, `keepPreviousData` so the UI never blanks during refresh, and a retry button on failure.
- **Loading/error states** come from `isLoading`/`isError`; each panel handles its own state so one failure doesn't break the page.

### API & rate limits
Twelve Data's free tier allows ~8 credits/minute (one per symbol). To stay within it, the list is a single batched `/quote` call cached for 60s, only the **selected** stock is polled, and history is cached for 5 minutes. A 429 response is mapped to a friendly message and React Query retries automatically. Without an API key the app uses a mock service that simulates price movement.

### Accessibility
Semantic landmarks (`header`, `main`, `section`, `footer`), skip link, labelled search with `aria-invalid`/`role="alert"` errors, `aria-pressed` on the selected stock, price in an `aria-live` region, focus moved to the details heading on selection, text summary for the chart, and trend shown with arrows/signs (not colour alone).
