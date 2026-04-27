from datetime import datetime
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, status
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.modules.indexation.exceptions import JobAlreadyRunningError
from app.modules.indexation.models import (
    IndexedFile,
    JobStatus,
    JobTrigger,
    SourceType,
)
from app.modules.indexation.schemas import (
    FileDetailResponse,
    FileSearchResponse,
    IndexationStats,
    JobRunRequest,
    JobRunResponse,
    JobSummary,
    SourceConfigCreate,
    SourceConfigResponse,
    SourceConfigUpdate,
)
from app.modules.indexation.service import IndexationService
from app.modules.indexation.workers.indexer import run_job


router = APIRouter(prefix="/indexation", tags=["Indexation"])


def get_service(db: AsyncSession = Depends(get_db)) -> IndexationService:
    return IndexationService(db)


# ---- Search ------------------------------------------------------------


@router.get("/files/search", response_model=FileSearchResponse)
async def search_files(
    q: str = Query("", description="Search expression (matches filename and extracted text)"),
    source: Optional[list[str]] = Query(None),
    ext: Optional[list[str]] = Query(None),
    modified_after: Optional[datetime] = Query(None),
    modified_before: Optional[datetime] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort: str = Query("relevance", pattern="^(relevance|modified_desc|name_asc)$"),
    service: IndexationService = Depends(get_service),
):
    return await service.search(
        q=q,
        sources=source,
        extensions=ext,
        modified_after=modified_after,
        modified_before=modified_before,
        page=page,
        page_size=page_size,
        sort=sort,
    )


@router.get("/files/{file_id}", response_model=FileDetailResponse)
async def get_file(file_id: int, service: IndexationService = Depends(get_service)):
    result = await service.get_file(file_id)
    if not result:
        raise HTTPException(status_code=404, detail="File not found")
    f, content = result
    return FileDetailResponse(
        id=f.id,
        source_type=f.source_type,
        source_id=f.source_id,
        filename=f.filename,
        full_path=f.full_path,
        extension=f.extension,
        mime_type=f.mime_type,
        size_bytes=f.size_bytes,
        created_at_source=f.created_at_source,
        modified_at_source=f.modified_at_source,
        last_indexed_at=f.last_indexed_at,
        content_hash=f.content_hash,
        is_deleted=f.is_deleted,
        created_at=f.created_at,
        updated_at=f.updated_at,
        extracted_text=content.extracted_text if content else None,
        language=content.language if content else None,
    )


@router.get("/files/{file_id}/download")
async def download_file(file_id: int, service: IndexationService = Depends(get_service)):
    result = await service.get_file(file_id)
    if not result:
        raise HTTPException(status_code=404, detail="File not found")
    f, _ = result
    if f.source_type != SourceType.local:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="Download proxy is only implemented for local sources in this build",
        )
    path = Path(f.source_id)
    if not path.is_file():
        raise HTTPException(status_code=410, detail="Source file no longer exists")
    return FileResponse(path, filename=f.filename, media_type=f.mime_type or "application/octet-stream")


# ---- Jobs --------------------------------------------------------------


@router.get("/jobs", response_model=list[JobSummary])
async def list_jobs(
    limit: int = Query(50, ge=1, le=500),
    service: IndexationService = Depends(get_service),
):
    jobs = await service.list_jobs(limit=limit)
    return [JobSummary.model_validate(j) for j in jobs]


@router.get("/jobs/{job_id}", response_model=JobSummary)
async def get_job(job_id: int, service: IndexationService = Depends(get_service)):
    job = await service.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobSummary.model_validate(job)


@router.post(
    "/jobs/run",
    response_model=JobRunResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
async def trigger_job(
    payload: JobRunRequest = JobRunRequest(),
    background_tasks: BackgroundTasks = None,
):
    """Manually trigger an indexation run.

    Returns 202 immediately; the job runs as a FastAPI background task. Poll
    GET /jobs/{id} for progress. Returns 409 if a run is already in flight.
    """
    from app.modules.indexation.workers.indexer import _job_lock

    if _job_lock.locked():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An indexation job is already running",
        )

    async def _runner():
        try:
            await run_job(triggered_by=JobTrigger.manual, source_filter=payload.sources)
        except JobAlreadyRunningError:
            pass

    # We can't easily get the job ID before the task starts (it is created
    # inside run_job). Instead, return a placeholder ID and let the client
    # discover the running job via GET /jobs.
    background_tasks.add_task(_runner)
    return JobRunResponse(job_id=0, status=JobStatus.running)


# ---- Sources -----------------------------------------------------------


@router.get("/sources", response_model=list[SourceConfigResponse])
async def list_sources(service: IndexationService = Depends(get_service)):
    return [SourceConfigResponse.model_validate(s) for s in await service.list_sources()]


@router.post(
    "/sources",
    response_model=SourceConfigResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_source(
    payload: SourceConfigCreate, service: IndexationService = Depends(get_service)
):
    item = await service.create_source(payload)
    return SourceConfigResponse.model_validate(item)


@router.patch("/sources/{source_id}", response_model=SourceConfigResponse)
async def update_source(
    source_id: int,
    payload: SourceConfigUpdate,
    service: IndexationService = Depends(get_service),
):
    item = await service.update_source(source_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="Source not found")
    return SourceConfigResponse.model_validate(item)


@router.delete("/sources/{source_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_source(source_id: int, service: IndexationService = Depends(get_service)):
    deleted = await service.delete_source(source_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Source not found")


# ---- Stats -------------------------------------------------------------


@router.get("/stats", response_model=IndexationStats)
async def get_stats(service: IndexationService = Depends(get_service)):
    data = await service.stats()
    last_job = data["last_job"]
    return IndexationStats(
        total_files=data["total_files"],
        total_deleted=data["total_deleted"],
        total_size_bytes=data["total_size_bytes"],
        by_source=data["by_source"],
        by_extension=data["by_extension"],
        last_job=JobSummary.model_validate(last_job) if last_job else None,
    )
