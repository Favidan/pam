"""APScheduler bootstrap for daily indexation runs.

Falls back to a no-op if APScheduler is not installed (the package is optional;
manual runs via POST /jobs/run still work). The design doc names APScheduler
in section 4.8 as the lightest option when no Celery infra exists.
"""

import logging
from typing import Optional

from app.modules.indexation.config import indexation_settings
from app.modules.indexation.models import JobTrigger

logger = logging.getLogger(__name__)

_scheduler = None


def setup_scheduler(app) -> None:
    if not indexation_settings.INDEXATION_SCHEDULER_ENABLED:
        logger.info("Indexation scheduler disabled by config")
        return

    try:
        from apscheduler.schedulers.asyncio import AsyncIOScheduler
        from apscheduler.triggers.cron import CronTrigger
    except ImportError:
        logger.warning(
            "APScheduler not installed; daily indexation cron disabled. "
            "Manual runs via POST /api/v1/indexation/jobs/run still work."
        )
        return

    from app.modules.indexation.workers.indexer import run_job

    async def _scheduled_run():
        try:
            await run_job(triggered_by=JobTrigger.cron)
        except Exception:
            logger.exception("Scheduled indexation run failed")

    scheduler = AsyncIOScheduler(timezone="UTC")
    scheduler.add_job(
        _scheduled_run,
        CronTrigger(
            hour=indexation_settings.INDEXATION_CRON_HOUR,
            minute=indexation_settings.INDEXATION_CRON_MINUTE,
        ),
        id="daily_indexation",
        replace_existing=True,
    )

    @app.on_event("startup")
    async def _start():
        scheduler.start()
        logger.info(
            "Indexation scheduler started: daily at %02d:%02d UTC",
            indexation_settings.INDEXATION_CRON_HOUR,
            indexation_settings.INDEXATION_CRON_MINUTE,
        )

    @app.on_event("shutdown")
    async def _stop():
        scheduler.shutdown(wait=False)

    global _scheduler
    _scheduler = scheduler


def get_scheduler() -> Optional[object]:
    return _scheduler
