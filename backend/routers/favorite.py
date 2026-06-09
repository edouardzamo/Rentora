# backend/routers/favorite.py
from fastapi import APIRouter, Depends, HTTPException
from backend.postgres.image import PropertyImage
from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.postgres.models.favorite import Favorite
from backend.postgres.models.user import User
from backend.postgres.listings import Listing
from backend.schemas.current_user import get_current_user

router = APIRouter(tags=["Favorites"])

@router.post("/add/{listing_id}")
async def add_favorite(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add a listing to favorites"""
    # Check if listing exists
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    # Check if already favorited
    existing = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.listing_id == listing_id
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    
    # Create favorite
    favorite = Favorite(
        user_id=current_user.id,
        listing_id=listing_id
    )
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    
    return {"message": "Added to favorites", "favorite_id": favorite.id}


@router.delete("/remove/{listing_id}")
async def remove_favorite(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Remove a listing from favorites"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.listing_id == listing_id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(favorite)
    db.commit()
    
    return {"message": "Removed from favorites"}


@router.get("/my-favorites")
async def get_my_favorites(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all favorite listings for current user"""
    favorites = db.query(Favorite).filter(Favorite.user_id == current_user.id).all()
    
    result = []
    for fav in favorites:
        listing = db.query(Listing).filter(Listing.id == fav.listing_id).first()
        if listing:
            images = db.query(PropertyImage).filter(PropertyImage.listing_id == listing.id).all()
            result.append({
                "id": listing.id,
                "title": listing.title,
                "description": listing.description,
                "price": listing.price,
                "location": listing.location,
                "bedrooms": listing.bedrooms,
                "bathrooms": listing.bathrooms,
                "property_type": listing.property_type,
                "is_available": listing.is_available,
                "favorite_id": fav.id,
                "images": [{"image_url": img.image_url, "is_cover": img.is_cover} for img in images]
            })
    
    return result


@router.get("/check/{listing_id}")
async def check_favorite(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Check if a listing is favorited"""
    favorite = db.query(Favorite).filter(
        Favorite.user_id == current_user.id,
        Favorite.listing_id == listing_id
    ).first()
    
    return {"is_favorited": favorite is not None, "favorite_id": favorite.id if favorite else None}