from pydantic_settings import BaseSettings
from typing import Optional


class IndexationSettings(BaseSettings):
    INDEXATION_CRON_HOUR: int = 2
    INDEXATION_CRON_MINUTE: int = 0
    INDEXATION_MAX_FILE_SIZE_MB: int = 50
    INDEXATION_EXTRACTION_TIMEOUT_S: int = 60
    INDEXATION_MAX_TEXT_CHARS: int = 5_000_000
    INDEXATION_SCHEDULER_ENABLED: bool = True
    INDEXATION_DEFAULT_LOCAL_ROOT: Optional[str] = None

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8", "extra": "ignore"}


indexation_settings = IndexationSettings()

JOB_ADVISORY_LOCK_KEY = 9_731_001
