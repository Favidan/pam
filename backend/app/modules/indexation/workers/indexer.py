"""Indexation worker — orchestrates a single job run.

Implements the flow described in section 4.5/4.6 of PAM_Indexation_Design.docx,
adapted for the existing async-SQLAlchemy/SQLite stack:

- A Postgres advisory lock is unavailable on SQLite, so concurrency is guarded
  in-process by a global asyncio.Lock plus a DB check for any running job.
- Per-file processing happens in its own short transaction so a single failure
  does not abort the batch.
- Deletions are detected by diffing source-side IDs against the DB snapshot.
"""

import asyncio
import hashlib
import logging
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import AsyncSessionLocal
from app.modules.indexation.adapters import AdapterRegistry, ChangeEvent, LocalFsAdapter
from app.modules.indexation.adapters.base import SourceAdapter
from app.modules.indexation.config import indexation_settings
from app.modules.indexation.exceptions import JobAlreadyRunningError
from app.modules.indexation.models import (
    FileContent,
    IndexedFile,
    IndexJob,
    JobStatus,
    JobTrigger,
    SourceConfig,
    SourceType,
)
from app.modules.indexation.workers.extractor import extract_text


logger = logging.getLogger(__name__)

_job_lock = asyncio.Lock()


class JobStats:
    def __init__(self) -> None:
        self.added = 0
        self.updated = 0
        self.deleted = 0
        self.failed = 0
        self.per_source: dict[str, dict[str, int]] = {}

    def bump(self, source_type: str, key: str) -> None:
        bucket = self.per_source.setdefault(
            source_type,
            {"added": 0, "updated": 0, "deleted": 0, "failed": 0},
        )
        bucket[key] += 1
        if key == "added":
            self.added += 1
        elif key == "updated":
            self.updated += 1
        elif key == "deleted":
            self.deleted += 1
        elif key == "failed":
            self.failed += 1


async def run_job(
    triggered_by: JobTrigger = JobTrigger.manual,
    user_id: Optional[int] = None,
    source_filter: Optional[list[str]] = None,
) -> int:
    """Run a full indexation job. Returns the job ID."""
    if _job_lock.locked():
        raise JobAlreadyRunningError("Another indexation job is already running")

    async with _job_lock:
        async with AsyncSessionLocal() as session:
            job = await _create_job(session, triggered_by, user_id)
            await session.commit()
            job_id = job.id

        stats = JobStats()
        try:
            async with AsyncSessionLocal() as session:
                sources = await _list_enabled_sources(session, source_filter)
            for source in sources:
                try:
                    await _process_source(source, stats)
                except Exception as exc:
                    logger.exception(
                        "Source '%s' failed during job %s: %s",
                        source.name,
                        job_id,
                        exc,
                    )
                    stats.bump(source.source_type.value, "failed")

            await _mark_job_finished(job_id, JobStatus.success, stats, None)
        except Exception as exc:
            logger.exception("Indexation job %s failed: %s", job_id, exc)
            await _mark_job_finished(job_id, JobStatus.failed, stats, str(exc))
            raise

        return job_id


async def _create_job(
    session: AsyncSession, triggered_by: JobTrigger, user_id: Optional[int]
) -> IndexJob:
    # Sanity: ensure no other job is marked running (recover from crashed runs)
    result = await session.execute(
        select(IndexJob).where(IndexJob.status == JobStatus.running)
    )
    stale = result.scalars().all()
    for stale_job in stale:
        stale_job.status = JobStatus.failed
        stale_job.error_message = "Recovered as failed: process restart"
        stale_job.finished_at = datetime.now(timezone.utc)

    job = IndexJob(
        triggered_by=triggered_by,
        triggered_by_user_id=user_id,
        status=JobStatus.running,
        started_at=datetime.now(timezone.utc),
        files_added=0,
        files_updated=0,
        files_deleted=0,
        files_failed=0,
    )
    session.add(job)
    await session.flush()
    return job


async def _list_enabled_sources(
    session: AsyncSession, source_filter: Optional[list[str]]
) -> list[SourceConfig]:
    query = select(SourceConfig).where(SourceConfig.enabled.is_(True))
    if source_filter:
        types = [SourceType(s) for s in source_filter if s in SourceType._value2member_map_]
        if types:
            query = query.where(SourceConfig.source_type.in_(types))
    result = await session.execute(query)
    return list(result.scalars().all())


async def _process_source(source: SourceConfig, stats: JobStats) -> None:
    adapter = AdapterRegistry.build(source.source_type.value, source.config or {})

    seen_source_ids: set[str] = set()
    async for change in adapter.list_changes(source.last_run_token):
        seen_source_ids.add(change.source_id)
        try:
            await _process_change(adapter, source, change, stats)
        except Exception as exc:
            logger.warning(
                "File '%s' failed: %s", change.source_id, exc
            )
            stats.bump(source.source_type.value, "failed")

    # Detect deletions for adapters that can fully enumerate (e.g. local fs).
    if isinstance(adapter, LocalFsAdapter):
        await _reconcile_deletions(source, adapter, stats)

    new_token = await adapter.get_next_token()
    async with AsyncSessionLocal() as session:
        await session.execute(
            update(SourceConfig)
            .where(SourceConfig.id == source.id)
            .values(last_run_token=new_token, last_run_at=datetime.now(timezone.utc))
        )
        await session.commit()


