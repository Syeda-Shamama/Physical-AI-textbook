from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    # Background info collected at signup for personalization
    software_background = Column(Text, default="")
    hardware_background = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
