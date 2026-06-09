from sqlalchemy import Column, Integer, DateTime, ForeignKey
from backend.postgres.connection import Base
from sqlalchemy.orm import relationship
from datetime import datetime


class Conversations(Base):
    __tablename__ = "conversations"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    tenant_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    landlord_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship(
        "Listing",
        back_populates="conversations",
        foreign_keys=[listing_id],
    )

    tenant = relationship(
        "User",
        foreign_keys=[tenant_id],
        back_populates="conversations_as_tenant",
    )

    landlord = relationship(
        "User",
        foreign_keys=[landlord_id],
        back_populates="conversations_as_landlord",
    )

    messages = relationship(
        "Message",
        back_populates="conversation",
        cascade="all, delete-orphan",
    )