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
from app.services.stripe_service import create_checkout_session
from app.core.config import settings
from pydantic import BaseModel

class CheckoutResponse(BaseModel):
    checkout_url: str

router = APIRouter(
    prefix="/api/v1/orders",
    tags=["Orders"]
)


@router.post(
    "/checkout",
    response_model=CheckoutResponse
)
def checkout(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    order = create_order(
        db,
        current_user.id
    )
    
    if not order:
        return {"checkout_url": f"{settings.FRONTEND_URL.split(',')[0]}/cart"}
        
    frontend_url = settings.FRONTEND_URL.split(',')[0].strip('/')
    checkout_url = create_checkout_session(order.id, order.total_amount, frontend_url)
    
    return {"checkout_url": checkout_url}

@router.post("/checkout/success")
def checkout_success(
    session_id: str,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user)
):
    # In a real app, we'd verify the Stripe session here or via webhooks.
    # We will extract order_id from client_reference_id if we fetch the session,
    # or if simulated, from the session_id string.
    
    order_id = None
    if session_id.startswith("simulated_"):
        try:
            order_id = int(session_id.split("_")[-1])
        except ValueError:
            pass
    elif settings.STRIPE_SECRET_KEY:
        import stripe
        try:
            session = stripe.checkout.Session.retrieve(session_id)
            if session.client_reference_id:
                order_id = int(session.client_reference_id)
        except Exception as e:
            print(f"Error retrieving session: {e}")
            
    if order_id:
        # Mark as processing instead of pending
        update_order_status(db, order_id, "processing")
        
    return {"success": True, "order_id": order_id}

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