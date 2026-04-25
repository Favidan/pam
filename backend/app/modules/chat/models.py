from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base
from app.shared.base_model import TimestampMixin


class Message(Base, TimestampMixin):
    __tablename__ = "messages"

    id      = Column(Integer, primary_key=True, index=True)
    room    = Column(String(100), nullable=False, index=True)
    author  = Column(String(100), nullable=False)
    content = Column(Text, nullable=False)
