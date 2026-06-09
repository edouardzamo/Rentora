from pydantic import BaseModel, Field



class createListingSchema(BaseModel):
    
    title: str
    description: str
    price: float
    location: str
    bedrooms: int
    bathrooms: int
    property_type: str
    owner_id: int | None = None

class ListingResponseSchema(BaseModel):
    id: int
    title: str
    description: str
    price: float
    location: str
    bedrooms: int
    bathrooms: int
    property_type: str
    owner_id: int
    is_available: bool
    views: int

    class Config:
        from_attributes = True