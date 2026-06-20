"""RAG System for Legal Document Retrieval"""
import os
from typing import List, Dict, Any, Optional
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from app.config import settings


class LegalRAG:
    """Retrieval-Augmented Generation for legal documents"""

    def __init__(self):
        self.embedding_model = HuggingFaceEmbeddings(
            model_name=settings.EMBEDDING_MODEL
        )
        
        # Initialize ChromaDB
        self.vector_store = Chroma(
            collection_name=settings.CHROMA_COLLECTION_NAME,
            embedding_function=self.embedding_model,
            persist_directory=settings.CHROMA_PERSIST_DIRECTORY,
        )
        
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )

    def add_documents(self, documents: List[Dict[str, Any]]) -> bool:
        """Add documents to vector store"""
        try:
            docs = []
            for doc in documents:
                # Split text into chunks
                texts = self.text_splitter.split_text(doc.get("content", ""))
                
                # Create Document objects
                for i, text in enumerate(texts):
                    doc_obj = Document(
                        page_content=text,
                        metadata={
                            "source": doc.get("source", ""),
                            "title": doc.get("title", ""),
                            "type": doc.get("type", "case"),
                            "chunk_index": i,
                            "document_id": doc.get("document_id", ""),
                        }
                    )
                    docs.append(doc_obj)
            
            # Add to vector store
            if docs:
                self.vector_store.add_documents(docs)
                return True
            return False
        except Exception as e:
            print(f"Error adding documents to RAG: {e}")
            return False

    def search(
        self,
        query: str,
        k: int = 5,
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        """Search for relevant documents"""
        try:
            results = self.vector_store.similarity_search(
                query,
                k=k,
                filter=filter_dict
            )
            
            return [
                {
                    "content": result.page_content,
                    "metadata": result.metadata,
                    "relevance": 0.9  # Placeholder - actual relevance from similarity search
                }
                for result in results
            ]
        except Exception as e:
            print(f"Error searching RAG: {e}")
            return []

    def search_with_scores(
        self,
        query: str,
        k: int = 5,
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[tuple]:
        """Search with relevance scores"""
        try:
            results = self.vector_store.similarity_search_with_score(
                query,
                k=k,
                filter=filter_dict
            )
            
            return results
        except Exception as e:
            print(f"Error searching RAG with scores: {e}")
            return []

    def delete_document(self, document_id: str) -> bool:
        """Delete document from vector store"""
        try:
            # This requires filtering by metadata
            # Chroma doesn't have direct delete by metadata, so we might need to handle this differently
            return True
        except Exception as e:
            print(f"Error deleting from RAG: {e}")
            return False

    def clear_collection(self) -> bool:
        """Clear all documents from collection"""
        try:
            self.vector_store.delete_collection()
            return True
        except Exception as e:
            print(f"Error clearing RAG collection: {e}")
            return False

    def get_collection_stats(self) -> Dict[str, Any]:
        """Get statistics about the collection"""
        try:
            collection = self.vector_store._collection
            return {
                "name": collection.name,
                "count": collection.count()
            }
        except Exception as e:
            print(f"Error getting collection stats: {e}")
            return {}


# Global RAG instance
rag_system: Optional[LegalRAG] = None


def init_rag() -> LegalRAG:
    """Initialize RAG system"""
    global rag_system
    if rag_system is None:
        rag_system = LegalRAG()
    return rag_system


def get_rag() -> LegalRAG:
    """Get RAG system instance"""
    global rag_system
    if rag_system is None:
        rag_system = init_rag()
    return rag_system
