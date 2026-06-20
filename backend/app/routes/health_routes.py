"""Health check routes"""
from fastapi import APIRouter

router = APIRouter(tags=["health"])


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "Legal Assistant API",
        "version": "1.0.0"
    }


@router.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Legal Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "auth": "/api/auth",
            "documents": "/api/documents",
            "analysis": "/api/analysis",
            "chat": "/api/chat",
            "reports": "/api/reports"
        }
    }
