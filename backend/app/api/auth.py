from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends
from fastapi import HTTPException, status
from app.core.auth import get_current_user
from app.models.user import User

from app.schemas.auth import (
    LoginRequest,
    TokenResponse
)

from app.services.user_service import (
    authenticate_user
)

from app.core.jwt import (
    create_access_token
)
from app.schemas.user import (
    UserCreate,
    UserResponse
)

from app.services.user_service import create_user

from app.database.dependencies import get_db

router = APIRouter(
    prefix="/api/v1/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(db, user)
@router.post(
    "/login",
    response_model=TokenResponse
)
def login_user(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    user = authenticate_user(
        db,
        credentials.email,
        credentials.password
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": user.role,
        "full_name": user.full_name
    }
@router.get(
    "/me",
    response_model=UserResponse
)
def read_current_user(
    current_user: User = Depends(
        get_current_user
    )
):
    return current_user