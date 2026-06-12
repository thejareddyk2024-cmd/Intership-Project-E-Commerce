from app.models.cart import Cart
from app.models.product import Product

def add_to_cart(
    db,
    user_id: int,
    product_id: int,
    quantity: int
):
    cart_item = Cart(
        user_id=user_id,
        product_id=product_id,
        quantity=quantity
    )

    db.add(cart_item)
    db.commit()
    db.refresh(cart_item)

    return cart_item


def get_user_cart(
    db,
    user_id: int
):
    return (
        db.query(Cart)
        .filter(
            Cart.user_id == user_id
        )
        .all()
    )


def remove_cart_item(
    db,
    cart_id: int
):
    item = (
        db.query(Cart)
        .filter(
            Cart.id == cart_id
        )
        .first()
    )

    if item:
        db.delete(item)
        db.commit()

    return item
def update_cart_quantity(
    db,
    cart_id: int,
    quantity: int
):
    item = (
        db.query(Cart)
        .filter(Cart.id == cart_id)
        .first()
    )

    if item:
        item.quantity = quantity
        db.commit()
        db.refresh(item)

    return item

def get_cart_total(
    db,
    user_id: int
):
    cart_items = (
        db.query(Cart)
        .filter(
            Cart.user_id == user_id
        )
        .all()
    )

    total = 0

    for item in cart_items:
        product = (
            db.query(Product)
            .filter(
                Product.id == item.product_id
            )
            .first()
        )

        if product:
            total += (
                product.price *
                item.quantity
            )

    return {
        "total": total
    }