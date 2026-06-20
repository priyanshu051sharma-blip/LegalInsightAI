from datetime import datetime
from sqlalchemy import Column, String, DateTime, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
import uuid
from ..database import Base


class AnalysisResult(Base):
    __tablename__ = "analysis_results"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    document_id = Column(UUID(as_uuid=True), ForeignKey("documents.id"), nullable=False, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Agent execution metadata
    agent_type = Column(String)  # document_analyzer, case_researcher, risk_detector, compliance_checker
    agent_status = Column(String, default="pending")  # pending, processing, completed, failed
    
    # Results
    result_data = Column(JSON)  # Full result from agent
    summary = Column(Text)  # Brief summary
    
    # Execution info
    execution_time = Column(String)  # How long it took
    tokens_used = Column(String)  # API tokens used
    
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<AnalysisResult {self.agent_type}>"
