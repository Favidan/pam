# PAM — FastAPI + Angular

Modular, horizontally scalable full-stack application.  
Two modules shipped: **Todos** (REST CRUD) and **Chat** (real-time WebSocket).

---

## Table of Contents

1. [Stack](#stack)
2. [Project Structure](#project-structure)
3. [Architecture](#architecture)
   - [Backend](#backend-architecture)
   - [Frontend](#frontend-architecture)
   - [Data Flow](#data-flow)
4. [Setup & Local Development](#setup--local-development)
5. [Running the App](#running-the-app)
6. [Troubleshooting](#troubleshooting)
7. [API Reference](#api-reference)
8. [Design Decisions](#design-decisions)
9. [Adding a New Module](#adding-a-new-module)
10. [Switching to PostgreSQL](#switching-to-postgresql)
11. [Docker (full stack)](#docker-full-stack)
12. [Horizontal Scaling](#horizontal-scaling)

---

## Stack

| Layer    | Technology | Version |
|----------|-----------|---------|
| Backend  | FastAPI   | 0.115.x |
| ORM      | SQLAlchemy (async) | 2.0.x |
| Validation | Pydantic v2 + pydantic-settings | 2.11+ |
| DB driver | aiosqlite (dev) / asyncpg (prod) | — |
| ASGI server | Uvicorn | 0.32.x |
| Frontend | Angular | 19 |
| HTTP client | Angular HttpClient + RxJS | — |
| Styles   | SCSS (component-scoped) | — |
| Runtime  | Python 3.12+ · Node 18+ | — |
| Infra    | Docker · docker-compose · Nginx | — |

---

## Project Structure

```
pam/
│
├── backend/
│   ├── app/
│   │   ├── main.py                        ← App factory, CORS, lifespan
│   │   ├── core/
│   │   │   ├── config.py                  ← Settings (pydantic-settings, .env)
│   │   │   └── database.py                ← Async engine, session factory, init_db
│   │   ├── shared/
│   │   │   ├── base_model.py              ← TimestampMixin (created_at / updated_at)
│   │   │   └── base_schema.py             ← BaseSchema, TimestampSchema, PaginatedResponse
│   │   └── modules/
│   │       ├── todos/
│   │       │   ├── models.py              ← Todo ORM model
│   │       │   ├── schemas.py             ← TodoCreate / TodoUpdate / TodoResponse
│   │       │   ├── service.py             ← TodoService (CRUD + pagination)
│   │       │   ├── router.py              ← FastAPI router (/todos)
│   │       │   └── __init__.py
│   │       └── chat/
│   │           ├── models.py              ← Message ORM model
│   │           ├── schemas.py             ← MessageCreate / MessageResponse / RoomInfo
│   │           ├── service.py             ← ChatService (history, save, room list)
│   │           ├── connection_manager.py  ← In-process WebSocket room registry
│   │           ├── router.py              ← REST + WebSocket routes (/chat)
│   │           └── __init__.py
│   ├── .env.example
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── main.ts                        ← Angular bootstrap
│   │   ├── index.html
│   │   ├── styles.scss                    ← Global styles + .btn design tokens
│   │   ├── environments/
│   │   │   ├── environment.ts             ← apiUrl (dev)
│   │   │   └── environment.prod.ts        ← apiUrl (prod)
│   │   └── app/
│   │       ├── app.module.ts              ← Root module
│   │       ├── app-routing.module.ts      ← Lazy routes: /todos, /chat
│   │       ├── app.component.*            ← Shell (navbar + router-outlet)
│   │       ├── core/
│   │       │   ├── services/
│   │       │   │   └── api.service.ts     ← Generic HTTP wrapper (get/post/patch/delete)
│   │       │   └── interceptors/
│   │       │       └── http-error.interceptor.ts  ← Global error handler
│   │       ├── shared/
│   │       │   └── shared.module.ts       ← Re-exports CommonModule + ReactiveFormsModule
│   │       └── modules/
│   │           ├── todos/
│   │           │   ├── todos.module.ts
│   │           │   ├── todos-routing.module.ts
│   │           │   ├── models/todo.model.ts
│   │           │   ├── services/todo.service.ts
│   │           │   └── components/
│   │           │       ├── todo-list/     ← List, filters, pagination (Signals)
│   │           │       └── todo-form/     ← Reactive form (create + edit)
│   │           └── chat/
│   │               ├── chat.module.ts
│   │               ├── chat-routing.module.ts
│   │               ├── models/message.model.ts
│   │               ├── services/
│   │               │   ├── chat.service.ts      ← REST: rooms + history
│   │               │   └── chat-ws.service.ts   ← Native WebSocket wrapper (RxJS)
│   │               └── components/
│   │                   ├── chat-join/     ← Room/username picker
│   │                   └── chat-room/     ← Real-time chat UI
│   ├── angular.json
│   ├── tsconfig.json
│   ├── proxy.conf.json                    ← Dev proxy: /api → localhost:8000
│   ├── nginx.conf                         ← Prod Nginx (SPA + API proxy)
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

## Architecture

### Backend Architecture

```
HTTP/WS Request
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
- The only files that change when adding a module are `main.py` (one `include_router` line) and `database.py` (models auto-discovered via `Base.metadata.create_all`).
- All DB sessions are async (`AsyncSession`). The `get_db` dependency commits on success and rolls back on exception.
- WebSocket routes create a fresh `AsyncSessionLocal` session per received message (not per connection) to avoid long-lived transactions.

**`ConnectionManager`** (`chat/connection_manager.py`):

```
In-process singleton dict:  { room: [WebSocket, WebSocket, ...] }

connect(room, ws)  → accept + append
disconnect(room, ws) → remove (clean up empty rooms)
broadcast(room, payload) → send_json to all; silently drops dead sockets
```

This is suitable for a single-process deployment. For multi-process horizontal scaling, replace it with a Redis Pub/Sub backend (see [Horizontal Scaling](#horizontal-scaling)).

---

### Frontend Architecture

```
AppModule (root)
 ├── AppRoutingModule  ← lazy routes
 ├── HttpClientModule
 └── HTTP_INTERCEPTORS: [HttpErrorInterceptor]

Lazy-loaded feature bundles (separate JS chunks):
 ├── /todos  →  TodosModule
 │    ├── SharedModule (CommonModule + ReactiveFormsModule)
 │    ├── TodoListComponent   ← Angular Signals for local state
 │    └── TodoFormComponent   ← Reactive Forms
 │
 └── /chat   →  ChatModule
      ├── SharedModule
      ├── ChatJoinComponent   ← room + username picker
      └── ChatRoomComponent   ← WebSocket chat UI
```

**Layer responsibilities:**

| Layer | Files | Responsibility |
|---|---|---|
| Shell | `app.component.*`, `app-routing.module.ts` | Navbar, router outlet, lazy route registration |
| Core | `core/services/api.service.ts` | Single `HttpClient` wrapper — all REST calls go through here |
| Core | `core/interceptors/http-error.interceptor.ts` | Converts `HttpErrorResponse` → `Error` with readable message |
| Shared | `shared/shared.module.ts` | Provides `CommonModule` and `ReactiveFormsModule` to every feature module |
| Feature | `modules/<name>/services/<name>.service.ts` | Domain logic, calls `ApiService` |
| Feature | `modules/chat/services/chat-ws.service.ts` | WebSocket lifecycle: connect, send, close; exposes `messages$` and `status$` as Observables |
| Feature | `modules/<name>/components/` | Presentational — subscribe to services, render UI |

**State management:** no external store. `TodoListComponent` uses Angular Signals (`signal()`, `update()`) for its list/loading/error state. `ChatRoomComponent` accumulates messages via `signal<ChatMessage[]>`.

---

### Data Flow

#### REST (Todos)

```
TodoListComponent
  └─ calls TodoService.getAll(filter)
       └─ calls ApiService.get('/todos', params)
            └─ HttpClient.get(apiUrl + '/todos')
                 └─ Backend: GET /api/v1/todos
                      └─ TodoService.get_all() → DB query → TodoListResponse JSON
```

#### WebSocket (Chat)

```
ChatRoomComponent.ngOnInit()
  ├─ ChatService.getHistory(room)    ← REST: load last 50 messages
  └─ ChatWsService.connect(room, author)
       └─ new WebSocket(ws://localhost:8000/api/v1/chat/{room}/ws?author=Alice)

                    Backend: WebSocket handler
                         ├─ manager.connect(room, ws)     ← accept connection
                         ├─ manager.broadcast(system join event)
                         └─ loop:
                              receive text
                              save to DB (new AsyncSession per message)
                              manager.broadcast(message event to all in room)

ChatWsService.messages$  ← Observable<ChatMessage>
  └─ ChatRoomComponent subscribes → appends to messages signal → UI updates
```

---

## Setup & Local Development

### Prerequisites

| Tool | Minimum version | Notes |
|---|---|---|
| Python | 3.12 | Python 3.14 works but requires `pydantic>=2.11` for native wheels |
| Node.js | 18 | 20+ recommended |
| npm | 9+ | bundled with Node |
| Git | any | — |

> **Python 3.14 note:** `pydantic-core` < 2.46 has no Python 3.14 wheel and will attempt a Rust build that fails. `requirements.txt` already pins `pydantic>=2.11` which ships a 3.14 wheel (`pydantic-core 2.46+`).

---

### Initial configuration

Before running the app for the first time, copy the example environment file and adjust any values you need:

**Windows (Command Prompt):**
```bat
copy backend\.env.example backend\.env
```

**macOS / Linux / Git Bash:**
```bash
cp backend/.env.example backend/.env
```

The defaults work out of the box for local development. Edit `backend\.env` only if you need non-default values:

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `PAM` | Shown in OpenAPI docs title |
| `APP_ENV` | `development` | Set to `production` to disable SQL echo |
| `DATABASE_URL` | `sqlite+aiosqlite:///./pam.db` | Async SQLAlchemy URL |
| `CORS_ORIGINS` | `["http://localhost:4200"]` | JSON array of allowed origins |

The SQLite database file (`pam.db`) is created automatically on first startup — no database setup required.

---

### Backend setup

```bash
cd backend

# 1. Create virtual environment
python -m venv .venv

# 2. Activate
# Windows (Command Prompt):
.venv\Scripts\activate
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS / Linux / Git Bash:
source .venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

> **Important — do not move or rename the project folder after creating the venv.**  
> Python virtual environments store absolute paths internally. If you move the folder, the venv breaks. See [Troubleshooting](#troubleshooting) for the fix.

---

### Frontend setup

```bash
cd frontend
npm install
```

> The Angular CLI is installed locally as a dev dependency. Use `npx ng ...` or `node_modules/.bin/ng ...` instead of the global `ng` command to guarantee version consistency.

#### TypeScript path aliases (tsconfig.json)

The project uses short import aliases. `baseUrl: "./"` must be set (already done) for them to resolve:

| Alias | Resolves to |
|---|---|
| `@core/*` | `src/app/core/*` |
| `@shared/*` | `src/app/shared/*` |
| `@modules/*` | `src/app/modules/*` |
| `@env/*` | `src/environments/*` |

#### Angular 19 + NgModules note

Angular 19 defaults all generated components to `standalone: true`. Since this project uses NgModules for feature isolation, every `@Component` carries `standalone: false` explicitly. The `angular.json` schematics section enforces this for future `ng generate` calls:

```json
"schematics": {
  "@schematics/angular:component": { "style": "scss", "standalone": false },
  "@schematics/angular:module":    { "standalone": false }
}
```

---

## Running the App

### Option A — Quick start (Windows)

From the project root, double-click `start.bat` or run it in a terminal:

```bat
start.bat
```

This opens two separate terminal windows (backend + frontend) and automatically opens `http://localhost:4200` in your browser after 20 seconds.

**Prerequisites:** the `.venv` and `node_modules` must already exist (run the setup steps above first). The script checks for both and prints a clear error message if either is missing.

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

| URL | Description |
|---|---|
| `http://localhost:8000/api/v1/todos` | Todos REST API |
| `http://localhost:8000/api/v1/chat/rooms` | Chat REST API |
| `http://localhost:8000/api/docs` | Swagger UI |
| `http://localhost:8000/api/redoc` | ReDoc |
| `ws://localhost:8000/api/v1/chat/{room}/ws?author=Alice` | Chat WebSocket |

**Terminal 2 — Frontend**

```bash
cd frontend
npm start
```

App: **http://localhost:4200**

The dev server proxies `/api/*` requests to `http://localhost:8000` via `proxy.conf.json`. WebSocket connections go directly to port 8000 (the proxy config does not relay WebSocket frames in all environments).

---

## Troubleshooting

### "Fatal error in launcher: Unable to create process" (broken venv path)

**Symptom:** After moving or renaming the project folder, running `uvicorn` (or any venv command) fails with:

```
Fatal error in launcher: Unable to create process using
'"C:\old\path\backend\.venv\Scripts\python.exe" ...'
The system cannot find the file specified.
```

**Cause:** Python virtual environments store absolute paths in their launcher scripts and `pyvenv.cfg`. When the folder is moved or renamed, those paths become stale.

**Fix:** Delete the venv and recreate it from scratch. The venv contains no project data — only installed packages.

```bat
cd backend
rmdir /s /q .venv
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

On macOS / Linux:
```bash
cd backend
rm -rf .venv
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

The `pam.db` database file and your `.env` are unaffected.

---

### `start.bat` opens windows but services fail to start

1. **"The system cannot find the path specified"** in the backend window → broken venv path, see above.
2. **"'npm' is not recognized"** → Node.js is not installed or not on `PATH`. Install from [nodejs.org](https://nodejs.org) and restart your terminal.
3. **"node_modules not found" error in the launcher** → run `npm install` in the `frontend` folder first.
4. **"Python venv not found" error in the launcher** → run the backend setup steps first (create venv, `pip install`).

---

### Port already in use

If port 8000 or 4200 is already occupied:

```bash
# Backend on a different port:
uvicorn app.main:app --reload --port 8001

# Frontend on a different port:
npm start -- --port 4201
```

If you change the backend port, also update `CORS_ORIGINS` in `.env` and the proxy target in `frontend/proxy.conf.json`.

---

## API Reference

### Todos

| Method | Path | Body / Params | Response |
|---|---|---|---|
| `GET` | `/api/v1/todos` | `?page=1&size=20&completed=` | `TodoListResponse` |
| `POST` | `/api/v1/todos` | `TodoCreate` | `TodoResponse` 201 |
| `GET` | `/api/v1/todos/{id}` | — | `TodoResponse` |
| `PATCH` | `/api/v1/todos/{id}` | `TodoUpdate` (all fields optional) | `TodoResponse` |
| `DELETE` | `/api/v1/todos/{id}` | — | 204 No Content |

**`TodoCreate`**
```json
{ "title": "string (required, max 255)", "description": "string|null", "completed": false }
```

**`TodoListResponse`**
```json
{ "total": 1, "page": 1, "size": 20, "items": [ ...TodoResponse ] }
```

---

### Chat

| Method | Path | Params | Response |
|---|---|---|---|
| `GET` | `/api/v1/chat/rooms` | — | `RoomListResponse` |
| `GET` | `/api/v1/chat/{room}/messages` | `?limit=50` | `MessageResponse[]` |
| `WS` | `/api/v1/chat/{room}/ws` | `?author=string (required)` | — |

**`RoomListResponse`**
```json
{ "rooms": [ { "name": "general", "connected_users": 3 } ] }
```

**WebSocket events** — server sends JSON frames:

```jsonc
// New message
{ "type": "message", "id": 1, "room": "general", "author": "Alice",
  "content": "hello", "created_at": "2026-04-24T10:00:00", "users": 2 }

// Join / leave notification
{ "type": "system", "room": "general", "author": "system",
  "content": "Alice joined the room", "users": 2 }
```

**Client → server:** plain UTF-8 text string (the message content). Empty strings are ignored.

---

## Design Decisions

### Why NgModules instead of standalone components?

Angular 19 recommends standalone components, but NgModules provide a stronger isolation boundary for feature teams: each module owns its declarations and can be moved or replaced without touching sibling modules. The tradeoff is a bit more boilerplate per module. The shared `SharedModule` eliminates repetitive `CommonModule` / `ReactiveFormsModule` imports.

### Why one `ApiService` instead of direct `HttpClient` use?

Centralising HTTP calls in `ApiService` means that if the base URL, auth headers, or request serialization ever changes, there is exactly one file to edit. Feature services remain focused on domain logic.

### Why a session-per-message pattern for WebSocket?

The `get_db` dependency yields a session that is committed and closed when the request finishes. A WebSocket "request" lasts for the entire connection — potentially hours. Opening one session for the lifetime of a connection risks stale reads and long-lived transactions blocking writes. Creating a short-lived `AsyncSessionLocal()` context per incoming message is safer and more predictable under load.

### Why `signal()` for component state instead of `BehaviorSubject`?

Angular Signals (stable since v17) offer simpler, synchronous state reads without the subscription boilerplate of `BehaviorSubject`. They are also change-detection aware, which avoids the need to call `ChangeDetectorRef.markForCheck()` in `OnPush` components.

### Why SQLite for development?

Zero configuration — the DB file is created automatically on first run by `init_db()`. Swapping to PostgreSQL requires only one environment variable change and adding `asyncpg` to requirements (see [Switching to PostgreSQL](#switching-to-postgresql)).

---

## Adding a New Module

The pattern is identical for every module. Using `notes` as an example:

### Backend

```bash
mkdir backend/app/modules/notes
touch backend/app/modules/notes/__init__.py
```

**1. `models.py`** — inherit `Base` and `TimestampMixin`
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

**2. `schemas.py`** — inherit `BaseSchema` / `TimestampSchema`
```python
from app.shared.base_schema import BaseSchema, TimestampSchema

class NoteCreate(BaseSchema):
    title:   str
    content: str | None = None

class NoteResponse(TimestampSchema):
    id:      int
    title:   str
    content: str | None
```

**3. `service.py`** — pure async business logic
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
from fastapi import APIRouter, Depends
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

@router.post("", response_model=NoteResponse, status_code=201)
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

The table is created automatically on next startup by `init_db()`.

---

### Frontend

```bash
cd frontend

# Generates: notes.module.ts, notes-routing.module.ts
# Wires lazy route /notes into app-routing.module.ts automatically
npx ng generate module modules/notes --routing --route notes --module app
```

Then create the standard files:

```
modules/notes/
├── models/note.model.ts
├── services/note.service.ts      ← calls ApiService
└── components/
    └── note-list/
        ├── note-list.component.ts    (standalone: false)
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

  getAll() { return this.api.get<Note[]>('/notes'); }
  create(payload: NoteCreate) { return this.api.post<Note>('/notes', payload); }
}
```

Add `NoteListComponent` to `notes.module.ts` declarations, then add a nav link in `app.component.html`:
```html
<a routerLink="/notes" routerLinkActive="active">Notes</a>
```

---

## Switching to PostgreSQL

**1. Add the async driver**
```bash
pip install asyncpg
```

Add to `requirements.txt`:
```
asyncpg>=0.30.0
```

**2. Update `.env`**
```env
DATABASE_URL=postgresql+asyncpg://user:password@host:5432/pam
```

No code changes required — SQLAlchemy and the app factory are already database-agnostic.

**3. (Recommended) Add Alembic for migrations**
```bash
pip install alembic
alembic init alembic
```

Update `alembic/env.py` to import `Base` from `app.core.database` and use the async engine pattern. Then generate your first migration:
```bash
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

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
    │              ├── /             → serves Angular build
    │              └── /api/*        → proxies to backend:8000
    │
    └── :8000 → [Uvicorn container]  (direct access / Swagger)
                    └── pam.db   (volume-mounted)
```

To add a PostgreSQL container instead of SQLite, extend `docker-compose.yml`:

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

---

## Horizontal Scaling

### Backend (stateless REST)

FastAPI/Uvicorn is stateless for the Todos module. To scale:

1. Run multiple Uvicorn instances (or use Gunicorn with `UvicornWorker`).
2. Place a load balancer (Nginx, AWS ALB, Traefik) in front.
3. All instances share the same database.

```
                ┌─────────────┐
   Client ──→   │ Load Balancer│
                └──────┬──────┘
          ┌────────────┼────────────┐
     uvicorn:8001  uvicorn:8002  uvicorn:8003
          └────────────┼────────────┘
                  PostgreSQL
```

### Chat WebSocket (stateful — extra step required)

`ConnectionManager` is an **in-process dict**. Two replicas cannot share it — a message received by replica A will not reach clients connected to replica B.

**Solution: Redis Pub/Sub**

```python
# Replace connection_manager.py broadcast with:
import redis.asyncio as redis

r = redis.from_url("redis://localhost")

async def broadcast(room: str, payload: dict):
    await r.publish(f"chat:{room}", json.dumps(payload))

# Each instance subscribes on startup and forwards to its local WebSocket connections
```

This makes the Chat module horizontally scalable with any number of replicas.
