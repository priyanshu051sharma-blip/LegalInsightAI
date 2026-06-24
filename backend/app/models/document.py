from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, Float, JSON, ForeignKey
from sqlalchemy.types import TypeDecorator, CHAR
import uuid
from ..database import Base


class GUID(TypeDecorator):
    impl = CHAR
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return None
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return None
        return uuid.UUID(str(value))


class Document(Base):
    __tablename__ = "documents"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    user_id = Column(GUID(), ForeignKey("users.id"), nullable=False)
    title = Column(String, index=True)
    file_name = Column(String)
    file_path = Column(String)
    file_type = Column(String)
    file_size = Column(Integer)
    content = Column(Text)
    status = Column(String, default="uploaded")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class DocumentAnalysis(Base):
    __tablename__ = "document_analyses"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    document_id = Column(GUID(), ForeignKey("documents.id"), nullable=False)
    executive_summary = Column(Text)
    key_entities = Column(JSON)
    key_terms = Column(JSON)
    obligations = Column(JSON)
    deadlines = Column(JSON)
    penalties = Column(JSON)
    payment_terms = Column(JSON)
    relevant_cases = Column(JSON)
    case_citations = Column(JSON)
    precedents = Column(JSON)
    legal_arguments = Column(JSON)
    risk_score = Column(Float, default=0.0)
    high_risk_clauses = Column(JSON)
    medium_risk_clauses = Column(JSON)
    low_risk_clauses = Column(JSON)
    missing_protections = Column(JSON)
    compliance_status = Column(JSON)
    compliance_violations = Column(JSON)
    compliance_recommendations = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
