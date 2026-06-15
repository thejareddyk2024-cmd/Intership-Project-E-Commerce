from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List

from app.database.dependencies import get_db

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
    delete_product
)

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
    db: Session = Depends(get_db)
):
    return create_product(
        db,
        product
    )


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
    limit: int = Query(default=10),
    db: Session = Depends(get_db)
):
    return search_products(
        db,
        search,
        category_id,
        min_price,
        max_price,
        skip,
        limit
    )


@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def read_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return get_product_by_id(
        db,
        product_id
    )

@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_existing_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    return update_product(
        db,
        product_id,
        product
    )
@router.delete(
    "/{product_id}"
)
def delete_existing_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    return delete_product(
        db,
        product_id
    )