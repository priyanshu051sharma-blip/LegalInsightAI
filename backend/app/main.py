"""Main FastAPI Application"""
import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db
from app.utils import ensure_upload_directory
from app.rag import init_rag
from app.routes import (
    health_router,
    auth_router,
    document_router,
    analysis_router,
    chat_router,
    report_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup and shutdown"""
    # Startup
    print("Starting Legal Assistant API...")
    
    # Initialize database
    try:
        init_db()
        print("Database initialized")
    except Exception as e:
        print(f"Database initialization warning: {e}")
    
    # Create upload directory
    ensure_upload_directory()
    print("Upload directory ready")
    
    # Initialize RAG
    try:
        init_rag()
        print("RAG system initialized")
    except Exception as e:
        print(f"RAG initialization warning: {e}")
    
    yield
    
    # Shutdown
    print("Shutting down Legal Assistant API...")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Multi-Agent Legal Assistant API",
    lifespan=lifespan,
    debug=settings.DEBUG
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health_router)
app.include_router(auth_router)
app.include_router(document_router)
app.include_router(analysis_router)
app.include_router(chat_router)
app.include_router(report_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
