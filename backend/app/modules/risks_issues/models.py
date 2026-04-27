from sqlalchemy import Column, Integer, String, Text, Enum, Date
from app.core.database import Base
from app.shared.base_model import TimestampMixin
import enum


class ItemType(str, enum.Enum):
    risk = "risk"
    issue = "issue"


class Status(str, enum.Enum):
    open = "open"
    in_progress = "in_progress"
    resolved = "resolved"
    closed = "closed"


class Priority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class Probability(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Impact(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    critical = "critical"


class RiskIssue(Base, TimestampMixin):
    __tablename__ = "risks_issues"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(Enum(ItemType), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(Enum(Status), nullable=False, default=Status.open)
    priority = Column(Enum(Priority), nullable=False, default=Priority.medium)
    probability = Column(Enum(Probability), nullable=True)
    impact = Column(Enum(Impact), nullable=True)
    owner = Column(String(255), nullable=True)
    due_date = Column(Date, nullable=True)
