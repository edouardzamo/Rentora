from pydantic import BaseModel



class TokenResponseSchema(BaseModel):
    message: str
    token: str
    refresh_token: str