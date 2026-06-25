from sqlalchemy import func

from app.models.product import Product
from app.models.user import User
from app.models.order import Order
from app.models.review import Review
from app.models.wishlist import Wishlist
from app.models.category import Category
from app.models.order_item import OrderItem
from collections import defaultdict


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

    # Sales Over Time
    all_orders = db.query(Order.created_at, Order.total_amount).all()
    sales_dict = defaultdict(float)
    for order in all_orders:
        if order.created_at:
            date_str = order.created_at.strftime('%Y-%m-%d')
            sales_dict[date_str] += float(order.total_amount or 0)
    sales_over_time = [{"date": k, "sales": round(v, 2)} for k, v in sorted(sales_dict.items())]

    # Revenue by Category
    category_revenue = (
        db.query(
            Category.name,
            func.sum(OrderItem.price * OrderItem.quantity).label("revenue")
        )
        .join(Product, Category.id == Product.category_id)
        .join(OrderItem, Product.id == OrderItem.product_id)
        .group_by(Category.name)
        .all()
    )
    revenue_by_category = [{"name": cr.name, "value": round(cr.revenue or 0, 2)} for cr in category_revenue]

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
            0,
            
        "sales_over_time":
            sales_over_time,
            
        "revenue_by_category":
            revenue_by_category
    }