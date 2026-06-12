from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.dependencies import get_db
from app.core.auth import get_current_user

from app.schemas.wishlist import (
    WishlistCreate,
    WishlistResponse
)

from app.services.wishlist_service import (
    add_to_wishlist,
    get_user_wishlist,
    remove_from_wishlist
)

router = APIRouter(
    prefix="/api/v1/wishlist",
    tags=["Wishlist"]
)


@router.post(
    "",
    response_model=WishlistResponse
)
def add_product_to_wishlist(
    wishlist: WishlistCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return add_to_wishlist(
        db,
        current_user.id,
        wishlist.product_id
    )


@router.get(
    "",
    response_model=List[WishlistResponse]
)
def read_wishlist(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_wishlist(
        db,
        current_user.id
    )


@router.delete(
    "/{wishlist_id}"
)
def delete_wishlist_item(
    wishlist_id: int,
    db: Session = Depends(get_db)
):
    return remove_from_wishlist(
        db,
        wishlist_id
    )