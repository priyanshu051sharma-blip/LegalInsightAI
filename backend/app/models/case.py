from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, JSON
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


class Case(Base):
    __tablename__ = "cases"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    case_number = Column(String, unique=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    court = Column(String)
    date_filed = Column(DateTime)
    date_decided = Column(DateTime)
    judge = Column(String)
    verdict = Column(String)
    summary = Column(Text)
    key_points = Column(JSON)
    citations = Column(JSON)
    related_laws = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
