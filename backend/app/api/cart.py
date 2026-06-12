from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.dependencies import get_db
from app.core.auth import get_current_user
from app.schemas.cart import (
    CartCreate,
    CartResponse,
    CartUpdate
)

from app.services.cart_service import (
    add_to_cart,
    get_user_cart,
    remove_cart_item,
    update_cart_quantity,
    get_cart_total
)

router = APIRouter(
    prefix="/api/v1/cart",
    tags=["Cart"]
)


@router.post(
    "",
    response_model=CartResponse
)
def add_product_to_cart(
    cart: CartCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return add_to_cart(
        db,
        current_user.id,
        cart.product_id,
        cart.quantity
    )


@router.get(
    "",
    response_model=List[CartResponse]
)
def read_cart(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_cart(
        db,
        current_user.id
    )


@router.delete(
    "/{cart_id}"
)
def delete_cart_item(
    cart_id: int,
    db: Session = Depends(get_db)
):
    return remove_cart_item(
        db,
        cart_id
    )

@router.put(
    "/{cart_id}",
    response_model=CartResponse
)
def update_cart_item(
    cart_id: int,
    cart: CartUpdate,
    db: Session = Depends(get_db)
):
    return update_cart_quantity(
        db,
        cart_id,
        cart.quantity
    )

@router.get(
    "/total"
)
def read_cart_total(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_cart_total(
        db,
        current_user.id
    )