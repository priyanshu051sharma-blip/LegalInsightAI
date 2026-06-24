"""Analysis routes"""
from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import DocumentAnalysisRequest, AnalysisWorkflowResponse
from app.services import DocumentService
from app.agents import get_workflow
from app.utils.security import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

router = APIRouter(prefix="/api/analysis", tags=["analysis"])
security = HTTPBearer()


def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Get current user ID from token"""
    user_id = decode_token(credentials.credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return user_id


@router.post("/analyze/{document_id}", response_model=AnalysisWorkflowResponse)
async def analyze_document(
    document_id: str,
    analysis_type: Optional[str] = "full",
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id),
    background_tasks: BackgroundTasks = BackgroundTasks()
):
    """Analyze a document with AI agents"""
    try:
        # Verify document exists and belongs to user
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
        
        # Update status
        DocumentService.update_document_status(db, document_id, "processing")
        
        # Run analysis
        workflow = get_workflow()
        
        if analysis_type == "risk":
            result = workflow.run_risk_analysis_only(doc.content)
        elif analysis_type == "compliance":
            result = workflow.run_compliance_only(doc.content)
        else:
            result = workflow.run_full_analysis(doc.content)
        
        if result["success"]:
            # Save analysis results
            DocumentService.save_analysis(db, document_id, {
                "executive_summary": result.get("document_analysis", {}).get("executive_summary"),
                "key_entities": result.get("document_analysis", {}).get("key_entities"),
                "key_terms": result.get("document_analysis", {}).get("key_terms"),
                "obligations": result.get("document_analysis", {}).get("obligations"),
                "deadlines": result.get("document_analysis", {}).get("deadlines"),
                "penalties": result.get("document_analysis", {}).get("penalties"),
                "payment_terms": result.get("document_analysis", {}).get("payment_terms"),
                "relevant_cases": result.get("case_research", {}).get("relevant_cases"),
                "case_citations": result.get("case_research", {}).get("case_citations"),
                "precedents": result.get("case_research", {}).get("precedents"),
                "legal_arguments": result.get("case_research", {}).get("legal_arguments"),
                "risk_score": result.get("risk_detection", {}).get("risk_score", 0.0),
                "high_risk_clauses": result.get("risk_detection", {}).get("high_risk_clauses"),
                "medium_risk_clauses": result.get("risk_detection", {}).get("medium_risk_clauses"),
                "low_risk_clauses": result.get("risk_detection", {}).get("low_risk_clauses"),
                "missing_protections": result.get("risk_detection", {}).get("missing_protections"),
                "compliance_status": result.get("compliance_check", {}).get("compliance_status"),
                "compliance_violations": result.get("compliance_check", {}).get("violations"),
                "compliance_recommendations": result.get("compliance_check", {}).get("recommendations"),
            })
            
            # Update document status
            DocumentService.update_document_status(db, document_id, "analyzed")
            
            return AnalysisWorkflowResponse(
                document_id=document_id,
                status="completed",
                steps_completed=result.get("steps_completed", []),
                overall_progress=result.get("overall_progress", 100),
                analysis_result=DocumentService.get_analysis(db, document_id)
            )
        else:
            DocumentService.update_document_status(db, document_id, "failed")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Analysis failed: {result.get('error', 'Unknown error')}"
            )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during analysis: {str(e)}"
        )


@router.get("/status/{document_id}")
async def get_analysis_status(
    document_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Get analysis status"""
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
    
    return {
        "document_id": document_id,
        "status": doc.status,
        "analysis_available": doc.status == "analyzed"
    }
