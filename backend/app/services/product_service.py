from app.models.product import Product


def get_all_products(db):
    return db.query(Product).all()


def get_product_by_id(
    db,
    product_id: int
):
    return (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )


def create_product(db, product_data):
    product = Product(
        name=product_data.name,
        description=product_data.description,
        price=product_data.price,
        stock_quantity=product_data.stock_quantity,
        image_url=product_data.image_url,
        category_id=product_data.category_id
    )

    db.add(product)
    db.commit()
    db.refresh(product)

    return product


def search_products(
    db,
    search: str = "",
    category_id: int | None = None,
    min_price: float | None = None,
    max_price: float | None = None,
    skip: int = 0,
    limit: int = 10
):
    query = db.query(Product)

    if search:
        query = query.filter(
            Product.name.ilike(
                f"%{search}%"
            )
        )

    if category_id:
        query = query.filter(
            Product.category_id == category_id
        )

    if min_price is not None:
        query = query.filter(
            Product.price >= min_price
        )

    if max_price is not None:
        query = query.filter(
            Product.price <= max_price
        )

    return (
        query
        .offset(skip)
        .limit(limit)
        .all()
    )