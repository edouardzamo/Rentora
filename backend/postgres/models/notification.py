from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from backend.postgres.connection import Base    
from datetime import datetime






class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    message = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)