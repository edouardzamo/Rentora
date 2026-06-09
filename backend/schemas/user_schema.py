from pydantic  import BaseModel



class UserResponse(BaseModel):
    id : int
    name : str
    phone_number : str
    role : str

    class Config:
        from_attributes = True