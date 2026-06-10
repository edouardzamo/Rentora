from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from typing import Optional
from sqlalchemy.orm import Session
from backend.create_tables import get_db
from backend.schemas.current_user import get_current_user
from backend.postgres.image import PropertyImage
from backend.postgres.listings import Listing
from backend.postgres.models.user import User
from backend.schemas.listing_schemas import createListingSchema, ListingResponseSchema
from backend.services.listing_service import create_listing as create_listing_service
from backend.schemas.roles import require_landlord_role
from backend.schemas.common_schema import MessageResponse
import cloudinary.uploader
from backend.services.cloudinary_service import upload_image_to_cloudinary


router = APIRouter(
    tags=["Listings"]
)


@router.post("/create-listings")
async def create_listing(
    listing: createListingSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    new_listing = create_listing_service(db, listing, current_user.id)
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    
    return {"message": "Listing created successfully", "listing_id": new_listing.id}


@router.get("/search")
async def search_listing(
    location: Optional[str] = None,
    price_min: Optional[float] = None,
    price_max: Optional[float] = None,
    bedrooms: Optional[int] = None,
    bathrooms: Optional[int] = None,
    property_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Listing).filter(Listing.is_available == True)
    
    if location:
        query = query.filter(Listing.location.ilike(f"%{location}%"))
    if price_min is not None:
        query = query.filter(Listing.price >= price_min)
    if price_max is not None:
        query = query.filter(Listing.price <= price_max)
    if bedrooms is not None:
        query = query.filter(Listing.bedrooms == bedrooms)
    if bathrooms is not None:
        query = query.filter(Listing.bathrooms == bathrooms)
    if property_type is not None:
        query = query.filter(Listing.property_type == property_type)
    
    results = query.all()
    return results

@router.post("/{listing_id}/upload-images")
async def upload_multiple_images(
    listing_id: int,
    files: list[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload multiple images for a listing"""
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    uploaded_images = []
    for idx, file in enumerate(files):
        # Upload to Cloudinary
        result = upload_image_to_cloudinary(file, folder=f"listings/{listing_id}")
        
        # Save to database
        new_image = PropertyImage(
            listing_id=listing_id,
            image_url=result["url"],
            is_cover=(idx == 0)  # First image becomes cover
        )
        db.add(new_image)
        uploaded_images.append({
            "url": result["url"],
            "is_cover": (idx == 0)
        })
    
    db.commit()
    
    return {
        "message": f"Successfully uploaded {len(uploaded_images)} images",
        "images": uploaded_images
    }

@router.get("/my-listings")
async def get_my_listings(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_landlord_role)
):
    listings = db.query(Listing).filter(Listing.owner_id == current_user.id).all()
    return listings


@router.put("/{listing_id}")
async def update_listing(
    listing_id: int,
    listing_data: createListingSchema,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this listing")

    listing.title = listing_data.title
    listing.description = listing_data.description
    listing.price = listing_data.price
    listing.location = listing_data.location
    listing.bedrooms = listing_data.bedrooms
    listing.bathrooms = listing_data.bathrooms
    listing.property_type = listing_data.property_type

    db.commit()
    db.refresh(listing)

    return listing


@router.delete("/{listing_id}")
async def delete_listing(
    listing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this listing")

    db.delete(listing)
    db.commit()

    return {"message": "Listing deleted successfully"}

# backend/routers/listings.py

@router.get("/")
async def get_all_listings(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    offset = (page - 1) * limit
    listings = db.query(Listing).filter(Listing.is_available == True).offset(offset).limit(limit).all()
    total = db.query(Listing).filter(Listing.is_available == True).count()
    
    # Include images for each listing
    result_listings = []
    for listing in listings:
        images = db.query(PropertyImage).filter(PropertyImage.listing_id == listing.id).all()
        result_listings.append({
            "id": listing.id,
            "title": listing.title,
            "description": listing.description,
            "price": listing.price,
            "location": listing.location,
            "bedrooms": listing.bedrooms,
            "bathrooms": listing.bathrooms,
            "property_type": listing.property_type,
            "is_available": listing.is_available,
            "created_at": listing.created_at,
            "images": [{"id": img.id, "image_url": img.image_url, "is_cover": img.is_cover} for img in images]
        })
    
    return {
        "page": page,
        "limit": limit,
        "total": total,
        "total_pages": (total + limit - 1) // limit if total > 0 else 0,
        "listings": result_listings
    }


@router.get("/{listing_id}")
async def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    images = db.query(PropertyImage).filter(PropertyImage.listing_id == listing_id).all()
    
    return {
        "id": listing.id,
        "title": listing.title,
        "description": listing.description,
        "price": listing.price,
        "location": listing.location,
        "bedrooms": listing.bedrooms,
        "bathrooms": listing.bathrooms,
        "property_type": listing.property_type,
        "is_available": listing.is_available,
        "created_at": listing.created_at,
        "owner_id": listing.owner_id,
        "images": [{"id": img.id, "image_url": img.image_url, "is_cover": img.is_cover} for img in images]
    }

@router.put("/{listing_id}/rent")
async def rent_listing(
    listing_id: int,
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if not listing.is_available:
        raise HTTPException(status_code=400, detail="Listing is not available for rent")

    listing.is_available = False
    db.commit()
    db.refresh(listing)

    return {"message": "Listing rented successfully"}


@router.put("/{listing_id}/availability")
async def update_availability(
    listing_id: int,
    is_available: bool,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this listing")

    listing.is_available = is_available
    db.commit()
    db.refresh(listing)

    return {"message": "Listing availability updated successfully"}


@router.get("/{listing_id}/images")
async def get_listing_images(
    listing_id: int,
    db: Session = Depends(get_db)
):
    listing = db.query(Listing).filter(Listing.id == listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    images = db.query(PropertyImage).filter(PropertyImage.listing_id == listing_id).all()
    return images


@router.delete("/images/{image_id}", response_model=MessageResponse)
async def delete_listing_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = db.query(PropertyImage).filter(PropertyImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    listing = db.query(Listing).filter(Listing.id == image.listing_id).first()
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this image")

    db.delete(image)
    db.commit()

    return {"message": "Image deleted successfully"}


@router.put("/images/{image_id}/cover")
async def set_cover_image(
    image_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image = db.query(PropertyImage).filter(PropertyImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Image not found")
    
    listing = db.query(Listing).filter(Listing.id == image.listing_id).first()
    if listing.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this image")

    # Set all images of the listing to not cover
    db.query(PropertyImage).filter(PropertyImage.listing_id == listing.id).update({"is_cover": False})
    
    # Set the selected image as cover
    image.is_cover = True
    db.commit()
    db.refresh(image)

    return {"message": "Cover image updated successfully"}

@router.options("/{listing_id}/upload-image")
async def options_upload_image(listing_id: int):
    return {"message": "OK"}

