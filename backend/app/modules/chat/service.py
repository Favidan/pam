from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, distinct
from app.modules.chat.models import Message
from app.modules.chat.schemas import MessageCreate


class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_messages(self, room: str, limit: int = 50) -> list[Message]:
        result = await self.db.execute(
            select(Message)
            .where(Message.room == room)
            .order_by(Message.created_at.asc())
            .limit(limit)
        )
        return result.scalars().all()

    async def save_message(self, payload: MessageCreate) -> Message:
        msg = Message(**payload.model_dump())
        self.db.add(msg)
        await self.db.flush()
        await self.db.refresh(msg)
        return msg

    async def get_persisted_rooms(self) -> list[str]:
        result = await self.db.execute(select(distinct(Message.room)))
        return [row[0] for row in result.all()]
