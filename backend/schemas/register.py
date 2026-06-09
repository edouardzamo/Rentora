from pydantic import BaseModel, EmailStr, Field


class RegisterSchema(BaseModel):

    username: str

    phone_number: str = Field(...,min_length=9, max_length=9)

    password: str = Field(..., min_length=6, max_length=50)

    role: str