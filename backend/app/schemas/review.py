from pydantic import BaseModel


class ReviewCreate(BaseModel):
    rating: int
    comment: str
    product_id: int


class ReviewResponse(BaseModel):
    id: int
    rating: int
    comment: str
    user_id: int
    product_id: int

    class Config:
        from_attributes = True