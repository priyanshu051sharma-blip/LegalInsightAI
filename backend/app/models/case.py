from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, Integer, JSON
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..database import Base


class Case(Base):
    __tablename__ = "cases"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    case_number = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    court = Column(String)
    date_filed = Column(DateTime)
    date_decided = Column(DateTime)
    judge = Column(String)
    verdict = Column(String)
    summary = Column(Text)
    key_points = Column(JSON)  # Important takeaways
    citations = Column(JSON)  # Legal citations
    related_laws = Column(JSON)  # Relevant laws mentioned
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Case {self.case_number}>"
