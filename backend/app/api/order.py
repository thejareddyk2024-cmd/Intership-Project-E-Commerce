from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.database.dependencies import get_db
from app.core.auth import get_current_user

from app.schemas.order import (
    OrderResponse
)

from app.services.order_service import (
    create_order,
    get_user_orders,
    get_order_by_id,
    update_order_status
)

router = APIRouter(
    prefix="/api/v1/orders",
    tags=["Orders"]
)


@router.post(
    "/checkout",
    response_model=OrderResponse
)
def checkout(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return create_order(
        db,
        current_user.id
    )

@router.get(
    "",
    response_model=List[OrderResponse]
)
def read_orders(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_user_orders(
        db,
        current_user.id
    )

@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def read_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    return get_order_by_id(
        db,
        order_id
    )
@router.put(
    "/{order_id}/status",
    response_model=OrderResponse
)
def update_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db)
):
    return update_order_status(
        db,
        order_id,
        status
    )