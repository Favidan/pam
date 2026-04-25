from pydantic import BaseModel, ConfigDict
from datetime import datetime


class BaseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class TimestampSchema(BaseSchema):
    created_at: datetime
    updated_at: datetime


class PaginatedResponse(BaseSchema):
    total: int
    page: int
    size: int
    items: list
