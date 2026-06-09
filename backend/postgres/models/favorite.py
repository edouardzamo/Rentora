from sqlalchemy import Column, Integer, ForeignKey
from backend.postgres.connection import Base
from sqlalchemy.orm import relationship


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    listing_id = Column(Integer, ForeignKey("listings.id"), nullable=False)

    user = relationship(
        "User",
        foreign_keys=[user_id],
        back_populates="favorites",
    )

    listing = relationship(
        "Listing",
        foreign_keys=[listing_id],
        back_populates="favorites",
    )