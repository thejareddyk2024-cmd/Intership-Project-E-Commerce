from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.database.dependencies import get_db

from app.core.auth import require_admin

from app.services.analytics_service import (
    get_dashboard_stats
)

router = APIRouter(
    prefix="/api/v1/analytics",
    tags=["Analytics"]
)


@router.get("/dashboard")
def dashboard_stats(
    db: Session = Depends(get_db)
):
    return get_dashboard_stats(
        db
    )