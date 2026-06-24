from pydantic import BaseModel
from typing import Optional
from app.schemas.product import ProductResponse

class CartUpdate(BaseModel):
    quantity: int

class CartCreate(BaseModel):
    product_id: int
    quantity: int = 1


class CartResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True