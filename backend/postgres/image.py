from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey,Boolean
from backend.postgres.connection import Base
from sqlalchemy.orm import relationship


class PropertyImage(Base):
    __tablename__ = "property_images"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)
    image_url = Column(String, nullable=False)
    public_id = Column(String, nullable=True)
    is_cover = Column(Boolean, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship(
        "Listing",
        back_populates="images",
        foreign_keys=[listing_id],
    )