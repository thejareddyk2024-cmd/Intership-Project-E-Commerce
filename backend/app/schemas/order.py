from pydantic import BaseModel
from typing import List, Optional
from app.schemas.product import ProductResponse


class OrderItemResponse(BaseModel):
    id: int
    product_id: int
    quantity: int
    price: float
    product: Optional[ProductResponse] = None

    class Config:
        from_attributes = True

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    items: List[OrderItemResponse] = []

    class Config:
        from_attributes = True

class CheckoutRequest(BaseModel):
    promo_code: Optional[str] = None

class PromoValidateRequest(BaseModel):
    promo_code: str

class PromoValidateResponse(BaseModel):
    valid: bool
    discount_percent: float
    message: str