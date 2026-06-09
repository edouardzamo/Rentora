from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.postgres.listings import Listing
from backend.schemas.logger import logger



def create_listing(db: Session, listing_data: dict, owner_id: int):
    new_listing = Listing(
        title=listing_data.title,
        description=listing_data.description,
        price=listing_data.price,
        location=listing_data.location,
        property_type=listing_data.property_type,
        bedrooms=listing_data.bedrooms,
        bathrooms=listing_data.bathrooms,
        owner_id=owner_id
    )
    logger.info(f"Creating new listing: {new_listing.title} by user {owner_id}")
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing