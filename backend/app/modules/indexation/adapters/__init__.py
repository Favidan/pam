from app.modules.indexation.adapters.base import (
    ChangeEvent,
    SourceAdapter,
    AdapterRegistry,
)
from app.modules.indexation.adapters.local_fs import LocalFsAdapter

AdapterRegistry.register("local", LocalFsAdapter)

__all__ = ["ChangeEvent", "SourceAdapter", "AdapterRegistry", "LocalFsAdapter"]
