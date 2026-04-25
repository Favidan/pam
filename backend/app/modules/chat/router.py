from fastapi import APIRouter, Depends, Query, WebSocket, WebSocketDisconnect
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db, AsyncSessionLocal
from app.modules.chat.schemas import MessageCreate, MessageResponse, RoomInfo, RoomListResponse
from app.modules.chat.service import ChatService
from app.modules.chat.connection_manager import manager

router = APIRouter(prefix="/chat", tags=["Chat"])


def get_service(db: AsyncSession = Depends(get_db)) -> ChatService:
    return ChatService(db)


@router.get("/rooms", response_model=RoomListResponse)
async def list_rooms(service: ChatService = Depends(get_service)):
    persisted = await service.get_persisted_rooms()
    active    = manager.active_rooms()
    all_rooms = list({*persisted, *active})
    rooms = [RoomInfo(name=r, connected_users=manager.user_count(r)) for r in sorted(all_rooms)]
    return RoomListResponse(rooms=rooms)


@router.get("/{room}/messages", response_model=list[MessageResponse])
async def get_messages(
    room:    str,
    limit:   int = Query(50, ge=1, le=200),
    service: ChatService = Depends(get_service),
):
    return await service.get_messages(room, limit)


@router.websocket("/{room}/ws")
async def websocket_endpoint(
    room:      str,
    websocket: WebSocket,
    author:    str = Query(..., min_length=1, max_length=100),
):
    await manager.connect(room, websocket)

    await manager.broadcast(room, {
        "type": "system", "room": room,
        "author": "system",
        "content": f"{author} joined the room",
        "users": manager.user_count(room),
    })

    try:
        while True:
            text = await websocket.receive_text()
            if not text.strip():
                continue

            async with AsyncSessionLocal() as db:
                service = ChatService(db)
                msg = await service.save_message(
                    MessageCreate(room=room, author=author, content=text)
                )
                await db.commit()

            await manager.broadcast(room, {
                "type":       "message",
                "id":         msg.id,
                "room":       msg.room,
                "author":     msg.author,
                "content":    msg.content,
                "created_at": msg.created_at.isoformat(),
                "users":      manager.user_count(room),
            })

    except WebSocketDisconnect:
        manager.disconnect(room, websocket)
        await manager.broadcast(room, {
            "type": "system", "room": room,
            "author": "system",
            "content": f"{author} left the room",
            "users": manager.user_count(room),
        })
