from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db
from app.modules.todos import router as todos_router
from app.modules.chat import router as chat_router
from app.modules.risks_issues import router as risks_issues_router
from app.modules.indexation import router as indexation_router
from app.modules.indexation.workers.scheduler import setup_scheduler


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        version="1.0.0",
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(todos_router, prefix="/api/v1")
    app.include_router(chat_router, prefix="/api/v1")
    app.include_router(risks_issues_router, prefix="/api/v1")
    app.include_router(indexation_router, prefix="/api/v1")

    setup_scheduler(app)

    return app


app = create_app()
