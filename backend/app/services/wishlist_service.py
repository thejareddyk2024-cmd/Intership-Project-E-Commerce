from app.models.wishlist import Wishlist


def add_to_wishlist(
    db,
    user_id: int,
    product_id: int
):
    wishlist_item = Wishlist(
        user_id=user_id,
        product_id=product_id
    )

    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)

    return wishlist_item


def get_user_wishlist(
    db,
    user_id: int
):
    return (
        db.query(Wishlist)
        .filter(
            Wishlist.user_id == user_id
        )
        .all()
    )


def remove_from_wishlist(
    db,
    wishlist_id: int
):
    item = (
        db.query(Wishlist)
        .filter(
            Wishlist.id == wishlist_id
        )
        .first()
    )

    if item:
        db.delete(item)
        db.commit()

    return item