async def _process_change(
    adapter: SourceAdapter,
    source: SourceConfig,
    change: ChangeEvent,
    stats: JobStats,
) -> None:
    async with AsyncSessionLocal() as session:
        existing = await _find_existing(session, source.source_type, change.source_id)

        if change.is_deleted:
            if existing and not existing.is_deleted:
                existing.is_deleted = True
                existing.last_indexed_at = datetime.now(timezone.utc)
                stats.bump(source.source_type.value, "deleted")
            await session.commit()
            return

        max_size = indexation_settings.INDEXATION_MAX_FILE_SIZE_MB * 1024 * 1024
        skip_extraction = bool(change.size_bytes and change.size_bytes > max_size)

        content_hash: Optional[str] = None
        extracted_text: Optional[str] = None

        if not skip_extraction:
            try:
                stream = await adapter.open_file(change.source_id)
            except Exception as exc:
                logger.warning("Cannot open '%s': %s", change.source_id, exc)
                stats.bump(source.source_type.value, "failed")
                await session.rollback()
                return

            try:
                hasher = hashlib.sha256()
                buffer = bytearray()
                while True:
                    chunk = stream.read(64 * 1024)
                    if not chunk:
                        break
                    hasher.update(chunk)
                    buffer.extend(chunk)
                content_hash = hasher.hexdigest()
            finally:
                try:
                    stream.close()
                except Exception:
                    pass

            if existing and existing.content_hash == content_hash:
                existing.last_indexed_at = datetime.now(timezone.utc)
                existing.is_deleted = False
                await session.commit()
                return

            ext = (change.full_path.rsplit(".", 1)[-1].lower()
                   if "." in change.filename else None)
            from io import BytesIO
            try:
                extracted_text = extract_text(
                    BytesIO(bytes(buffer)),
                    change.mime_type,
                    ext,
                    max_chars=indexation_settings.INDEXATION_MAX_TEXT_CHARS,
                )
            except Exception as exc:
                logger.warning("Extraction failed for '%s': %s", change.source_id, exc)
                extracted_text = None

        ext = None
        if "." in change.filename:
            ext = change.filename.rsplit(".", 1)[-1].lower() or None

        now = datetime.now(timezone.utc)
        if existing:
            existing.filename = change.filename
            existing.full_path = change.full_path
            existing.extension = ext
            existing.mime_type = change.mime_type
            existing.size_bytes = change.size_bytes
            existing.created_at_source = change.created_at
            existing.modified_at_source = change.modified_at
            existing.last_indexed_at = now
            existing.content_hash = content_hash
            existing.is_deleted = False
            stats.bump(source.source_type.value, "updated")
            file_id = existing.id
        else:
            new_file = IndexedFile(
                source_type=source.source_type,
                source_id=change.source_id,
                filename=change.filename,
                full_path=change.full_path,
                extension=ext,
                mime_type=change.mime_type,
                size_bytes=change.size_bytes,
                created_at_source=change.created_at,
                modified_at_source=change.modified_at,
                last_indexed_at=now,
                content_hash=content_hash,
                is_deleted=False,
            )
            session.add(new_file)
            await session.flush()
            file_id = new_file.id
            stats.bump(source.source_type.value, "added")

        # Upsert content row
        content_row = await session.get(FileContent, file_id)
        if content_row:
            content_row.extracted_text = extracted_text
            content_row.extracted_at = now
        else:
            session.add(
                FileContent(
                    file_id=file_id,
                    extracted_text=extracted_text,
                    extracted_at=now,
                )
            )

        await session.commit()


async def _find_existing(
    session: AsyncSession, source_type: SourceType, source_id: str
) -> Optional[IndexedFile]:
    result = await session.execute(
        select(IndexedFile).where(
            IndexedFile.source_type == source_type,
            IndexedFile.source_id == source_id,
        )
    )
    return result.scalar_one_or_none()


async def _reconcile_deletions(
    source: SourceConfig, adapter: LocalFsAdapter, stats: JobStats
) -> None:
    current = adapter.list_existing_source_ids()
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(IndexedFile.id, IndexedFile.source_id).where(
                IndexedFile.source_type == source.source_type,
                IndexedFile.is_deleted.is_(False),
            )
        )
        rows = result.all()
        to_delete_ids = [row.id for row in rows if row.source_id not in current]
        if not to_delete_ids:
            return
        await session.execute(
            update(IndexedFile)
            .where(IndexedFile.id.in_(to_delete_ids))
            .values(is_deleted=True, last_indexed_at=datetime.now(timezone.utc))
        )
        for _ in to_delete_ids:
            stats.bump(source.source_type.value, "deleted")
        await session.commit()


async def _mark_job_finished(
    job_id: int, status: JobStatus, stats: JobStats, error: Optional[str]
) -> None:
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(IndexJob).where(IndexJob.id == job_id))
        job = result.scalar_one_or_none()
        if not job:
            return
        job.status = status
        job.finished_at = datetime.now(timezone.utc)
        job.files_added = stats.added
        job.files_updated = stats.updated
        job.files_deleted = stats.deleted
        job.files_failed = stats.failed
        job.sources_scanned = stats.per_source
        job.error_message = error
        await session.commit()
