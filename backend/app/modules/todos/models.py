from sqlalchemy import Column, Integer, String, Boolean, Text
from app.core.database import Base
from app.shared.base_model import TimestampMixin


class Todo(Base, TimestampMixin):
    __tablename__ = "todos"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    completed = Column(Boolean, default=False, nullable=False)
