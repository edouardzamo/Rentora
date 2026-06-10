from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.create_tables import get_db
from backend.schemas.current_user import get_current_user
from backend.postgres.models.user import User
from backend.postgres.listings import Listing
from backend.postgres.models.favorite import Favorite
from backend.postgres.conversations import Conversations
from backend.postgres.message import Message
from backend.schemas.dashboard_schema import DashboardResponse



router = APIRouter(
    tags=["Dashboard"]
)


@router.get("/stats", response_model=DashboardResponse)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get total listings for the landlord
    total_listings = db.query(func.count(Listing.id)).filter(Listing.owner_id == current_user.id).scalar() or 0

    # Get available listings
    available_listings = db.query(func.count(Listing.id)).filter(
        Listing.owner_id == current_user.id, 
        Listing.is_available == True
    ).scalar() or 0

    # Calculate rented listings
    rented_listings = total_listings - available_listings

    # Get total favorites for the landlord's listings
    favorite_count = db.query(func.count(Favorite.id)).join(
        Listing, Favorite.listing_id == Listing.id
    ).filter(Listing.owner_id == current_user.id).scalar() or 0

    # Get total conversations for the landlord's listings
    conversation = db.query(func.count(Conversations.id)).join(
        Listing, Conversations.listing_id == Listing.id
    ).filter(Listing.owner_id == current_user.id).scalar() or 0

    # Return exactly matching the schema field names
    return {
        "total_listings": total_listings,
        "available_listings": available_listings,
        "rented_listings": rented_listings,
        "favorite_count": favorite_count,
        "conversation": conversation
    }