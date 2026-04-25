from pydantic import Field
from app.shared.base_schema import BaseSchema, TimestampSchema


class MessageCreate(BaseSchema):
    room:    str = Field(..., min_length=1, max_length=100)
    author:  str = Field(..., min_length=1, max_length=100)
    content: str = Field(..., min_length=1)


class MessageResponse(TimestampSchema):
    id:      int
    room:    str
    author:  str
    content: str


class RoomInfo(BaseSchema):
    name:            str
    connected_users: int


class RoomListResponse(BaseSchema):
    rooms: list[RoomInfo]


class WsEvent(BaseSchema):
    type:       str          # "message" | "system" | "users_update"
    room:       str
    author:     str
    content:    str
    id:         int | None   = None
    created_at: str | None   = None
    users:      int | None   = None
