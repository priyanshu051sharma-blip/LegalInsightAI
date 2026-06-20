"""Service for document operations"""
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from app.models import Document, DocumentAnalysis
from app.schemas import DocumentCreate


class DocumentService:
    """Service for document operations"""

    @staticmethod
    def create_document(
        db: Session,
        user_id: str,
        doc: DocumentCreate,
        file_path: str,
        file_size: int,
        content: str
    ) -> Document:
        """Create a new document"""
        db_document = Document(
            user_id=user_id,
            title=doc.title,
            file_name=doc.file_name,
            file_type=doc.file_type,
            file_path=file_path,
            file_size=file_size,
            content=content,
            status="uploaded"
        )
        db.add(db_document)
        db.commit()
        db.refresh(db_document)
        return db_document

    @staticmethod
    def get_document(db: Session, document_id: str) -> Optional[Document]:
        """Get document by ID"""
        return db.query(Document).filter(Document.id == document_id).first()

    @staticmethod
    def get_user_documents(db: Session, user_id: str) -> List[Document]:
        """Get all documents for a user"""
        return db.query(Document).filter(Document.user_id == user_id).order_by(
            Document.created_at.desc()
        ).all()

    @staticmethod
    def update_document_status(
        db: Session,
        document_id: str,
        status: str
    ) -> Optional[Document]:
        """Update document status"""
        doc = DocumentService.get_document(db, document_id)
        if not doc:
            return None
        doc.status = status
        doc.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(doc)
        return doc

    @staticmethod
    def delete_document(db: Session, document_id: str) -> bool:
        """Delete document"""
        doc = DocumentService.get_document(db, document_id)
        if not doc:
            return False
        db.delete(doc)
        db.commit()
        return True

    @staticmethod
    def save_analysis(
        db: Session,
        document_id: str,
        analysis_data: dict
    ) -> DocumentAnalysis:
        """Save document analysis results"""
        # First, delete any existing analysis
        existing = db.query(DocumentAnalysis).filter(
            DocumentAnalysis.document_id == document_id
        ).first()
        if existing:
            db.delete(existing)
        
        # Create new analysis
        db_analysis = DocumentAnalysis(
            document_id=document_id,
            executive_summary=analysis_data.get("executive_summary"),
            key_entities=analysis_data.get("key_entities"),
            key_terms=analysis_data.get("key_terms"),
            obligations=analysis_data.get("obligations"),
            deadlines=analysis_data.get("deadlines"),
            penalties=analysis_data.get("penalties"),
            payment_terms=analysis_data.get("payment_terms"),
            relevant_cases=analysis_data.get("relevant_cases"),
            case_citations=analysis_data.get("case_citations"),
            precedents=analysis_data.get("precedents"),
            legal_arguments=analysis_data.get("legal_arguments"),
            risk_score=analysis_data.get("risk_score", 0.0),
            high_risk_clauses=analysis_data.get("high_risk_clauses"),
            medium_risk_clauses=analysis_data.get("medium_risk_clauses"),
            low_risk_clauses=analysis_data.get("low_risk_clauses"),
            missing_protections=analysis_data.get("missing_protections"),
            compliance_status=analysis_data.get("compliance_status"),
            compliance_violations=analysis_data.get("compliance_violations"),
            compliance_recommendations=analysis_data.get("compliance_recommendations"),
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)
        return db_analysis

    @staticmethod
    def get_analysis(db: Session, document_id: str) -> Optional[DocumentAnalysis]:
        """Get analysis for a document"""
        return db.query(DocumentAnalysis).filter(
            DocumentAnalysis.document_id == document_id
        ).first()
