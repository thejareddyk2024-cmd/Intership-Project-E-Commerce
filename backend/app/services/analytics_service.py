from sqlalchemy import func

from app.models.product import Product
from app.models.user import User
from app.models.order import Order
from app.models.review import Review
from app.models.wishlist import Wishlist


def get_dashboard_stats(db):

    total_products = (
        db.query(Product)
        .count()
    )

    total_users = (
        db.query(User)
        .count()
    )

    total_orders = (
        db.query(Order)
        .count()
    )

    total_revenue = (
        db.query(
            func.sum(Order.total_amount)
        )
        .scalar()
    ) or 0

    top_rated = (
        db.query(
            Product.name,
            func.avg(Review.rating)
                .label("avg_rating")
        )
        .join(
            Review,
            Product.id == Review.product_id
        )
        .group_by(Product.id)
        .order_by(
            func.avg(
                Review.rating
            ).desc()
        )
        .first()
    )

    most_wishlisted = (
        db.query(
            Product.name,
            func.count(
                Wishlist.id
            ).label("wishlist_count")
        )
        .join(
            Wishlist,
            Product.id == Wishlist.product_id
        )
        .group_by(Product.id)
        .order_by(
            func.count(
                Wishlist.id
            ).desc()
        )
        .first()
    )

    return {
        "total_products":
            total_products,

        "total_users":
            total_users,

        "total_orders":
            total_orders,

        "total_revenue":
            total_revenue,

        "top_rated_product":
            top_rated.name
            if top_rated else
            "No Reviews Yet",

        "top_rated_score":
            round(
                top_rated.avg_rating,
                1
            )
            if top_rated else
            0,

        "most_wishlisted_product":
            most_wishlisted.name
            if most_wishlisted else
            "No Wishlist Data",

        "wishlist_count":
            most_wishlisted.wishlist_count
            if most_wishlisted else
            0
    }