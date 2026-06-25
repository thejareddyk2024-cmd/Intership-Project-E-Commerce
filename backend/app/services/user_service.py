from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import hash_password, verify_password


def create_user(
    db: Session,
    user_data: UserCreate
):
    # Check if this is the first user in the database
    is_first_user = db.query(User).count() == 0

    # Force theja@example.com to be an admin
    is_admin = is_first_user or user_data.email.lower() == "theja@example.com"

    user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        password_hash=hash_password(
            user_data.password
        ),
        role="admin" if is_admin else "customer"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_all_users(db: Session):
    return db.query(User).all()


def promote_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.role = "admin"
        db.commit()
        db.refresh(user)
    return user


def demote_user(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.role = "customer"
        db.commit()
        db.refresh(user)
    return user


def get_user_by_email(
    db,
    email: str
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def authenticate_user(
    db,
    email: str,
    password: str
):
    user = get_user_by_email(
        db,
        email
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash
    ):
        return None

    return user

def update_user_profile(
    db: Session,
    user_id: int,
    user_data: UserUpdate
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        return None

    if user_data.full_name is not None:
        user.full_name = user_data.full_name
    if user_data.email is not None:
        user.email = user_data.email
    if user_data.shipping_address is not None:
        user.shipping_address = user_data.shipping_address
    if user_data.password is not None and user_data.password.strip() != "":
        user.password_hash = hash_password(user_data.password)

    db.commit()
    db.refresh(user)
    return user