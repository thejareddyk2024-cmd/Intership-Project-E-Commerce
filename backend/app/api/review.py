from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.dependencies import get_db

from app.core.auth import (
    get_current_user
)

from app.schemas.review import (
    ReviewCreate,
    ReviewResponse
)

from app.services.review_service import (
    create_review,
    get_product_reviews
)

router = APIRouter(
    prefix="/api/v1/reviews",
    tags=["Reviews"]
)


@router.post(
    "",
    response_model=ReviewResponse
)
def add_review(
    review: ReviewCreate,
    db: Session = Depends(get_db)
):
    return create_review(
        db,
        1,
        review
    )


@router.get(
    "/{product_id}",
    response_model=List[ReviewResponse]
)
def read_reviews(
    product_id: int,
    db: Session = Depends(get_db)
):
    return get_product_reviews(
        db,
        product_id
    )