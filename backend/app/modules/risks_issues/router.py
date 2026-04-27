from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.modules.risks_issues.models import ItemType, Status
from app.modules.risks_issues.schemas import (
    RiskIssueCreate,
    RiskIssueUpdate,
    RiskIssueResponse,
    RiskIssueListResponse,
)
from app.modules.risks_issues.service import RiskIssueService

router = APIRouter(prefix="/risks-issues", tags=["Risks & Issues"])


def get_service(db: AsyncSession = Depends(get_db)) -> RiskIssueService:
    return RiskIssueService(db)


@router.get("/alerts", response_model=list[RiskIssueResponse])
async def get_alerts(
    days_ahead: int = Query(7, ge=0, le=90),
    service: RiskIssueService = Depends(get_service),
):
    items = await service.get_alerts(days_ahead=days_ahead)
    return [RiskIssueResponse.from_orm_with_computed(i) for i in items]


@router.get("", response_model=RiskIssueListResponse)
async def list_items(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    type: Optional[ItemType] = Query(None),
    status: Optional[Status] = Query(None),
    service: RiskIssueService = Depends(get_service),
):
    total, items = await service.get_all(page=page, size=size, type=type, status=status)
    return RiskIssueListResponse(
        total=total,
        page=page,
        size=size,
        items=[RiskIssueResponse.from_orm_with_computed(i) for i in items],
    )


@router.post("", response_model=RiskIssueResponse, status_code=status.HTTP_201_CREATED)
async def create_item(payload: RiskIssueCreate, service: RiskIssueService = Depends(get_service)):
    item = await service.create(payload)
    return RiskIssueResponse.from_orm_with_computed(item)


@router.get("/{item_id}", response_model=RiskIssueResponse)
async def get_item(item_id: int, service: RiskIssueService = Depends(get_service)):
    item = await service.get_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return RiskIssueResponse.from_orm_with_computed(item)


@router.patch("/{item_id}", response_model=RiskIssueResponse)
async def update_item(
    item_id: int, payload: RiskIssueUpdate, service: RiskIssueService = Depends(get_service)
):
    item = await service.update(item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return RiskIssueResponse.from_orm_with_computed(item)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int, service: RiskIssueService = Depends(get_service)):
    deleted = await service.delete(item_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Item not found")
