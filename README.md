# SmartLogger — Next.js Demo (Fullstack + MongoDB)

Minimal demo to pitch the concept: create a project, get an API key, ingest logs, and view basic stats.

## Quick Start
1. `cp .env.example .env.local` and fill `MONGODB_URI` + `API_KEY_PEPPER`
2. `npm i`
3. `npm run dev`
4. Open http://localhost:3000

## Pages
- `/` — Dashboard (stats)
- `/projects` — Create & list projects (copy API key once)
- `/tester` — Send sample logs with an API key

## API
- `POST /api/projects` — create project, returns API key (once)
- `GET /api/projects` — list projects (no keys)
- `POST /api/logs/ingest` — ingest logs (requires `x-api-key`)
- `GET /api/logs/search` — query logs (requires `x-api-key`)
- `GET /api/stats` — quick counts (requires `x-api-key`)

**Note:** This is a demo; no auth UI. Keep API key server-side in real use.
