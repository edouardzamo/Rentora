from datetime import datetime
from sqlalchemy.orm import relationship
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from backend.postgres.connection import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    conversation_id = Column(Integer, ForeignKey("conversations.id"), nullable=False)
    sender_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    is_read = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    conversation = relationship(
        "Conversations",
        back_populates="messages",
        foreign_keys=[conversation_id],
    )

    sender = relationship(
        "User",
        foreign_keys=[sender_id],
        back_populates="messages_sent",
    )

    receiver = relationship(
        "User",
        foreign_keys=[receiver_id],
        back_populates="messages_received",
    )