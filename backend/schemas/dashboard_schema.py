from pydantic import BaseModel



class DashboardResponse(BaseModel):
    total_listings: int
    available_listings: int
    rented_listings: int
    favorite_count: int
    conversation: int

    class Config:
        from_attributes = True