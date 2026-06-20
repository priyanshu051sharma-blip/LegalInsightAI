from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, Float, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY
import uuid
from ..database import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    title = Column(String, index=True)
    file_name = Column(String)
    file_path = Column(String)
    file_type = Column(String)  # pdf, docx, txt
    file_size = Column(Integer)
    content = Column(Text)
    status = Column(String, default="uploaded")  # uploaded, processing, analyzed
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Document {self.title}>"


class DocumentAnalysis(Base):
    __tablename__ = "document_analyses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False)
    
    # Document Analysis Agent Output
    executive_summary = Column(Text)
    key_entities = Column(JSON)  # Legal entities, parties, dates
    key_terms = Column(JSON)  # Important clauses and definitions
    obligations = Column(JSON)  # Who does what
    deadlines = Column(JSON)  # Important dates and timelines
    penalties = Column(JSON)  # Penalties for breach
    payment_terms = Column(JSON)  # Payment conditions
    
    # Case Research Agent Output
    relevant_cases = Column(JSON)  # List of related case laws
    case_citations = Column(JSON)  # Legal citations
    precedents = Column(JSON)  # Similar judgments
    legal_arguments = Column(JSON)  # Key arguments from cases
    
    # Risk Detection Agent Output
    risk_score = Column(Float, default=0.0)  # 0-100
    high_risk_clauses = Column(JSON)  # High risk items
    medium_risk_clauses = Column(JSON)  # Medium risk items
    low_risk_clauses = Column(JSON)  # Low risk items
    missing_protections = Column(JSON)  # Missing legal protections
    
    # Compliance Checker Agent Output
    compliance_status = Column(JSON)  # GDPR, HIPAA, etc.
    compliance_violations = Column(JSON)  # Regulatory violations
    compliance_recommendations = Column(JSON)  # How to fix issues
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<DocumentAnalysis {self.document_id}>"
