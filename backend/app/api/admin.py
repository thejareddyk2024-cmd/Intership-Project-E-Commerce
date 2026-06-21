from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.dependencies import get_db
from app.core.auth import require_admin
from app.schemas.user import UserResponse
from app.schemas.order import OrderResponse
from app.services.user_service import (
    get_all_users,
    promote_user,
    demote_user
)
from app.services.order_service import (
    get_all_orders,
    update_order_status
)
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/admin",
    tags=["Admin Management"]
)

@router.get(
    "/users",
    response_model=List[UserResponse]
)
def list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return get_all_users(db)

@router.put(
    "/promote/{user_id}",
    response_model=UserResponse
)
def promote(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = promote_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.put(
    "/demote/{user_id}",
    response_model=UserResponse
)
def demote(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    user = demote_user(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.get(
    "/orders",
    response_model=List[OrderResponse]
)
def list_orders(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return get_all_orders(db)

@router.put(
    "/orders/{order_id}/status",
    response_model=OrderResponse
)
def update_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    order = update_order_status(db, order_id, status)
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )
    return order
