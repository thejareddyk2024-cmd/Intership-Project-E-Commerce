from fastapi import APIRouter, Depends, Query
from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database.dependencies import get_db
from app.core.redis import cache

from app.schemas.product import (
    ProductCreate,
    ProductResponse
)

from app.services.product_service import (
    create_product,
    get_all_products,
    get_product_by_id,
    search_products,
    update_product,
    delete_product,
    get_related_products
)

from app.core.auth import require_admin
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"]
)


@router.post(
    "",
    response_model=ProductResponse
)
def create_new_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    result = create_product(db, product)

    # Invalidate products cache after creating a new product
    cache.delete_pattern("products:*")

    return result


@router.get(
    "",
    response_model=List[ProductResponse]
)
def read_products(
    search: str = Query(default=""),
    category_id: int | None = Query(default=None),
    min_price: float | None = Query(default=None),
    max_price: float | None = Query(default=None),
    skip: int = Query(default=0),
    limit: int = Query(default=200),
    db: Session = Depends(get_db)
):
    # Only cache unfiltered "all products" requests
    is_default_request = (
        not search
        and category_id is None
        and min_price is None
        and max_price is None
        and skip == 0
        and limit == 200
    )

    if is_default_request:
        cached = cache.get("products:all")
        if cached:
            return cached

    results = search_products(
        db, search, category_id,
        min_price, max_price, skip, limit
    )

    if is_default_request:
        # Serialize ORM objects to dicts for JSON caching
        serialized = [
            ProductResponse.model_validate(p).model_dump()
            for p in results
        ]
        cache.set("products:all", serialized, ttl=300)  # 5 min

    return results


@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    # Check cache first
    cached = cache.get(f"products:{product_id}")
    if cached:
        return cached

    product = get_product_by_id(db, product_id)

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    # Cache individual product
    serialized = ProductResponse.model_validate(product).model_dump()
    cache.set(f"products:{product_id}", serialized, ttl=300)

    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_existing_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    result = update_product(db, product_id, product)

    # Invalidate caches for this product and the listing
    cache.delete(f"products:{product_id}")
    cache.delete("products:all")

    return result


@router.delete(
    "/{product_id}"
)
def delete_existing_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    result = delete_product(db, product_id)

    # Invalidate caches
    cache.delete(f"products:{product_id}")
    cache.delete("products:all")

    return result