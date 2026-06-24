from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean, JSON
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


class ComplianceCheck(Base):
    __tablename__ = "compliance_checks"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    document_id = Column(GUID(), nullable=False, index=True)
    regulation_type = Column(String)
    is_compliant = Column(Boolean, default=False)
    violations = Column(JSON)
    recommendations = Column(JSON)
    evidence = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
