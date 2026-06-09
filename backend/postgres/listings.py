from datetime import datetime
from sqlalchemy import Boolean, Column, Integer, String, DateTime, ForeignKey, Float
from backend.postgres.connection import Base
from sqlalchemy.orm import relationship


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=False)
    price = Column(Float)
    location = Column(String)
    bedrooms = Column(Integer)
    bathrooms = Column(Integer)
    property_type = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_available = Column(Boolean, default=True)
    views = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship(
        "User",
        back_populates="listings",
        foreign_keys=[owner_id],
    )

    favorites = relationship(
        "Favorite",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    conversations = relationship(
        "Conversations",
        back_populates="listing",
        cascade="all, delete-orphan",
    )

    images = relationship(
        "PropertyImage",
        back_populates="listing",
        cascade="all, delete-orphan",
    )


print("Listing model defined successfully")