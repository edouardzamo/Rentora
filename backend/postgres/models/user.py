from sqlalchemy import Column, Integer, String, DateTime
from backend.postgres.connection import Base
from datetime import datetime
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True)
    number = Column(String, unique=True, index=True)
    role = Column(String, default="tenant")
    password_hash = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship(
        "Listing",
        back_populates="owner",
        foreign_keys="[Listing.owner_id]",
        cascade="all, delete-orphan",
    )

    favorites = relationship(
        "Favorite",
        back_populates="user",
        cascade="all, delete-orphan",
    )

    messages_sent = relationship(
        "Message",
        foreign_keys="[Message.sender_id]",
        back_populates="sender",
        cascade="all, delete-orphan",
    )

    messages_received = relationship(
        "Message",
        foreign_keys="[Message.receiver_id]",
        back_populates="receiver",
        cascade="all, delete-orphan",
    )

    conversations_as_tenant = relationship(
        "Conversations",
        foreign_keys="[Conversations.tenant_id]",
        back_populates="tenant",
        cascade="all, delete-orphan",
    )

    conversations_as_landlord = relationship(
        "Conversations",
        foreign_keys="[Conversations.landlord_id]",
        back_populates="landlord",
        cascade="all, delete-orphan",
    )