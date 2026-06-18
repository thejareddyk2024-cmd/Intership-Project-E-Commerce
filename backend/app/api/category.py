from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from app.database.dependencies import get_db

from app.schemas.category import (
    CategoryCreate,
    CategoryResponse
)

from app.services.category_service import (
    create_category,
    get_all_categories
)

from app.core.auth import require_admin
from app.models.user import User

router = APIRouter(
    prefix="/api/v1/categories",
    tags=["Categories"]
)


@router.post(
    "",
    response_model=CategoryResponse
)
def create_new_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin)
):
    return create_category(
        db,
        category
    )


@router.get(
    "",
    response_model=List[CategoryResponse]
)
def read_categories(
    db: Session = Depends(get_db)
):
    return get_all_categories(db)