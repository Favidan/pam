from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from datetime import date, timedelta
from app.modules.risks_issues.models import RiskIssue, ItemType, Status
from app.modules.risks_issues.schemas import RiskIssueCreate, RiskIssueUpdate


class RiskIssueService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(
        self,
        page: int = 1,
        size: int = 20,
        type: Optional[ItemType] = None,
        status: Optional[Status] = None,
    ):
        offset = (page - 1) * size
        query = select(RiskIssue)
        count_query = select(func.count()).select_from(RiskIssue)

        if type is not None:
            query = query.where(RiskIssue.type == type)
            count_query = count_query.where(RiskIssue.type == type)
        if status is not None:
            query = query.where(RiskIssue.status == status)
            count_query = count_query.where(RiskIssue.status == status)

        total = (await self.db.execute(count_query)).scalar_one()
        result = await self.db.execute(
            query.offset(offset).limit(size).order_by(RiskIssue.created_at.desc())
        )
        return total, result.scalars().all()

    async def get_by_id(self, item_id: int) -> Optional[RiskIssue]:
        result = await self.db.execute(select(RiskIssue).where(RiskIssue.id == item_id))
        return result.scalar_one_or_none()

    async def get_alerts(self, days_ahead: int = 7) -> list[RiskIssue]:
        today = date.today()
        deadline = today + timedelta(days=days_ahead)
        active_statuses = [Status.open, Status.in_progress]
        result = await self.db.execute(
            select(RiskIssue).where(
                RiskIssue.status.in_(active_statuses),
                RiskIssue.due_date.isnot(None),
                RiskIssue.due_date <= deadline,
            ).order_by(RiskIssue.due_date.asc())
        )
        return result.scalars().all()

    async def create(self, payload: RiskIssueCreate) -> RiskIssue:
        item = RiskIssue(**payload.model_dump())
        self.db.add(item)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def update(self, item_id: int, payload: RiskIssueUpdate) -> Optional[RiskIssue]:
        item = await self.get_by_id(item_id)
        if not item:
            return None
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(item, field, value)
        await self.db.flush()
        await self.db.refresh(item)
        return item

    async def delete(self, item_id: int) -> bool:
        item = await self.get_by_id(item_id)
        if not item:
            return False
        await self.db.delete(item)
        return True
