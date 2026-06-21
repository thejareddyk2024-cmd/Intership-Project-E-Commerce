from app.database.database import SessionLocal
from app.services.user_service import create_user, authenticate_user
from app.schemas.user import UserCreate
import random

db = SessionLocal()
try:
    email = f"test_{random.randint(1000, 9999)}@example.com"
    password = "MySecurePassword123!"
    
    print(f"Creating user with email: {email}")
    user_in = UserCreate(full_name="Test User", email=email, password=password)
    user = create_user(db, user_in)
    print(f"User created: ID={user.id}, email={user.email}, role={user.role}, password_hash={user.password_hash}")
    
    print("\nAttempting authentication...")
    authenticated_user = authenticate_user(db, email, password)
    if authenticated_user:
        print("Success! Authenticated.")
    else:
        print("Failure! Authentication returned None.")
        
finally:
    db.close()
