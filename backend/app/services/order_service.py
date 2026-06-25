from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.cart import Cart
from app.models.product import Product
from fastapi import HTTPException

def create_order(
    db,
    user_id: int,
    promo_code: str = None
):
    cart_items = (
        db.query(Cart)
        .filter(
            Cart.user_id == user_id
        )
        .all()
    )

    if not cart_items:
        return None

    total_amount = 0

    order = Order(
        user_id=user_id,
        total_amount=0,
        status="pending"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in cart_items:

        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id
            )
            .first()
        )
        
        if product.stock_quantity < item.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Not enough stock for {product.name}"
            )

        item_total = (
            product.price *
            item.quantity
        )

        total_amount += item_total

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=item.quantity,
            price=product.price
        )

        db.add(order_item)

        # Reduce stock
        product.stock_quantity -= item.quantity

        # Remove cart item
        db.delete(item)

    # Apply discount if valid promo_code provided
    if promo_code:
        # Avoid circular import by defining it here or importing locally
        from app.api.order import ACTIVE_PROMOS
        code = promo_code.upper().strip()
        if code in ACTIVE_PROMOS:
            discount = ACTIVE_PROMOS[code]
            total_amount = total_amount * (1 - discount)

    order.total_amount = round(total_amount, 2)

    db.commit()
    db.refresh(order)

    return order


def get_user_orders(
    db,
    user_id: int
):
    return (
        db.query(Order)
        .filter(
            Order.user_id == user_id
        )
        .all()
    )


def get_order_by_id(
    db,
    order_id: int
):
    return (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )
def update_order_status(
    db,
    order_id: int,
    status: str
):
    order = (
        db.query(Order)
        .filter(
            Order.id == order_id
        )
        .first()
    )

    if not order:
        return None

    order.status = status

    db.commit()
    db.refresh(order)

    return order

def get_all_orders(db):
    return db.query(Order).all()