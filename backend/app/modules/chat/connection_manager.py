from collections import defaultdict
from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self._rooms: dict[str, list[WebSocket]] = defaultdict(list)

    async def connect(self, room: str, websocket: WebSocket) -> None:
        await websocket.accept()
        self._rooms[room].append(websocket)

    def disconnect(self, room: str, websocket: WebSocket) -> None:
        self._rooms[room].remove(websocket)
        if not self._rooms[room]:
            del self._rooms[room]

    async def broadcast(self, room: str, payload: dict) -> None:
        dead: list[WebSocket] = []
        for ws in list(self._rooms.get(room, [])):
            try:
                await ws.send_json(payload)
            except Exception:
                dead.append(ws)
        for ws in dead:
            self._rooms[room].remove(ws)

    def user_count(self, room: str) -> int:
        return len(self._rooms.get(room, []))

    def active_rooms(self) -> list[str]:
        return list(self._rooms.keys())


manager = ConnectionManager()
