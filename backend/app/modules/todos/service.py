from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from typing import Optional
from app.modules.todos.models import Todo
from app.modules.todos.schemas import TodoCreate, TodoUpdate


class TodoService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, page: int = 1, size: int = 20, completed: Optional[bool] = None):
        offset = (page - 1) * size
        query = select(Todo)
        count_query = select(func.count()).select_from(Todo)

        if completed is not None:
            query = query.where(Todo.completed == completed)
            count_query = count_query.where(Todo.completed == completed)

        total = (await self.db.execute(count_query)).scalar_one()
        result = await self.db.execute(query.offset(offset).limit(size).order_by(Todo.created_at.desc()))
        return total, result.scalars().all()

    async def get_by_id(self, todo_id: int) -> Optional[Todo]:
        result = await self.db.execute(select(Todo).where(Todo.id == todo_id))
        return result.scalar_one_or_none()

    async def create(self, payload: TodoCreate) -> Todo:
        todo = Todo(**payload.model_dump())
        self.db.add(todo)
        await self.db.flush()
        await self.db.refresh(todo)
        return todo

    async def update(self, todo_id: int, payload: TodoUpdate) -> Optional[Todo]:
        todo = await self.get_by_id(todo_id)
        if not todo:
            return None
        for field, value in payload.model_dump(exclude_unset=True).items():
            setattr(todo, field, value)
        await self.db.flush()
        await self.db.refresh(todo)
        return todo

    async def delete(self, todo_id: int) -> bool:
        todo = await self.get_by_id(todo_id)
        if not todo:
            return False
        await self.db.delete(todo)
        return True
