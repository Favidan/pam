from pydantic import Field
from typing import Optional
from app.shared.base_schema import BaseSchema, TimestampSchema


class TodoCreate(BaseSchema):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    completed: bool = False


class TodoUpdate(BaseSchema):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    completed: Optional[bool] = None


class TodoResponse(TimestampSchema):
    id: int
    title: str
    description: Optional[str]
    completed: bool


class TodoListResponse(BaseSchema):
    total: int
    page: int
    size: int
    items: list[TodoResponse]
