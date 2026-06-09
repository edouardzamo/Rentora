
from fastapi import WebSocket, WebSocketDisconnect
from typing import List



class ConnectionManager:
    def __init__(self):
        self.active_connections = {}

    async def connect(self, conversation_id : int, websocket: WebSocket):
        await websocket.accept()
        if conversation_id not in self.active_connections:
            self.active_connections[conversation_id] = []
            self.active_connections[conversation_id].append(websocket)

    def disconnect(self, conversation_id : int,  websocket: WebSocket):
        self.active_connections[conversation_id].remove(websocket)

    async def send_to_room(self, conversation_id : int, message: str):
        for connection in self.active_connections.get(conversation_id, []):
            await connection.send_text(message)


manager = ConnectionManager()
