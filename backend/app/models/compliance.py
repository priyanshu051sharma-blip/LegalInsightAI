from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Boolean, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..database import Base


class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    regulation_type = Column(String)  # GDPR, HIPAA, CCPA, etc.
    is_compliant = Column(Boolean, default=False)
    violations = Column(JSON)  # List of violations
    recommendations = Column(JSON)  # How to fix
    evidence = Column(JSON)  # References and citations
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<ComplianceCheck {self.regulation_type}>"
