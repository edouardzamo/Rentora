# backend/main.py
import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi import WebSocket, WebSocketDisconnect

# Remove duplicate router imports
from backend.routers.auth import router as auth_router
from backend.routers.listings import router as listings_router
from backend.routers.favorite import router as favorite_router
from backend.routers.message import router as message_router
from backend.routers.dashboard import router as dashboard_router
from backend.exception import http_exception_handler, generic_exception_handler
from backend.Websocket.connection_manager import manager

app = FastAPI()

# CORS - Keep as is
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://rentora-fg8s.onrender.com"
        "https://rentora-frontend-ltnb.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API is running"}

@app.get("/health")
def health():
    return {"status": "healthy"}

# Exception handlers
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, generic_exception_handler)

# Include routers - ONLY ONCE EACH
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(listings_router, prefix="/listings", tags=["Listings"])
app.include_router(favorite_router, prefix="/favorites", tags=["Favorites"])
app.include_router(message_router, prefix="/messages", tags=["Messages"])
app.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])

# Remove this line - it's duplicate of auth_router
# app.include_router(users_router)  # ← DELETE THIS LINE

# Create uploads directory
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="images")

@app.websocket("/ws/chat/{conversation_id}")
async def websocket_endpoint(conversation_id: int, websocket: WebSocket):
    await manager.connect(conversation_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            await manager.send_to_room(conversation_id, data)
    except WebSocketDisconnect:
        manager.disconnect(conversation_id, websocket)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", reload=True, port=8000)