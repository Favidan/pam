import os
import mimetypes
from datetime import datetime, timezone
from pathlib import Path
from typing import AsyncIterator, BinaryIO, Optional

from app.modules.indexation.adapters.base import ChangeEvent, SourceAdapter
from app.modules.indexation.exceptions import AdapterError


DEFAULT_EXCLUDED_DIRS = {".git", "node_modules", ".venv", "__pycache__", ".idea", ".vscode"}


class LocalFsAdapter(SourceAdapter):
    source_type = "local"

    def __init__(self, config: dict):
        super().__init__(config)
        root = self.config.get("root_path")
        if not root:
            raise AdapterError("LocalFsAdapter requires 'root_path' in config")
        self.root = Path(root).resolve()
        excluded = set(self.config.get("excluded_dirs", []))
        self.excluded_dirs = DEFAULT_EXCLUDED_DIRS | excluded
        self.included_extensions = {
            e.lower().lstrip(".") for e in self.config.get("included_extensions", [])
        }
        self._next_token: Optional[str] = None

    async def list_changes(
        self, since_token: Optional[str]
    ) -> AsyncIterator[ChangeEvent]:
        if not self.root.exists():
            raise AdapterError(f"Root path does not exist: {self.root}")
        if not self.root.is_dir():
            raise AdapterError(f"Root path is not a directory: {self.root}")

        since_dt: Optional[datetime] = None
        if since_token:
            try:
                since_dt = datetime.fromisoformat(since_token)
            except ValueError:
                since_dt = None

        scan_started = datetime.now(timezone.utc)
        self._next_token = scan_started.isoformat()

        for event in self._walk(since_dt):
            yield event

    def _walk(self, since_dt: Optional[datetime]):
        for dirpath, dirnames, filenames in os.walk(self.root):
            dirnames[:] = [d for d in dirnames if d not in self.excluded_dirs]

            for name in filenames:
                full_path = Path(dirpath) / name
                try:
                    resolved = full_path.resolve()
                except OSError:
                    continue

                # Symlink-escape protection
                try:
                    resolved.relative_to(self.root)
                except ValueError:
                    continue

                try:
                    stat = full_path.stat()
                except OSError:
                    continue

                ext = full_path.suffix.lower().lstrip(".")
                if self.included_extensions and ext not in self.included_extensions:
                    continue

                modified_at = datetime.fromtimestamp(stat.st_mtime, tz=timezone.utc)
                if since_dt and modified_at <= since_dt:
                    continue

                created_at = datetime.fromtimestamp(stat.st_ctime, tz=timezone.utc)
                mime_type, _ = mimetypes.guess_type(str(full_path))

                yield ChangeEvent(
                    source_id=str(resolved),
                    filename=name,
                    full_path=str(resolved),
                    size_bytes=stat.st_size,
                    mime_type=mime_type,
                    modified_at=modified_at,
                    created_at=created_at,
                    is_deleted=False,
                )

    async def open_file(self, source_id: str) -> BinaryIO:
        path = Path(source_id).resolve()
        try:
            path.relative_to(self.root)
        except ValueError:
            raise AdapterError(f"Path '{source_id}' is outside root '{self.root}'")
        if not path.is_file():
            raise AdapterError(f"Not a regular file: {source_id}")
        return open(path, "rb")

    async def get_next_token(self) -> str:
        return self._next_token or datetime.now(timezone.utc).isoformat()

    def list_existing_source_ids(self) -> set[str]:
        ids: set[str] = set()
        if not self.root.exists():
            return ids
        for dirpath, dirnames, filenames in os.walk(self.root):
            dirnames[:] = [d for d in dirnames if d not in self.excluded_dirs]
            for name in filenames:
                full_path = Path(dirpath) / name
                try:
                    resolved = full_path.resolve()
                    resolved.relative_to(self.root)
                except (OSError, ValueError):
                    continue
                ids.add(str(resolved))
        return ids
