from pydantic import BaseModel
from datetime import datetime


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    content: str
    created_at: datetime

    class Config:
        from_attributes = True