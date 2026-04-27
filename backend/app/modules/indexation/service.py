"""Indexation service layer.

Combines SearchService, JobService, and SourceService responsibilities. Search
is implemented over SQLite using case-insensitive LIKE on filename and
extracted_text, with Python-side snippet generation. The interface is the same
as the doc's tsvector-backed design — when migrating to PostgreSQL, swap the
search method body for the websearch_to_tsquery / ts_headline SQL shown in
section 5.2 without touching callers.
"""

import re
from datetime import datetime
from typing import Optional

from sqlalchemy import select, func, or_
from sqlalchemy.ext.asyncio import AsyncSession

from app.modules.indexation.models import (
    FileContent,
    IndexedFile,
    IndexJob,
    SourceConfig,
    SourceType,
)
from app.modules.indexation.schemas import (
    FacetBucket,
    FileSearchItem,
    FileSearchResponse,
    SourceConfigCreate,
    SourceConfigUpdate,
)


SNIPPET_RADIUS = 80
MAX_FRAGMENTS = 2


class IndexationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    # ---- Search -------------------------------------------------------

    async def search(
        self,
        q: str,
        sources: Optional[list[str]] = None,
        extensions: Optional[list[str]] = None,
        modified_after: Optional[datetime] = None,
        modified_before: Optional[datetime] = None,
        page: int = 1,
        page_size: int = 20,
        sort: str = "relevance",
    ) -> FileSearchResponse:
        page = max(1, page)
        page_size = max(1, min(page_size, 100))
        offset = (page - 1) * page_size

        like = f"%{q}%" if q else "%"

        base_filters = [IndexedFile.is_deleted.is_(False)]
        if q:
            base_filters.append(
                or_(
                    IndexedFile.filename.ilike(like),
                    FileContent.extracted_text.ilike(like),
                )
            )
        source_types: list[SourceType] = []
        if sources:
            for s in sources:
                if s in SourceType._value2member_map_:
                    source_types.append(SourceType(s))
            if source_types:
                base_filters.append(IndexedFile.source_type.in_(source_types))
        if extensions:
            base_filters.append(IndexedFile.extension.in_([e.lower() for e in extensions]))
        if modified_after:
            base_filters.append(IndexedFile.modified_at_source >= modified_after)
        if modified_before:
            base_filters.append(IndexedFile.modified_at_source <= modified_before)

        count_query = (
            select(func.count(IndexedFile.id))
            .select_from(IndexedFile)
            .outerjoin(FileContent, FileContent.file_id == IndexedFile.id)
            .where(*base_filters)
        )
        total = (await self.db.execute(count_query)).scalar_one() or 0

        results_query = (
            select(IndexedFile, FileContent.extracted_text)
            .outerjoin(FileContent, FileContent.file_id == IndexedFile.id)
            .where(*base_filters)
        )

        if sort == "modified_desc":
            results_query = results_query.order_by(IndexedFile.modified_at_source.desc().nulls_last())
        elif sort == "name_asc":
            results_query = results_query.order_by(IndexedFile.filename.asc())
        else:
            # relevance — basic SQLite ranking: filename match outranks text match
            results_query = results_query.order_by(
                IndexedFile.modified_at_source.desc().nulls_last()
            )

        results_query = results_query.offset(offset).limit(page_size)
        rows = (await self.db.execute(results_query)).all()

        items: list[FileSearchItem] = []
        for f, text in rows:
            rank = _compute_rank(q, f.filename, text or "")
            snippet = _build_snippet(q, text or "")
            items.append(
                FileSearchItem(
                    id=f.id,
                    filename=f.filename,
                    full_path=f.full_path,
                    source_type=f.source_type,
                    extension=f.extension,
                    size_bytes=f.size_bytes,
                    modified_at_source=f.modified_at_source,
                    rank=rank,
                    snippet=snippet,
                )
            )

        if sort == "relevance":
            items.sort(key=lambda i: i.rank, reverse=True)

        # Facets — counts on the full filtered set, not just the page
        facets = await self._compute_facets(base_filters)

        return FileSearchResponse(
            total=total,
            page=page,
            page_size=page_size,
            items=items,
            facets=facets,
        )

    async def _compute_facets(self, base_filters) -> dict[str, list[FacetBucket]]:
        source_query = (
            select(IndexedFile.source_type, func.count(IndexedFile.id))
            .select_from(IndexedFile)
            .outerjoin(FileContent, FileContent.file_id == IndexedFile.id)
            .where(*base_filters)
            .group_by(IndexedFile.source_type)
        )
        ext_query = (
            select(IndexedFile.extension, func.count(IndexedFile.id))
            .select_from(IndexedFile)
            .outerjoin(FileContent, FileContent.file_id == IndexedFile.id)
            .where(*base_filters)
            .group_by(IndexedFile.extension)
            .order_by(func.count(IndexedFile.id).desc())
            .limit(20)
        )
        sources = [
            FacetBucket(value=t.value, count=c)
            for t, c in (await self.db.execute(source_query)).all()
            if t is not None
        ]
        extensions = [
            FacetBucket(value=e or "(none)", count=c)
            for e, c in (await self.db.execute(ext_query)).all()
        ]
        return {"source_type": sources, "extension": extensions}

    # ---- File detail --------------------------------------------------

    async def get_file(self, file_id: int) -> Optional[tuple[IndexedFile, Optional[FileContent]]]:
        result = await self.db.execute(
            select(IndexedFile).where(IndexedFile.id == file_id)
        )
        f = result.scalar_one_or_none()
        if not f:
            return None
        content = await self.db.get(FileContent, file_id)
        return f, content

    # ---- Jobs ---------------------------------------------------------

    async def list_jobs(self, limit: int = 50) -> list[IndexJob]:
        result = await self.db.execute(
            select(IndexJob).order_by(IndexJob.started_at.desc()).limit(limit)
        )
        return list(result.scalars().all())

    async def get_job(self, job_id: int) -> Optional[IndexJob]:
        result = await self.db.execute(select(IndexJob).where(IndexJob.id == job_id))
        return result.scalar_one_or_none()

    # ---- Sources ------------------------------------------------------

    async def list_sources(self) -> list[SourceConfig]:
        result = await self.db.execute(select(SourceConfig).order_by(SourceConfig.id))
        return list(result.scalars().all())

    async def get_source(self, source_id: int) -> Optional[SourceConfig]:
        return await self.db.get(SourceConfig, source_id)

    async def create_source(self, payload: SourceConfigCreate) -> SourceConfig:
        item = SourceConfig(**payload.model_dump())
        self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def update_source(
        self, source_id: int, payload: SourceConfigUpdate
    ) -> Optional[SourceConfig]:
        item = await self.get_source(source_id)
        if not item:
            return None
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(item, field, value)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def delete_source(self, source_id: int) -> bool:
        item = await self.get_source(source_id)
        if not item:
            return False
        await self.db.delete(item)
        return True

    # ---- Stats --------------------------------------------------------

    async def stats(self):
        total_files = (
            await self.db.execute(
                select(func.count(IndexedFile.id)).where(IndexedFile.is_deleted.is_(False))
            )
        ).scalar_one() or 0
        total_deleted = (
            await self.db.execute(
                select(func.count(IndexedFile.id)).where(IndexedFile.is_deleted.is_(True))
            )
        ).scalar_one() or 0
        total_size = (
            await self.db.execute(
                select(func.coalesce(func.sum(IndexedFile.size_bytes), 0)).where(
                    IndexedFile.is_deleted.is_(False)
                )
            )
        ).scalar_one() or 0

        by_source_rows = (
            await self.db.execute(
                select(IndexedFile.source_type, func.count(IndexedFile.id))
                .where(IndexedFile.is_deleted.is_(False))
                .group_by(IndexedFile.source_type)
            )
        ).all()
        by_ext_rows = (
            await self.db.execute(
                select(IndexedFile.extension, func.count(IndexedFile.id))
                .where(IndexedFile.is_deleted.is_(False))
                .group_by(IndexedFile.extension)
                .order_by(func.count(IndexedFile.id).desc())
                .limit(20)
            )
        ).all()
        last_job_row = (
            await self.db.execute(
                select(IndexJob).order_by(IndexJob.started_at.desc()).limit(1)
            )
        ).scalar_one_or_none()

        return {
            "total_files": total_files,
            "total_deleted": total_deleted,
            "total_size_bytes": int(total_size),
            "by_source": {t.value: c for t, c in by_source_rows if t is not None},
            "by_extension": {(e or "(none)"): c for e, c in by_ext_rows},
            "last_job": last_job_row,
        }


