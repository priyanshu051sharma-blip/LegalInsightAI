import os
from datetime import timedelta
from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application Settings"""
    
    # App Config
    APP_NAME: str = "Legal Assistant API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://user:password@localhost:5432/legal_assistant"
    )
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379")
    
    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # LLM Settings
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.0-flash")
    LLM_TEMPERATURE: float = 0.3
    
    # RAG Settings
    CHROMA_COLLECTION_NAME: str = "legal_documents"
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_db"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    
    # File Upload
    UPLOAD_DIRECTORY: str = "./uploads"
    MAX_FILE_SIZE: int = 50 * 1024 * 1024  # 50MB
    ALLOWED_EXTENSIONS: list = ["pdf", "docx", "txt", "doc"]
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
    ]
    
    # Agents
    DOCUMENT_ANALYZER_TIMEOUT: int = 300
    CASE_RESEARCHER_TIMEOUT: int = 300
    RISK_DETECTOR_TIMEOUT: int = 300
    COMPLIANCE_CHECKER_TIMEOUT: int = 300
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
