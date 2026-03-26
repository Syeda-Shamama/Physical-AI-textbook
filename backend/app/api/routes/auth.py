from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select
from app.services.auth import hash_password, verify_password, create_access_token
from app.models.user import User, Base
from app.core.config import settings
import uuid

router = APIRouter(prefix="/auth", tags=["auth"])

engine = create_async_engine(settings.database_url)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    software_background: str = ""
    hardware_background: str = ""


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/signup", response_model=TokenResponse)
async def signup(data: SignupRequest):
    async with AsyncSessionLocal() as session:
        existing = await session.execute(select(User).where(User.email == data.email))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Email already registered")
        user = User(
            id=str(uuid.uuid4()),
            email=data.email,
            hashed_password=hash_password(data.password),
            software_background=data.software_background,
            hardware_background=data.hardware_background,
        )
        session.add(user)
        await session.commit()
    token = create_access_token({"sub": data.email})
    return TokenResponse(access_token=token)


@router.post("/login", response_model=TokenResponse)
async def login(data: LoginRequest):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == data.email))
        user = result.scalar_one_or_none()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": data.email})
    return TokenResponse(access_token=token)


@router.get("/me")
async def get_me(email: str):
    """Get user background info for personalization."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "email": user.email,
        "software_background": user.software_background,
        "hardware_background": user.hardware_background,
    }
