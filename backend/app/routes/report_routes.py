"""Report generation routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import LegalReportRequest, LegalReportResponse
from app.services import DocumentService
from app.utils.security import decode_token
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from datetime import datetime
import json
import os

router = APIRouter(prefix="/api/reports", tags=["reports"])
security = HTTPBearer()


def get_current_user_id(credentials: HTTPAuthCredentials = Depends(security)) -> str:
    """Get current user ID from token"""
    user_id = decode_token(credentials.credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return user_id


@router.post("/generate/{document_id}", response_model=LegalReportResponse)
async def generate_legal_report(
    document_id: str,
    include_citations: bool = True,
    include_recommendations: bool = True,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Generate comprehensive legal report"""
    try:
        # Get document
        doc = DocumentService.get_document(db, document_id)
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        
        if str(doc.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )
        
        # Get analysis
        analysis = DocumentService.get_analysis(db, document_id)
        if not analysis:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Analysis not found"
            )
        
        # Generate report
        report_title = f"Legal Analysis Report: {doc.title}"
        
        sections = {
            "document_summary": {
                "title": doc.title,
                "type": doc.file_type,
                "size": f"{doc.file_size / 1024:.2f} KB",
                "analyzed_at": analysis.created_at.isoformat()
            },
            "executive_summary": analysis.executive_summary or "N/A",
            "key_entities": analysis.key_entities or {},
            "obligations": analysis.obligations or [],
            "deadlines": analysis.deadlines or [],
            "payment_terms": analysis.payment_terms or {},
        }
        
        if include_citations:
            sections["case_references"] = {
                "relevant_cases": analysis.relevant_cases or [],
                "citations": analysis.case_citations or [],
                "precedents": analysis.precedents or []
            }
        
        risk_summary = {
            "risk_score": analysis.risk_score,
            "high_risk_count": len(analysis.high_risk_clauses or []),
            "medium_risk_count": len(analysis.medium_risk_clauses or []),
            "low_risk_count": len(analysis.low_risk_clauses or []),
            "high_risk_items": analysis.high_risk_clauses or [],
            "medium_risk_items": analysis.medium_risk_clauses or [],
            "missing_protections": analysis.missing_protections or []
        }
        
        compliance_summary = {
            "status": analysis.compliance_status or {},
            "violations": analysis.compliance_violations or [],
        }
        
        recommendations = include_recommendations and (
            analysis.compliance_recommendations or []
        ) or []
        
        return LegalReportResponse(
            document_id=document_id,
            report_title=report_title,
            generated_at=datetime.utcnow(),
            sections=sections,
            risk_summary=risk_summary,
            compliance_summary=compliance_summary,
            recommendations=recommendations,
            pdf_url=None
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating report: {str(e)}"
        )


@router.get("/download/{document_id}")
async def download_report(
    document_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Download report as PDF"""
    try:
        doc = DocumentService.get_document(db, document_id)
        if not doc:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        
        if str(doc.user_id) != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized"
            )
        
        # In production, implement PDF generation
        # For now, return JSON report as file
        report_data = {
            "document": doc.title,
            "generated_at": datetime.utcnow().isoformat(),
            "status": "Report generation in development"
        }
        
        return {
            "message": "PDF generation will be implemented with ReportLab/PyPDF",
            "report": report_data
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error downloading report: {str(e)}"
        )
