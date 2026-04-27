from pydantic import Field
from typing import Optional
from datetime import date, datetime
from app.shared.base_schema import BaseSchema, TimestampSchema
from app.modules.risks_issues.models import ItemType, Status, Priority, Probability, Impact


class RiskIssueCreate(BaseSchema):
    type: ItemType
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    status: Status = Status.open
    priority: Priority = Priority.medium
    probability: Optional[Probability] = None
    impact: Optional[Impact] = None
    owner: Optional[str] = Field(None, max_length=255)
    due_date: Optional[date] = None


class RiskIssueUpdate(BaseSchema):
    title: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    probability: Optional[Probability] = None
    impact: Optional[Impact] = None
    owner: Optional[str] = Field(None, max_length=255)
    due_date: Optional[date] = None


class RiskIssueResponse(TimestampSchema):
    id: int
    type: ItemType
    title: str
    description: Optional[str]
    status: Status
    priority: Priority
    probability: Optional[Probability]
    impact: Optional[Impact]
    owner: Optional[str]
    due_date: Optional[date]
    is_overdue: bool
    days_until_due: Optional[int]

    @classmethod
    def from_orm_with_computed(cls, obj) -> "RiskIssueResponse":
        today = date.today()
        is_overdue = False
        days_until_due = None
        if obj.due_date and obj.status not in (Status.resolved, Status.closed):
            delta = (obj.due_date - today).days
            days_until_due = delta
            is_overdue = delta < 0
        return cls(
            id=obj.id,
            type=obj.type,
            title=obj.title,
            description=obj.description,
            status=obj.status,
            priority=obj.priority,
            probability=obj.probability,
            impact=obj.impact,
            owner=obj.owner,
            due_date=obj.due_date,
            created_at=obj.created_at,
            updated_at=obj.updated_at,
            is_overdue=is_overdue,
            days_until_due=days_until_due,
        )


class RiskIssueListResponse(BaseSchema):
    total: int
    page: int
    size: int
    items: list[RiskIssueResponse]
