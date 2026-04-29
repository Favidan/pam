# PAM — FastAPI + Angular

Modular, horizontally scalable full-stack application.  
Four modules shipped: **Todos** (REST CRUD), **Chat** (real-time WebSocket), **Risks & Issues** (risk/issue tracker), and **File Search / Indexation** (batch file indexation with full-text search).

---

## Table of Contents

1. [Stack](#stack)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
   - [Backend](#backend-architecture)
   - [Frontend](#frontend-architecture)
   - [Data Flow](#data-flow)
4. [Modules](#modules)
   - [Todos](#todos-module)
   - [Chat](#chat-module)
   - [Risks & Issues](#risks--issues-module)
   - [File Search / Indexation](#file-search--indexation-module)
5. [Setup & Local Development](#setup--local-development)
6. [Environment Variables](#environment-variables)
7. [Running the App](#running-the-app)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)
10. [Design Decisions](#design-decisions)
11. [Adding a New Module](#adding-a-new-module)
12. [Switching to PostgreSQL](#switching-to-postgresql)
13. [Docker (full stack)](#docker-full-stack)
14. [Horizontal Scaling](#horizontal-scaling)

---

## Stack

| Layer | Technology | Version |
|---|---|---|
| Backend | FastAPI | 0.115.x |
| ORM | SQLAlchemy (async) | 2.0.x |
| Validation | Pydantic v2 + pydantic-settings | 2.11+ |
| DB driver | aiosqlite (dev) / asyncpg (prod) | — |
| ASGI server | Uvicorn | 0.32.x |
| Scheduler | APScheduler (AsyncIOScheduler) | 3.10.x |
| HTTP client (backend) | httpx | 0.28.x |
| Frontend | Angular | 19 |
| HTTP client (frontend) | Angular HttpClient + RxJS | — |
| Styles | SCSS (component-scoped) | — |
| Runtime | Python 3.12+ · Node 18+ | — |
| Infra | Docker · docker-compose · Nginx | — |

---

## Project Structure

```
pam/
│
├── backend/
│   ├── app/
│   │   ├── main.py                          ← App factory, CORS, lifespan, router registration
│   │   ├── core/
│   │   │   ├── config.py                    ← Settings (pydantic-settings, .env)
│   │   │   └── database.py                  ← Async engine, session factory, init_db
│   │   ├── shared/
│   │   │   ├── base_model.py                ← TimestampMixin (created_at / updated_at)
│   │   │   └── base_schema.py               ← BaseSchema, TimestampSchema, PaginatedResponse
│   │   └── modules/
│   │       ├── todos/                       ← REST CRUD (title, description, completed)
│   │       │   ├── models.py
│   │       │   ├── schemas.py
│   │       │   ├── service.py
│   │       │   ├── router.py
│   │       │   └── __init__.py
│   │       ├── chat/                        ← WebSocket real-time chat
│   │       │   ├── models.py
│   │       │   ├── schemas.py
│   │       │   ├── service.py
│   │       │   ├── connection_manager.py
│   │       │   ├── router.py
│   │       │   └── __init__.py
│   │       ├── risks_issues/                ← Risk & issue tracker
│   │       │   ├── models.py
│   │       │   ├── schemas.py
│   │       │   ├── service.py
│   │       │   ├── router.py
│   │       │   └── __init__.py
│   │       └── indexation/                  ← File indexation & full-text search
│   │           ├── __init__.py
│   │           ├── config.py                ← Indexation-specific settings
│   │           ├── exceptions.py
│   │           ├── models.py                ← IndexedFile, FileContent, IndexJob, SourceConfig
│   │           ├── schemas.py               ← Search, job, source, stats Pydantic models
│   │           ├── service.py               ← SearchService, JobService, SourceService combined
│   │           ├── router.py                ← 11 endpoints under /indexation
│   │           ├── adapters/
│   │           │   ├── __init__.py          ← AdapterRegistry bootstrap
│   │           │   ├── base.py              ← SourceAdapter ABC + ChangeEvent + AdapterRegistry
│   │           │   └── local_fs.py          ← LocalFsAdapter (filesystem walks + deletion detection)
│   │           └── workers/
│   │               ├── __init__.py
│   │               ├── extractor.py         ← Plain-text content extraction
│   │               ├── indexer.py           ← Job orchestration, per-file processing, hash dedup
│   │               └── scheduler.py         ← APScheduler daily cron bootstrap
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── main.ts
│   │   ├── index.html
│   │   ├── styles.scss
│   │   ├── environments/
│   │   │   ├── environment.ts               ← apiUrl (dev)
│   │   │   └── environment.prod.ts          ← apiUrl (prod)
│   │   └── app/
│   │       ├── app.module.ts
│   │       ├── app-routing.module.ts        ← Lazy routes: /todos, /chat, /risks-issues, /indexation
│   │       ├── app.component.*              ← Shell (navbar + router-outlet)
│   │       ├── core/
│   │       │   ├── services/api.service.ts  ← Generic HTTP wrapper
│   │       │   └── interceptors/http-error.interceptor.ts
│   │       ├── shared/shared.module.ts      ← Re-exports CommonModule + ReactiveFormsModule
│   │       └── modules/
│   │           ├── todos/
│   │           ├── chat/
│   │           ├── risks-issues/
│   │           └── indexation/              ← File Search feature module
│   │               ├── indexation.module.ts
│   │               ├── indexation-routing.module.ts  ← /search, /admin, /files/:id
│   │               ├── models/indexation.model.ts
│   │               ├── pipes/safe-snippet.pipe.ts    ← <mark>-safe HTML binding
│   │               ├── services/
│   │               │   ├── indexation-api.service.ts ← All HTTP calls
│   │               │   ├── search-state.service.ts   ← BehaviorSubject search state
│   │               │   └── job-polling.service.ts    ← 2-second polling Observable
│   │               └── components/
│   │                   ├── search-page/     ← Search bar, facet filters, result list
│   │                   ├── file-detail-page/← Metadata table + extracted text
│   │                   └── admin-page/      ← Job history, manual trigger, source management
│   ├── angular.json
│   ├── tsconfig.json
│   ├── proxy.conf.json
│   ├── nginx.conf
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Architecture

### Backend Architecture

```
HTTP Request
      │
      ▼
  FastAPI Router (app/modules/<name>/router.py)
      │
      ├── Depends(get_db) ──► AsyncSession (SQLAlchemy)
      │
      ▼
  Service Layer (service.py)
      │   Pure business logic. No HTTP context. Testable in isolation.
      │
      ▼
  SQLAlchemy Models (models.py)
      │
      ▼
  Database (SQLite dev / PostgreSQL prod)
```

**Key conventions:**

- `app/core/` — infrastructure only, no business logic.
- `app/shared/` — reusable mixins and base schemas shared across modules.
- Each `modules/<name>/` is self-contained: models, schemas, service, router. No module imports another module.
- The only files that change when adding a module are `main.py` (one `include_router` line). Tables are auto-created via `Base.metadata.create_all` on startup.
- All DB sessions are async (`AsyncSession`). `get_db` commits on success and rolls back on exception.

**Indexation pipeline:**

```
Trigger (cron 02:00 UTC or POST /jobs/run)
      │
      ▼
  IndexationWorker (workers/indexer.py)
      │  asyncio.Lock — prevents concurrent runs
      │
      ├── For each enabled SourceConfig row:
      │     └── SourceAdapter.list_changes(since_token)
      │           └── ChangeEvent stream
      │
      ├── Per file (isolated transaction):
      │     ├── adapter.open_file(source_id) → stream
      │     ├── SHA-256 hash → skip if unchanged
      │     ├── extractor.extract_text() → plain text
      │     └── Upsert IndexedFile + FileContent
      │
      └── IndexJob row updated with counters + status
```

**`ConnectionManager`** (`chat/connection_manager.py`):

In-process singleton `{ room: [WebSocket, ...] }`. See [Horizontal Scaling](#horizontal-scaling) for the Redis Pub/Sub upgrade path.

---

### Frontend Architecture

```
AppModule (root)
 ├── AppRoutingModule  ← lazy routes
 ├── HttpClientModule
 └── HTTP_INTERCEPTORS: [HttpErrorInterceptor]

Lazy-loaded feature bundles:
 ├── /todos         → TodosModule
 ├── /chat          → ChatModule
 ├── /risks-issues  → RisksIssuesModule
 └── /indexation    → IndexationModule
      ├── /search        ← SearchPageComponent
      ├── /admin         ← AdminPageComponent
      └── /files/:id     ← FileDetailPageComponent
```

**Layer responsibilities:**

| Layer | Files | Responsibility |
|---|---|---|
| Shell | `app.component.*`, `app-routing.module.ts` | Navbar, router outlet, lazy route registration |
| Core | `core/services/api.service.ts` | Single `HttpClient` wrapper |
| Core | `core/interceptors/http-error.interceptor.ts` | `HttpErrorResponse` → readable `Error` |
| Shared | `shared/shared.module.ts` | `CommonModule` + `ReactiveFormsModule` for all feature modules |
| Feature | `modules/<name>/services/<name>.service.ts` | Domain logic, calls `ApiService` |
| Indexation | `services/search-state.service.ts` | `BehaviorSubject`-driven reactive search state |
| Indexation | `services/job-polling.service.ts` | 2-second polling with `takeWhile(status === 'running')` |
| Indexation | `pipes/safe-snippet.pipe.ts` | Safely renders `<mark>`-tagged snippets via `DomSanitizer` |

---

### Data Flow

#### File Search

```
SearchPageComponent (user types query)
  └─ SearchStateService.update({ text })
       └─ BehaviorSubject → debounce 300ms → distinctUntilChanged
            └─ IndexationApiService.search(query)
                 └─ GET /api/v1/indexation/files/search?q=...
                      └─ IndexationService.search() → LIKE query → FileSearchResponse JSON
                           (rank + <mark> snippet built in Python)
```

#### Indexation Job

```
AdminPageComponent ("Run now" click)
  └─ IndexationApiService.triggerJob()
       └─ POST /api/v1/indexation/jobs/run  → 202 Accepted
            └─ FastAPI BackgroundTask → run_job()
                 ├─ asyncio.Lock acquired
                 ├─ IndexJob row created (status=running)
                 ├─ LocalFsAdapter.list_changes(since_token)
                 │   └─ os.walk → mtime filter → ChangeEvent stream
                 ├─ Per file: SHA-256 hash → extract_text → upsert
                 └─ IndexJob updated (status=success/failed, counters)

JobPollingService.watchLatest()  ← timer(0, 2000) → GET /jobs
  └─ AdminPageComponent updates live counters
```

---

## Modules

### Todos Module

Simple task list. Supports `completed` toggle, description, and paginated listing.

- Route: `/todos`
- API prefix: `/api/v1/todos`

### Chat Module

Real-time group chat over WebSocket. Rooms are created on first connection and persist in the database. History is loaded via REST on join.

- Route: `/chat`
- API prefix: `/api/v1/chat`

### Risks & Issues Module

Tracks project risks and issues with type (risk/issue), status, priority, probability, impact, owner, and due date. Includes an alerts endpoint for items due within N days.

- Route: `/risks-issues`
- API prefix: `/api/v1/risks-issues`

### File Search / Indexation Module

Indexes file metadata and text content from configured local filesystem paths. Runs as a daily scheduled batch (02:00 UTC) and on manual demand. Provides full-text search with facets, snippets, and pagination.

- Routes: `/indexation/search`, `/indexation/admin`, `/indexation/files/:id`
- API prefix: `/api/v1/indexation`

**Capabilities:**
- Indexes filename, path, size, timestamps, and MIME type for all files.
- Extracts and indexes text content from plain-text file types (`.txt`, `.md`, `.csv`, `.json`, `.xml`, `.py`, `.js`, `.ts`, `.html`, `.scss`, `.sql`, and 40+ more).
- Skips re-extraction when file content has not changed (SHA-256 hash comparison).
- Soft-deletes files that are removed from source directories.
- Daily cron via APScheduler; falls back gracefully if APScheduler is not installed.
- Pluggable adapter pattern — add new sources (OneDrive, S3, Google Drive) by implementing one class.

---

## Setup & Local Development

### Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Python | 3.12 | 3.14 works; requires `pydantic>=2.11` for native wheels |
| Node.js | 18 | 20+ recommended |
| npm | 9+ | bundled with Node |
| Git | any | — |

> **Python 3.14 note:** `pydantic-core` < 2.46 has no Python 3.14 wheel and requires a Rust build that fails on most systems. `requirements.txt` already pins `pydantic>=2.11` which ships a 3.14 wheel (`pydantic-core 2.46+`).

---

### Initial configuration

Copy the example environment file before first run:

**Windows (Command Prompt):**
```bat
copy backend\.env.example backend\.env
```

**macOS / Linux / Git Bash:**
```bash
cp backend/.env.example backend/.env
```

The defaults work for local development. Edit `backend\.env` only if you need non-default values — see [Environment Variables](#environment-variables) for the full reference.

---

### Backend setup

```bash
cd backend

# 1. Create virtual environment
python -m venv .venv

# 2. Activate
# Windows Command Prompt:
.venv\Scripts\activate
# Windows PowerShell:
.venv\Scripts\Activate.ps1
# macOS / Linux / Git Bash:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

> **Do not move or rename the project folder after creating the venv.**  
> Python venvs store absolute paths internally. If you move the folder, delete and recreate the venv (see [Troubleshooting](#troubleshooting)).

---

### Frontend setup

```bash
cd frontend
npm install
```

> Angular CLI is installed locally as a dev dependency. Use `npx ng ...` instead of the global `ng` command to guarantee version consistency.

#### TypeScript path aliases

| Alias | Resolves to |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@modules/*` | `src/app/modules/*` |
| `@env/*` | `src/environments/*` |

#### Angular 19 + NgModules

Angular 19 defaults new components to `standalone: true`. This project uses NgModules for feature isolation, so every `@Component` carries `standalone: false`. The `angular.json` schematics section enforces this for `ng generate`:

```json
"schematics": {
  "@schematics/angular:component": { "style": "scss", "standalone": false },
  "@schematics/angular:module":    { "standalone": false }
}
```

---

## Environment Variables

All variables live in `backend/.env`. The app reads them via `pydantic-settings`. None are required — defaults work locally.

### Core application

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `PAM` | Shown in OpenAPI docs title |
| `APP_ENV` | `development` | `development` enables SQL echo; `production` disables it |
| `DATABASE_URL` | `sqlite+aiosqlite:///./pam.db` | Async SQLAlchemy connection URL |
| `CORS_ORIGINS` | `["http://localhost:4200"]` | JSON array of allowed CORS origins |

### Indexation module

| Variable | Default | Description |
|---|---|---|
| `INDEXATION_CRON_HOUR` | `2` | Hour (UTC) for the daily scheduled run |
| `INDEXATION_CRON_MINUTE` | `0` | Minute (UTC) for the daily scheduled run |
| `INDEXATION_MAX_FILE_SIZE_MB` | `50` | Files larger than this skip text extraction; only metadata is indexed |
| `INDEXATION_EXTRACTION_TIMEOUT_S` | `60` | Per-file extraction timeout in seconds (reserved for future Tika integration) |
| `INDEXATION_MAX_TEXT_CHARS` | `5000000` | Maximum characters stored per file (≈ 5 MB) |
| `INDEXATION_SCHEDULER_ENABLED` | `true` | Set to `false` to disable the APScheduler cron entirely |
| `INDEXATION_DEFAULT_LOCAL_ROOT` | *(empty)* | Optional convenience default used by tooling; sources are managed via the Admin UI or API |

### OneDrive / Microsoft Graph (future)

These are referenced in the design but not yet active. Prepare them when adding the OneDrive adapter:

| Variable | Description |
|---|---|
| `MS_GRAPH_TENANT_ID` | Azure AD tenant ID |
| `MS_GRAPH_CLIENT_ID` | App registration client ID |
| `MS_GRAPH_CLIENT_SECRET` | App registration client secret (store in a secret manager, not in `.env` in production) |
| `MS_GRAPH_DRIVE_ID` | Optional: specific OneDrive drive ID; defaults to the user's personal drive |

**Example `.env` for development:**

```env
APP_ENV=development
DATABASE_URL=sqlite+aiosqlite:///./pam.db
CORS_ORIGINS=["http://localhost:4200"]

# Indexation
INDEXATION_CRON_HOUR=2
INDEXATION_CRON_MINUTE=0
INDEXATION_MAX_FILE_SIZE_MB=50
INDEXATION_SCHEDULER_ENABLED=true
```

---

## Running the App

### Option A — Quick start (Windows)

From the project root, double-click `start.bat` or run it in a terminal:

```bat
start.bat
```

This opens two separate terminal windows (backend + frontend) and automatically opens `http://localhost:4200` in your browser after 20 seconds.

**Prerequisites:** `.venv` and `node_modules` must already exist. The script checks for both and prints a clear error if either is missing.

---

### Option B — Manual (two terminals)

**Terminal 1 — Backend**

```bash
cd backend

# Windows:
.venv\Scripts\activate
# macOS / Linux:
source .venv/bin/activate

uvicorn app.main:app --reload
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm start
```

App: **http://localhost:4200**

The dev server proxies `/api/*` requests to `http://localhost:8000` via `proxy.conf.json`.

---

### Available URLs (backend)

| URL | Description |
|---|---|
| `http://localhost:8000/api/docs` | Swagger UI (interactive API explorer) |
| `http://localhost:8000/api/redoc` | ReDoc (readable API reference) |
| `http://localhost:8000/api/v1/todos` | Todos API |
| `http://localhost:8000/api/v1/chat/rooms` | Chat rooms API |
| `http://localhost:8000/api/v1/risks-issues` | Risks & Issues API |
| `http://localhost:8000/api/v1/indexation/files/search` | File search API |
| `http://localhost:8000/api/v1/indexation/jobs` | Indexation jobs API |
| `http://localhost:8000/api/v1/indexation/sources` | Source config API |
| `http://localhost:8000/api/v1/indexation/stats` | Indexation statistics |
| `ws://localhost:8000/api/v1/chat/{room}/ws?author=Alice` | Chat WebSocket |

---

### First-time indexation setup

After starting the app, open **http://localhost:4200/indexation/admin** and:

1. Click **+ Add source**.
2. Enter a name (e.g. `My Documents`) and the local folder path to index (e.g. `C:\Users\YourName\Documents`).
3. Click **Save**.
4. Click **Run indexation now**.
5. The counters update live while the job runs.
6. Once complete, go to **http://localhost:4200/indexation/search** and start searching.

> **Windows paths:** Use the full absolute Windows path (e.g. `C:\Users\Admin\Projects`). The adapter resolves symlinks and blocks traversal outside the configured root.

---

## Troubleshooting

### "Fatal error in launcher: Unable to create process" (broken venv path)

**Cause:** After moving or renaming the project folder, the venv's embedded absolute paths are stale.

**Fix:**

```bat
cd backend
rmdir /s /q .venv
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

macOS / Linux:
```bash
cd backend && rm -rf .venv && python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt
```

The `pam.db` database and `.env` are unaffected.

---

### `start.bat` opens windows but services fail to start

| Symptom | Fix |
|---|---|
| "The system cannot find the path specified" in backend window | Broken venv path — see above |
| "'npm' is not recognized" | Install Node.js from nodejs.org and restart terminal |
| "node_modules not found" in launcher | Run `npm install` in `frontend/` first |
| "Python venv not found" in launcher | Run backend setup steps first |

---

### Port already in use

```bash
# Backend on a different port:
uvicorn app.main:app --reload --port 8001

# Frontend on a different port:
npm start -- --port 4201
```

If you change the backend port, also update `CORS_ORIGINS` in `.env` and the proxy target in `frontend/proxy.conf.json`.

---

### Indexation job stays "running" after backend restart

If the backend crashes mid-job, the `index_jobs` row is left with `status=running`. The next job start automatically recovers stale running rows (marks them `failed`) before creating a new job. No manual intervention is needed.

---

### APScheduler not installed — daily cron disabled

If `apscheduler` is not in the environment, the daily cron is silently disabled on startup with a warning log:

```
WARNING: APScheduler not installed; daily indexation cron disabled.
Manual runs via POST /api/v1/indexation/jobs/run still work.
```

Fix: `pip install apscheduler==3.10.4` or ensure `requirements.txt` is fully installed.

---

### Search returns no results after adding a source

The indexer must run at least once after a source is configured. Trigger a run from the Admin page or via:

```bash
curl -X POST http://localhost:8000/api/v1/indexation/jobs/run
```

---

### Search returns only files from the last-indexed folder

Fixed. Earlier builds keyed `IndexedFile` rows on `(source_type, source_id)` only. When a job processed a second `local` source, the deletion-reconciliation step queried *all* non-deleted local files and soft-deleted everything that wasn't under the second folder's root — wiping the first folder from search results.

The schema now has an `IndexedFile.source_config_id` foreign key on `source_configs.id`, the unique key is `(source_config_id, source_id)`, and `_reconcile_deletions` scopes its query by `source_config_id`. Multiple folders of the same `source_type` now coexist correctly.

If you have a `pam.db` from before the fix, delete it (no Alembic migration is shipped — `Base.metadata.create_all` does not add columns to existing tables) and re-run the indexer.

---

## API Reference

### Todos

| Method | Path | Body / Params | Response |
|---|---|---|---|
| `GET` | `/api/v1/todos` | `?page=1&size=20&completed=` | `TodoListResponse` |
| `POST` | `/api/v1/todos` | `TodoCreate` | `TodoResponse` 201 |
| `GET` | `/api/v1/todos/{id}` | — | `TodoResponse` |
| `PATCH` | `/api/v1/todos/{id}` | `TodoUpdate` | `TodoResponse` |
| `DELETE` | `/api/v1/todos/{id}` | — | 204 |

---

### Chat

| Method | Path | Params | Response |
|---|---|---|---|
| `GET` | `/api/v1/chat/rooms` | — | `RoomListResponse` |
| `GET` | `/api/v1/chat/{room}/messages` | `?limit=50` | `MessageResponse[]` |
| `WS` | `/api/v1/chat/{room}/ws` | `?author=string` | — |

**WebSocket events (server → client):**

```jsonc
// New message
{ "type": "message", "id": 1, "room": "general", "author": "Alice",
  "content": "hello", "created_at": "2026-04-24T10:00:00", "users": 2 }

// Join / leave
{ "type": "system", "room": "general", "author": "system",
  "content": "Alice joined the room", "users": 2 }
```

---

### Risks & Issues

| Method | Path | Params | Response |
|---|---|---|---|
| `GET` | `/api/v1/risks-issues/alerts` | `?days_ahead=7` | `RiskIssueResponse[]` |
| `GET` | `/api/v1/risks-issues` | `?page&size&type&status` | `RiskIssueListResponse` |
| `POST` | `/api/v1/risks-issues` | `RiskIssueCreate` | `RiskIssueResponse` 201 |
| `GET` | `/api/v1/risks-issues/{id}` | — | `RiskIssueResponse` |
| `PATCH` | `/api/v1/risks-issues/{id}` | `RiskIssueUpdate` | `RiskIssueResponse` |
| `DELETE` | `/api/v1/risks-issues/{id}` | — | 204 |

---

### Indexation

#### File Search & Detail

| Method | Path | Params | Response |
|---|---|---|---|
| `GET` | `/api/v1/indexation/files/search` | see below | `FileSearchResponse` |
| `GET` | `/api/v1/indexation/files/{id}` | — | `FileDetailResponse` |
| `GET` | `/api/v1/indexation/files/{id}/download` | — | file stream |

**Search query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `q` | string | `""` | Search expression — matched against filename and extracted text |
| `source` | string (repeatable) | — | Filter by source type: `local`, `onedrive` |
| `ext` | string (repeatable) | — | Filter by extension (without dot): `pdf`, `txt`, `py` |
| `modified_after` | ISO 8601 datetime | — | Include only files modified after this timestamp |
| `modified_before` | ISO 8601 datetime | — | Include only files modified before this timestamp |
| `page` | int | `1` | Page number (1-based) |
| `page_size` | int | `20` | Results per page (max 100) |
| `sort` | string | `relevance` | `relevance` · `modified_desc` · `name_asc` |

**`FileSearchResponse`:**

```json
{
  "total": 1234,
  "page": 1,
  "page_size": 20,
  "items": [
    {
      "id": 42,
      "filename": "Q3_report.md",
      "full_path": "/data/finance/Q3_report.md",
      "source_type": "local",
      "extension": "md",
      "size_bytes": 8192,
      "modified_at_source": "2026-04-25T14:32:11Z",
      "rank": 5.2,
      "snippet": "...revenue grew <mark>15 percent</mark> in <mark>Q3</mark>..."
    }
  ],
  "facets": {
    "source_type": [{ "value": "local", "count": 412 }],
    "extension":   [{ "value": "md", "count": 230 }]
  }
}
```

#### Jobs

| Method | Path | Params | Response |
|---|---|---|---|
| `GET` | `/api/v1/indexation/jobs` | `?limit=50` | `JobSummary[]` |
| `GET` | `/api/v1/indexation/jobs/{id}` | — | `JobSummary` |
| `POST` | `/api/v1/indexation/jobs/run` | `{"sources": ["local"]}` (optional) | `JobRunResponse` 202 |

`POST /jobs/run` returns **202 Accepted** immediately; the job runs in the background. Returns **409 Conflict** if a job is already running. Poll `GET /jobs/{id}` or `GET /jobs` to track progress.

**`JobSummary`:**

```json
{
  "id": 7,
  "triggered_by": "manual",
  "triggered_by_user_id": null,
  "status": "success",
  "started_at": "2026-04-27T02:00:01Z",
  "finished_at": "2026-04-27T02:04:33Z",
  "files_added": 142,
  "files_updated": 23,
  "files_deleted": 5,
  "files_failed": 0,
  "error_message": null
}
```

#### Sources

| Method | Path | Body | Response |
|---|---|---|---|
| `GET` | `/api/v1/indexation/sources` | — | `SourceConfig[]` |
| `POST` | `/api/v1/indexation/sources` | `SourceConfigCreate` | `SourceConfig` 201 |
| `PATCH` | `/api/v1/indexation/sources/{id}` | `SourceConfigUpdate` | `SourceConfig` |
| `DELETE` | `/api/v1/indexation/sources/{id}` | — | 204 |

**`SourceConfigCreate` (local filesystem):**

```json
{
  "source_type": "local",
  "name": "My Documents",
  "enabled": true,
  "config": {
    "root_path": "C:\\Users\\Admin\\Documents",
    "excluded_dirs": ["node_modules", ".git"],
    "included_extensions": ["pdf", "md", "txt"]
  }
}
```

> `excluded_dirs` and `included_extensions` are optional. When `included_extensions` is empty, all file types are indexed.

#### Statistics

| Method | Path | Response |
|---|---|---|
| `GET` | `/api/v1/indexation/stats` | `IndexationStats` |

```json
{
  "total_files": 5200,
  "total_deleted": 47,
  "total_size_bytes": 1073741824,
  "by_source": { "local": 5200 },
  "by_extension": { "md": 1200, "py": 800, "txt": 600 }
}
```

---

## Design Decisions

### Why NgModules instead of standalone components?

Angular 19 recommends standalone components, but NgModules provide a stronger isolation boundary for feature teams. Each module owns its declarations and can be moved or replaced without touching siblings. The shared `SharedModule` eliminates repetitive `CommonModule` / `ReactiveFormsModule` imports.

### Why one `ApiService` instead of direct `HttpClient` use?

Centralising HTTP calls means auth headers, base URL, or request serialization changes need editing exactly one file. Feature services stay focused on domain logic.

### Why a session-per-message pattern for WebSocket?

A WebSocket "request" lasts the entire connection — potentially hours. Opening one session per connection risks long-lived transactions blocking writes. Creating a short `AsyncSessionLocal()` context per received message is safer under load.

### Why `signal()` for component state?

Angular Signals (stable since v17) offer synchronous state reads without `BehaviorSubject` subscription boilerplate. They are also change-detection aware, removing the need for `ChangeDetectorRef.markForCheck()` in `OnPush` components.

### Why SQLite for development?

Zero configuration — the DB file is created automatically on first run. Swapping to PostgreSQL requires only one environment variable change (see [Switching to PostgreSQL](#switching-to-postgresql)).

### Why not Tika for content extraction?

The indexation module design document specifies Apache Tika (via Docker sidecar) as the recommended extraction engine for binary formats (PDF, DOCX, XLSX, etc.). The current implementation extracts plain-text MIME types directly to avoid the Tika/Docker dependency for the initial MVP. The `extractor.py` interface is identical to the Tika HTTP wrapper shown in the design — swapping it in is a single-file change with no API or service changes.

### Why `BehaviorSubject` for search state instead of signals?

The `SearchStateService` chains RxJS operators (`debounceTime`, `distinctUntilChanged`, `switchMap`, `shareReplay`) that have no direct Angular Signals equivalent. `BehaviorSubject` + RxJS is the natural fit for this reactive pipeline. Individual component state still uses signals.

### Why APScheduler instead of Celery for scheduling?

APScheduler runs in-process with the FastAPI app and requires no additional infrastructure (no Redis broker, no worker process). For single-instance deployments this is sufficient and simpler to operate. If horizontal scaling is added, swap to Celery Beat (which is queue-based and worker-count agnostic) without changing the `run_job` function.

---

## Adding a New Module

### Backend

```bash
mkdir backend/app/modules/notes
touch backend/app/modules/notes/__init__.py
```

**1. `models.py`**
```python
from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base
from app.shared.base_model import TimestampMixin

class Note(Base, TimestampMixin):
    __tablename__ = "notes"
    id      = Column(Integer, primary_key=True, index=True)
    title   = Column(String(255), nullable=False)
    content = Column(Text, nullable=True)
```

**2. `schemas.py`**
```python
from app.shared.base_schema import BaseSchema, TimestampSchema

class NoteCreate(BaseSchema):
    title: str
    content: str | None = None

class NoteResponse(TimestampSchema):
    id: int
    title: str
    content: str | None
```

**3. `service.py`**
```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.modules.notes.models import Note
from app.modules.notes.schemas import NoteCreate

class NoteService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> list[Note]:
        result = await self.db.execute(select(Note))
        return result.scalars().all()

    async def create(self, payload: NoteCreate) -> Note:
        note = Note(**payload.model_dump())
        self.db.add(note)
        await self.db.flush()
        await self.db.refresh(note)
        return note
```

**4. `router.py`**
```python
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.modules.notes.schemas import NoteCreate, NoteResponse
from app.modules.notes.service import NoteService

router = APIRouter(prefix="/notes", tags=["Notes"])

def get_service(db: AsyncSession = Depends(get_db)):
    return NoteService(db)

@router.get("", response_model=list[NoteResponse])
async def list_notes(service: NoteService = Depends(get_service)):
    return await service.get_all()

@router.post("", response_model=NoteResponse, status_code=status.HTTP_201_CREATED)
async def create_note(payload: NoteCreate, service: NoteService = Depends(get_service)):
    return await service.create(payload)
```

**5. `__init__.py`**
```python
from .router import router
```

**6. Register in `app/main.py`** — the only existing file to touch:
```python
from app.modules.notes import router as notes_router
# ...
app.include_router(notes_router, prefix="/api/v1")
```

Tables are created automatically on next startup by `init_db()`.

---

### Frontend

```bash
cd frontend
npx ng generate module modules/notes --routing --route notes --module app
```

Then create the standard files:

```
modules/notes/
├── models/note.model.ts
├── services/note.service.ts
└── components/note-list/
    ├── note-list.component.ts   (standalone: false)
    ├── note-list.component.html
    └── note-list.component.scss
```

**`note.service.ts`**
```typescript
import { Injectable } from '@angular/core';
import { ApiService } from '@core/services/api.service';

@Injectable({ providedIn: 'root' })
export class NoteService {
  constructor(private api: ApiService) {}
  getAll()               { return this.api.get<Note[]>('/notes'); }
  create(p: NoteCreate)  { return this.api.post<Note>('/notes', p); }
}
```

Add the component to `notes.module.ts` declarations, add `SharedModule` to imports, then add a nav link in `app.component.html`:

```html
<a routerLink="/notes" routerLinkActive="active">Notes</a>
```

---

## Switching to PostgreSQL

**1. Add the async driver**
```bash
pip install asyncpg
echo "asyncpg>=0.30.0" >> backend/requirements.txt
```

**2. Update `backend/.env`**
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/pam
```

No code changes required — SQLAlchemy and the app factory are database-agnostic.

**3. (Recommended) Use Alembic for migrations**
```bash
pip install alembic
alembic init alembic
```

Update `alembic/env.py` to import `Base` from `app.core.database` and use the async engine pattern. Generate the first migration:
```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

**4. Indexation full-text search upgrade**

When migrating to PostgreSQL, replace the LIKE-based search in `service.py` with the `tsvector` / `ts_headline` SQL shown in the design document (section 5.2). The `IndexationService.search()` method interface is unchanged — only the query body needs updating.

---

## Docker (full stack)

```bash
# Build and start everything
docker compose up --build

# Stop
docker compose down
```

| Service | URL |
|---|---|
| Frontend (Nginx) | http://localhost |
| Backend (uvicorn) | http://localhost:8000 |
| API docs | http://localhost:8000/api/docs |

**`docker-compose.yml` topology:**

```
[Browser]
    │
    ├── :80  → [Nginx container]
    │              ├── /        → Angular build
    │              └── /api/*   → proxy → backend:8000
    │
    └── :8000 → [Uvicorn container]
                    └── pam.db (volume-mounted)
```

**Adding PostgreSQL:**

```yaml
services:
  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: pam
      POSTGRES_PASSWORD: secret
      POSTGRES_DB: pam
    volumes:
      - pg_data:/var/lib/postgresql/data

  backend:
    environment:
      - DATABASE_URL=postgresql+asyncpg://pam:secret@db:5432/pam
    depends_on:
      - db

volumes:
  pg_data:
```

**Adding Apache Tika (for binary file extraction):**

When ready to enable PDF/DOCX/XLSX extraction in the indexation module, add Tika as a sidecar:

```yaml
services:
  tika:
    image: apache/tika:latest-full
    restart: unless-stopped
    environment:
      JAVA_TOOL_OPTIONS: "-Xmx2g"
    expose:
      - "9998"
    healthcheck:
      test: ["CMD", "curl", "-fsS", "http://localhost:9998/tika"]
      interval: 30s
      timeout: 5s
      retries: 3

  backend:
    depends_on:
      tika:
        condition: service_healthy
    environment:
      - INDEXATION_TIKA_URL=http://tika:9998
```

Then update `workers/extractor.py` to call Tika over HTTP for binary MIME types.

---

## Horizontal Scaling

### Backend (stateless REST + indexation)

FastAPI/Uvicorn is stateless for all REST endpoints. To scale:

1. Run multiple Uvicorn instances (or Gunicorn with `UvicornWorker`).
2. Place a load balancer (Nginx, AWS ALB, Traefik) in front.
3. All instances share the same database.

**Scheduler note:** When running multiple backend instances, only one should run the APScheduler cron. Pin it with an environment flag:

```python
# workers/scheduler.py — already guarded by:
if not indexation_settings.INDEXATION_SCHEDULER_ENABLED:
    return
```

Set `INDEXATION_SCHEDULER_ENABLED=false` on all instances except the designated scheduler instance. Alternatively, switch to Celery Beat which is inherently single-scheduler by design.

### Chat WebSocket (stateful)

`ConnectionManager` is an in-process dict. For multi-instance deployments, replace the `broadcast` method with Redis Pub/Sub:

```python
import redis.asyncio as redis

r = redis.from_url("redis://localhost")

async def broadcast(room: str, payload: dict):
    await r.publish(f"chat:{room}", json.dumps(payload))

# Each instance subscribes on startup and forwards to its local sockets
```
