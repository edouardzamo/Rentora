from pydantic import BaseModel


class UpdateProfileSchema(BaseModel):
    name : str
    phone_number : str

class ChangePasswordSchema(BaseModel):
    old_password : str
    new_password : str