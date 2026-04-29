from sqlalchemy import (
    Column,
    Integer,
    BigInteger,
    String,
    Text,
    Enum,
    DateTime,
    Boolean,
    ForeignKey,
    JSON,
    Index,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.shared.base_model import TimestampMixin
import enum


class SourceType(str, enum.Enum):
    local = "local"
    onedrive = "onedrive"


class JobStatus(str, enum.Enum):
    running = "running"
    success = "success"
    failed = "failed"
    cancelled = "cancelled"


class JobTrigger(str, enum.Enum):
    cron = "cron"
    manual = "manual"


class IndexedFile(Base, TimestampMixin):
    __tablename__ = "indexed_files"

    id = Column(Integer, primary_key=True, index=True)
    source_config_id = Column(
        Integer,
        ForeignKey("source_configs.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    source_type = Column(Enum(SourceType), nullable=False)
    source_id = Column(Text, nullable=False)
    filename = Column(Text, nullable=False)
    full_path = Column(Text, nullable=False)
    extension = Column(String(32), nullable=True, index=True)
    mime_type = Column(String(255), nullable=True)
    size_bytes = Column(BigInteger, nullable=True)
    created_at_source = Column(DateTime(timezone=True), nullable=True)
    modified_at_source = Column(DateTime(timezone=True), nullable=True)
    last_indexed_at = Column(DateTime(timezone=True), nullable=True)
    content_hash = Column(String(64), nullable=True)
    is_deleted = Column(Boolean, nullable=False, default=False)

    content = relationship(
        "FileContent",
        uselist=False,
        back_populates="file",
        cascade="all, delete-orphan",
    )
    source_config = relationship("SourceConfig", back_populates="files")

    __table_args__ = (
        UniqueConstraint(
            "source_config_id", "source_id", name="uq_indexed_files_source"
        ),
        Index("ix_indexed_files_source_modified", "source_type", "modified_at_source"),
        Index("ix_indexed_files_filename", "filename"),
    )


class FileContent(Base):
    __tablename__ = "file_contents"

    file_id = Column(
        Integer,
        ForeignKey("indexed_files.id", ondelete="CASCADE"),
        primary_key=True,
    )
    extracted_text = Column(Text, nullable=True)
    language = Column(String(8), nullable=True)
    extracted_at = Column(DateTime(timezone=True), nullable=True)

    file = relationship("IndexedFile", back_populates="content")


class IndexJob(Base):
    __tablename__ = "index_jobs"

    id = Column(Integer, primary_key=True, index=True)
    triggered_by = Column(Enum(JobTrigger), nullable=False)
    triggered_by_user_id = Column(Integer, nullable=True)
    status = Column(Enum(JobStatus), nullable=False, default=JobStatus.running)
    started_at = Column(DateTime(timezone=True), nullable=False)
    finished_at = Column(DateTime(timezone=True), nullable=True)
    sources_scanned = Column(JSON, nullable=True)
    files_added = Column(Integer, nullable=False, default=0)
    files_updated = Column(Integer, nullable=False, default=0)
    files_deleted = Column(Integer, nullable=False, default=0)
    files_failed = Column(Integer, nullable=False, default=0)
    error_message = Column(Text, nullable=True)


class SourceConfig(Base, TimestampMixin):
    __tablename__ = "source_configs"

    id = Column(Integer, primary_key=True, index=True)
    source_type = Column(Enum(SourceType), nullable=False)
    name = Column(String(255), nullable=False)
    enabled = Column(Boolean, nullable=False, default=True)
    config = Column(JSON, nullable=False, default=dict)
    last_run_token = Column(Text, nullable=True)
    last_run_at = Column(DateTime(timezone=True), nullable=True)

    files = relationship(
        "IndexedFile",
        back_populates="source_config",
        cascade="all, delete-orphan",
    )
