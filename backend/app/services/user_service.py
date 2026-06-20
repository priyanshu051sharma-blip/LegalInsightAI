"""Service classes for business logic"""
from typing import Optional
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserCreate
from app.utils.security import hash_password, verify_password


class UserService:
    """Service for user operations"""

    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create a new user"""
        db_user = User(
            email=user.email,
            username=user.username,
            hashed_password=hash_password(user.password),
            full_name=user.full_name,
            organization=user.organization,
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        """Get user by username"""
        return db.query(User).filter(User.username == username).first()

    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = UserService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
        """Get user by ID"""
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update_user(db: Session, user_id: str, **kwargs) -> Optional[User]:
        """Update user information"""
        user = UserService.get_user_by_id(db, user_id)
        if not user:
            return None
        
        for key, value in kwargs.items():
            if key == "password":
                user.hashed_password = hash_password(value)
            elif hasattr(user, key):
                setattr(user, key, value)
        
        db.commit()
        db.refresh(user)
        return user
