from sqlalchemy import Column, Integer, String, DateTime,ForeignKey
from backend.postgres.connection import Base
from datetime import datetime
from sqlalchemy.orm import relationship


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True)

    listing_id = Column(Integer, ForeignKey("listings.id"))

    user_id = Column(Integer, ForeignKey("users.id"))

    rating = Column(Integer)

    comment = Column(String)