# ---- Helpers ----------------------------------------------------------


def _compute_rank(query: str, filename: str, text: str) -> float:
    if not query:
        return 0.0
    q = query.lower()
    filename_l = filename.lower()
    text_l = text.lower()
    score = 0.0
    if q in filename_l:
        score += 5.0
        if filename_l.startswith(q):
            score += 2.0
    score += min(text_l.count(q), 50) * 0.1
    return round(score, 4)


def _build_snippet(query: str, text: str) -> Optional[str]:
    if not query or not text:
        return None
    q_l = query.lower()
    text_l = text.lower()
    fragments: list[str] = []
    cursor = 0
    for _ in range(MAX_FRAGMENTS):
        idx = text_l.find(q_l, cursor)
        if idx == -1:
            break
        start = max(0, idx - SNIPPET_RADIUS)
        end = min(len(text), idx + len(query) + SNIPPET_RADIUS)
        fragment = text[start:end]
        # Re-escape and apply <mark> tags
        escaped = (
            fragment.replace("&", "&amp;")
            .replace("<", "&lt;")
            .replace(">", "&gt;")
        )
        # case-insensitive mark wrap
        marked = re.sub(
            re.escape(query), lambda m: f"<mark>{m.group(0)}</mark>", escaped, flags=re.IGNORECASE
        )
        prefix = "..." if start > 0 else ""
        suffix = "..." if end < len(text) else ""
        fragments.append(f"{prefix}{marked}{suffix}")
        cursor = end
    return " ".join(fragments) if fragments else None
