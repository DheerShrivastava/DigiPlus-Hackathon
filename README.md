# DigiPlus Smart Leads Agent

End-to-end system for Mumbai billboard vacancy detection, AI lead scoring, pitch generation, and sales cockpit dashboard.

## Quick Start (Demo)

### 1. Backend (API + Pipeline)

```bash
cd backend
npm install
cp .env.example .env    # optional – edit GEMINI_API_KEY, SMTP_* later
npm start               # runs on http://localhost:8000
```

### 2. Frontend (React Dashboard)

```bash
cd frontend
npm install
npm run dev             # runs on http://localhost:3000
```

Login with any email/password. The dashboard pulls live data from the backend API.

## Architecture

```
CSV Data (data/) → DataStore → Vacancy Pipeline → REST API → React Frontend
                      ↓
              store.json (persists CRUD changes)
```

### Backend Pipeline Flow

1. **Load** – Reads `data/hoardings.csv`, `bookings.csv`, `customers.csv` on startup
2. **Detect Vacancies** – Finds sites with bookings ending within 90 days AND no follow-on booking
3. **Score Leads** – Ranks customers by budget, relationship, booking history, industry fit
4. **Cache Results** – Stores vacancy + map status for fast API responses
5. **Persist Changes** – Add/edit/delete hoardings saved to `backend/data/store.json`

### Key API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/login` | POST | JWT login |
| `/hoardings` | GET/POST/PUT/DELETE | Hoarding CRUD |
| `/vacancies` | GET | Upcoming 90-day vacancies with top-3 leads |
| `/vacancies/:site_id/leads` | GET | Full ranked lead list for a site |
| `/pitch/generate` | POST | AI pitch (Gemini or template) |
| `/email/send` | POST | Send pitch via SMTP |
| `/pipeline/run` | POST | Re-run vacancy pipeline |
| `/pipeline/refresh` | POST | Refresh pipeline (optionally reload CSV) |
| `/pipeline/status` | GET | Pipeline metadata |
| `/map/heatmap` | GET | Map pin data with status colors |
| `/analytics/summary` | GET | Dashboard metrics |

## Configuration (.env)

Copy `backend/.env.example` to `backend/.env`:

| Variable | Default | Purpose |
|----------|---------|---------|
| `REFERENCE_DATE` | 2026-08-01 | Simulated "today" for vacancy detection |
| `VACANCY_WINDOW_DAYS` | 90 | How far ahead to scan |
| `RATE_MARKUP_FACTOR` | 1.0 | Multiplier on monthly_rate for suggested price |
| `GEMINI_API_KEY` | (empty) | Google Gemini – falls back to template pitch |
| `SMTP_*` | (empty) | Email – falls back to console log |

## Team

- Dheer Shrivastava
- Aditya Shrivas
- Adarsh Singh
