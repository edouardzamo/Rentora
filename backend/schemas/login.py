from pydantic import BaseModel, Field



class LoginSchema(BaseModel):
    phone_number : str
    password : str

    # phone_number: str = Field(...,min_length=9, max_length=9)

    # password: str = Field(..., min_length=5, max_length=5)