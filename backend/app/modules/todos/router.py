from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.modules.todos.schemas import TodoCreate, TodoUpdate, TodoResponse, TodoListResponse
from app.modules.todos.service import TodoService

router = APIRouter(prefix="/todos", tags=["Todos"])


def get_service(db: AsyncSession = Depends(get_db)) -> TodoService:
    return TodoService(db)


@router.get("", response_model=TodoListResponse)
async def list_todos(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    completed: Optional[bool] = Query(None),
    service: TodoService = Depends(get_service),
):
    total, items = await service.get_all(page=page, size=size, completed=completed)
    return TodoListResponse(total=total, page=page, size=size, items=items)


@router.post("", response_model=TodoResponse, status_code=status.HTTP_201_CREATED)
async def create_todo(payload: TodoCreate, service: TodoService = Depends(get_service)):
    return await service.create(payload)


@router.get("/{todo_id}", response_model=TodoResponse)
async def get_todo(todo_id: int, service: TodoService = Depends(get_service)):
    todo = await service.get_by_id(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.patch("/{todo_id}", response_model=TodoResponse)
async def update_todo(todo_id: int, payload: TodoUpdate, service: TodoService = Depends(get_service)):
    todo = await service.update(todo_id, payload)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_todo(todo_id: int, service: TodoService = Depends(get_service)):
    deleted = await service.delete(todo_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Todo not found")
