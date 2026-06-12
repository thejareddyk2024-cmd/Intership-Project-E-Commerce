from app.database.database import engine
from app.database.base import Base

# Import models
from app.models import *

Base.metadata.create_all(bind=engine)

print("Database tables created successfully!")