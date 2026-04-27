from pydantic import Field
from typing import Optional, Any
from datetime import datetime
from app.shared.base_schema import BaseSchema, TimestampSchema
from app.modules.indexation.models import SourceType, JobStatus, JobTrigger


class FileSearchItem(BaseSchema):
    id: int
    filename: str
    full_path: str
    source_type: SourceType
    extension: Optional[str]
    size_bytes: Optional[int]
    modified_at_source: Optional[datetime]
    rank: float
    snippet: Optional[str]


class FacetBucket(BaseSchema):
    value: str
    count: int


class FileSearchResponse(BaseSchema):
    total: int
    page: int
    page_size: int
    items: list[FileSearchItem]
    facets: dict[str, list[FacetBucket]]


class FileDetailResponse(TimestampSchema):
    id: int
    source_type: SourceType
    source_id: str
    filename: str
    full_path: str
    extension: Optional[str]
    mime_type: Optional[str]
    size_bytes: Optional[int]
    created_at_source: Optional[datetime]
    modified_at_source: Optional[datetime]
    last_indexed_at: Optional[datetime]
    content_hash: Optional[str]
    is_deleted: bool
    extracted_text: Optional[str] = None
    language: Optional[str] = None


class JobSummary(BaseSchema):
    id: int
    triggered_by: JobTrigger
    triggered_by_user_id: Optional[int]
    status: JobStatus
    started_at: datetime
    finished_at: Optional[datetime]
    sources_scanned: Optional[Any] = None
    files_added: int
    files_updated: int
    files_deleted: int
    files_failed: int
    error_message: Optional[str]


class JobRunRequest(BaseSchema):
    sources: Optional[list[str]] = None


class JobRunResponse(BaseSchema):
    job_id: int
    status: JobStatus


class SourceConfigResponse(TimestampSchema):
    id: int
    source_type: SourceType
    name: str
    enabled: bool
    config: dict
    last_run_token: Optional[str]
    last_run_at: Optional[datetime]


class SourceConfigCreate(BaseSchema):
    source_type: SourceType
    name: str = Field(..., min_length=1, max_length=255)
    enabled: bool = True
    config: dict = Field(default_factory=dict)


class SourceConfigUpdate(BaseSchema):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    enabled: Optional[bool] = None
    config: Optional[dict] = None


class IndexationStats(BaseSchema):
    total_files: int
    total_deleted: int
    total_size_bytes: int
    by_source: dict[str, int]
    by_extension: dict[str, int]
    last_job: Optional[JobSummary]
