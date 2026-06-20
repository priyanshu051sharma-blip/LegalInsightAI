"""Routes package"""
from .health_routes import router as health_router
from .auth_routes import router as auth_router
from .document_routes import router as document_router
from .analysis_routes import router as analysis_router
from .chat_routes import router as chat_router
from .report_routes import router as report_router

__all__ = [
    "health_router",
    "auth_router",
    "document_router",
    "analysis_router",
    "chat_router",
    "report_router",
]
