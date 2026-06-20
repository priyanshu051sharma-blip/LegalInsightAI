"""RAG package"""
from .legal_rag import LegalRAG, init_rag, get_rag
from .document_parser import DocumentParser

__all__ = [
    "LegalRAG",
    "init_rag",
    "get_rag",
    "DocumentParser",
]
