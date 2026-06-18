from app.database.database import engine, SessionLocal
from app.database.base import Base
from app.models.user import User
from app.core.security import hash_password

# Import models
from app.models import *

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")

# Ensure admin user exists
db = SessionLocal()
try:
    admin_email = "theja@example.com"
    admin_user = db.query(User).filter(User.email == admin_email).first()

    if admin_user:
        if admin_user.role != "admin":
            admin_user.role = "admin"
            db.commit()
            print(f"Updated user {admin_email} to admin role.")
    else:
        # Create default admin if not exists
        new_admin = User(
            full_name="Theja Admin",
            email=admin_email,
            password_hash=hash_password("password123"),
            role="admin"
        )
        db.add(new_admin)
        db.commit()
        print(f"Created default admin user: {admin_email}")

    # Set all other users to customer if they have no role or if we want to enforce it
    # For now, just ensure theja is admin.
finally:
    db.close()