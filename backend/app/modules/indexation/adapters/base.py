from abc import ABC, abstractmethod
from dataclasses import dataclass
from datetime import datetime
from typing import AsyncIterator, BinaryIO, Optional, Type, Dict


@dataclass
class ChangeEvent:
    source_id: str
    filename: str
    full_path: str
    size_bytes: Optional[int]
    mime_type: Optional[str]
    modified_at: Optional[datetime]
    created_at: Optional[datetime]
    is_deleted: bool = False


class SourceAdapter(ABC):
    source_type: str = ""

    def __init__(self, config: dict):
        self.config = config or {}

    @abstractmethod
    async def list_changes(
        self, since_token: Optional[str]
    ) -> AsyncIterator[ChangeEvent]:
        ...

    @abstractmethod
    async def open_file(self, source_id: str) -> BinaryIO:
        ...

    @abstractmethod
    async def get_next_token(self) -> str:
        ...


class AdapterRegistry:
    _adapters: Dict[str, Type[SourceAdapter]] = {}

    @classmethod
    def register(cls, source_type: str, adapter: Type[SourceAdapter]) -> None:
        cls._adapters[source_type] = adapter

    @classmethod
    def build(cls, source_type: str, config: dict) -> SourceAdapter:
        if source_type not in cls._adapters:
            raise KeyError(f"No adapter registered for source_type='{source_type}'")
        return cls._adapters[source_type](config)

    @classmethod
    def known_types(cls) -> list[str]:
        return list(cls._adapters.keys())
