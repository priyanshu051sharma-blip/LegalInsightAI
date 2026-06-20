from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List, Dict, Any
import uuid


# ============== User Schemas ==============
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    organization: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    organization: Optional[str] = None
    password: Optional[str] = None


class UserResponse(UserBase):
    id: uuid.UUID
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============== Document Schemas ==============
class DocumentBase(BaseModel):
    title: str


class DocumentCreate(DocumentBase):
    file_name: str
    file_type: str


class DocumentResponse(DocumentBase):
    id: uuid.UUID
    user_id: uuid.UUID
    file_name: str
    file_type: str
    file_size: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============== Document Analysis Schemas ==============
class DocumentAnalysisResponse(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    
    # Document Analysis
    executive_summary: Optional[str] = None
    key_entities: Optional[Dict[str, Any]] = None
    key_terms: Optional[List[str]] = None
    obligations: Optional[List[Dict[str, Any]]] = None
    deadlines: Optional[List[Dict[str, Any]]] = None
    penalties: Optional[List[Dict[str, Any]]] = None
    payment_terms: Optional[Dict[str, Any]] = None
    
    # Case Research
    relevant_cases: Optional[List[Dict[str, Any]]] = None
    case_citations: Optional[List[str]] = None
    precedents: Optional[List[Dict[str, Any]]] = None
    legal_arguments: Optional[List[str]] = None
    
    # Risk Detection
    risk_score: float
    high_risk_clauses: Optional[List[Dict[str, Any]]] = None
    medium_risk_clauses: Optional[List[Dict[str, Any]]] = None
    low_risk_clauses: Optional[List[Dict[str, Any]]] = None
    missing_protections: Optional[List[str]] = None
    
    # Compliance
    compliance_status: Optional[Dict[str, Any]] = None
    compliance_violations: Optional[List[Dict[str, Any]]] = None
    compliance_recommendations: Optional[List[str]] = None
    
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ============== Case Schemas ==============
class CaseResponse(BaseModel):
    id: uuid.UUID
    case_number: str
    title: str
    description: str
    court: str
    verdict: str
    key_points: Optional[List[str]] = None
    citations: Optional[List[str]] = None
    related_laws: Optional[List[str]] = None

    class Config:
        from_attributes = True


# ============== Compliance Schemas ==============
class ComplianceCheckResponse(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    regulation_type: str
    is_compliant: bool
    violations: Optional[List[Dict[str, Any]]] = None
    recommendations: Optional[List[str]] = None
    evidence: Optional[List[str]] = None

    class Config:
        from_attributes = True


# ============== Analysis Result Schemas ==============
class AnalysisResultResponse(BaseModel):
    id: uuid.UUID
    document_id: uuid.UUID
    agent_type: str
    agent_status: str
    result_data: Optional[Dict[str, Any]] = None
    summary: Optional[str] = None
    execution_time: Optional[str] = None
    tokens_used: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============== Authentication Schemas ==============
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: Optional[str] = None
    token_type: str = "bearer"


class TokenPayload(BaseModel):
    sub: str
    exp: datetime
    iat: datetime


# ============== Agent Workflow Schemas ==============
class DocumentAnalysisRequest(BaseModel):
    document_id: uuid.UUID


class AnalysisWorkflowResponse(BaseModel):
    document_id: uuid.UUID
    status: str
    steps_completed: List[str]
    overall_progress: int  # 0-100
    analysis_result: Optional[DocumentAnalysisResponse] = None


# ============== Chat/Q&A Schemas ==============
class ChatMessage(BaseModel):
    role: str  # user, assistant
    content: str


class ChatRequest(BaseModel):
    document_id: Optional[uuid.UUID] = None
    query: str
    conversation_history: Optional[List[ChatMessage]] = None


class ChatResponse(BaseModel):
    query: str
    response: str
    sources: Optional[List[str]] = None
    confidence: float


# ============== Report Schemas ==============
class LegalReportRequest(BaseModel):
    document_id: uuid.UUID
    include_citations: bool = True
    include_recommendations: bool = True


class LegalReportResponse(BaseModel):
    document_id: uuid.UUID
    report_title: str
    generated_at: datetime
    sections: Dict[str, Any]
    risk_summary: Dict[str, Any]
    compliance_summary: Dict[str, Any]
    recommendations: List[str]
    pdf_url: Optional[str] = None
