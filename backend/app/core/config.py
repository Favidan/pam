from pydantic_settings import BaseSettings
from typing import List
import json


class Settings(BaseSettings):
    APP_NAME: str = "TodoApp"
    APP_ENV: str = "development"
    DATABASE_URL: str = "sqlite+aiosqlite:///./todoapp.db"
    CORS_ORIGINS: List[str] = ["http://localhost:4200"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}

    def model_post_init(self, __context):
        if isinstance(self.CORS_ORIGINS, str):
            object.__setattr__(self, "CORS_ORIGINS", json.loads(self.CORS_ORIGINS))


settings = Settings()
