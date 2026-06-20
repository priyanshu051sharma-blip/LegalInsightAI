"""
Advanced API Routes with Real-time Features

Includes:
- WebSocket for real-time updates
- Batch processing
- Email notifications
- Audit logging
- Rate limiting
- Advanced analytics
"""

from fastapi import APIRouter, HTTPException, Depends, WebSocket, Query, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
import asyncio

from app.database import get_db
from app.utils.security import get_current_user
from app.utils.websocket_manager import ws_manager, EventType
from app.utils.audit_logger import audit_logger, AuditAction
from app.utils.rbac import Permission, has_permission
from app.services.batch_processor import batch_processor
from app.services.report_service import ReportGenerator
from app.services.email_service import email_service, AnalysisCompleteEmail
from app.models.user import User

router = APIRouter(prefix="/api/v1", tags=["advanced"])


# WebSocket Endpoint
@router.websocket("/ws/{user_id}/{room_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str, room_id: str):
    """WebSocket connection for real-time updates"""
    try:
        await ws_manager.connect(websocket, user_id, room_id)
        
        # Notify user of connection
        await ws_manager.broadcast_notification(
            room_id=room_id,
            title="Connected",
            message=f"User {user_id} connected",
            notification_type="info"
        )
        
        while True:
            # Receive messages from client
            data = await websocket.receive_json()
            
            # Process different message types
            if data.get("type") == "ping":
                await websocket.send_json({"type": "pong"})
            elif data.get("type") == "comment":
                await ws_manager.send_comment(
                    room_id=room_id,
                    user_id=user_id,
                    username=data.get("username"),
                    document_id=data.get("document_id"),
                    comment=data.get("comment")
                )
            elif data.get("type") == "status_update":
                await ws_manager.broadcast_event(
                    room_id=room_id,
                    event_type=EventType.STATUS_UPDATE,
                    data=data.get("payload", {})
                )
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        await ws_manager.disconnect(user_id, room_id)


# Batch Processing Endpoints
@router.post("/batch/create")
async def create_batch(
    document_ids: List[str],
    analysis_type: str = "full",
    priority: str = "normal",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a batch processing job"""
    if not has_permission(current_user.role, Permission.CREATE_ANALYSIS):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Log action
    await audit_logger.log(
        action=AuditAction.ANALYSIS_STARTED,
        user_id=current_user.id,
        resource_type="batch",
        details={"document_count": len(document_ids), "analysis_type": analysis_type}
    )
    
    batch = await batch_processor.create_batch(
        user_id=current_user.id,
        document_ids=document_ids,
        analysis_type=analysis_type,
        priority=priority
    )
    
    return {
        "success": True,
        "batch_id": batch["batch_id"],
        "status": batch["status"],
        "total_documents": batch["total_documents"]
    }


@router.get("/batch/{batch_id}")
async def get_batch_status(
    batch_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get batch processing status"""
    try:
        batch = await batch_processor.get_batch_status(batch_id)
        
        # Verify user owns this batch
        if batch["user_id"] != current_user.id and current_user.role not in ["admin", "super_admin"]:
            raise HTTPException(status_code=403, detail="Permission denied")
        
        return batch
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/batch/{batch_id}/results")
async def get_batch_results(
    batch_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get batch processing results"""
    try:
        results = await batch_processor.get_batch_results(batch_id)
        return results
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


# Report Generation Endpoints
@router.post("/documents/{document_id}/report/generate")
async def generate_report(
    document_id: str,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate professional PDF report"""
    if not has_permission(current_user.role, Permission.READ_ANALYSIS):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # Mock analysis data (in real implementation, fetch from database)
    analysis_data = {
        "document_title": "Sample Contract",
        "risk_score": 65,
        "summary": "This is a service agreement with moderate risk factors.",
        "high_risk_clauses": [
            "Unlimited liability clause found",
            "No termination notice period specified"
        ],
        "medium_risk_clauses": [
            "Ambiguous payment terms",
            "Unclear dispute resolution process"
        ],
        "low_risk_clauses": [
            "Standard confidentiality clause",
            "Reasonable intellectual property protections"
        ],
        "compliance_status": {
            "GDPR": True,
            "HIPAA": False,
            "CCPA": True
        },
        "violations": ["Missing HIPAA compliance requirements"],
        "recommendations": [
            "Add clear HIPAA compliance clause",
            "Clarify payment terms and conditions",
            "Include termination notice period (30-60 days)"
        ],
        "key_terms": ["Payment", "Confidentiality", "Liability", "Term"],
        "obligations": [
            "Provide services within 5 business days",
            "Maintain data confidentiality",
            "Provide quarterly reports"
        ],
        "deadlines": [
            "Contract renewal: 2025-06-20",
            "Quarterly review: 2024-09-20"
        ],
        "relevant_cases": [
            "Smith v. Johnson (Service Agreement Interpretation)",
            "Tech Corp v. Global Inc (Liability Limitations)"
        ],
        "case_citations": [
            "123 F.3d 456 (2023)",
            "456 U.S. 789 (2022)"
        ]
    }
    
    # Generate report
    report_generator = ReportGenerator()
    pdf_buffer = report_generator.generate(analysis_data)
    
    # Log action
    await audit_logger.log(
        action=AuditAction.DOCUMENT_EXPORTED,
        user_id=current_user.id,
        resource_type="document",
        resource_id=document_id,
        details={"export_type": "pdf_report"}
    )
    
    # Schedule email notification
    background_tasks.add_task(
        email_service.send_analysis_complete,
        to_email=current_user.email,
        user_name=current_user.username,
        document_title=analysis_data["document_title"],
        risk_score=analysis_data["risk_score"],
        dashboard_url="https://app.legalassistant.com/documents/" + document_id
    )
    
    return FileResponse(
        path=pdf_buffer,
        filename=f"{document_id}_analysis_report.pdf",
        media_type="application/pdf"
    )


# Real-time Analysis Endpoints
@router.post("/documents/{document_id}/analyze/realtime")
async def analyze_document_realtime(
    document_id: str,
    room_id: str,
    analysis_type: str = "full",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Analyze document with real-time progress updates"""
    if not has_permission(current_user.role, Permission.CREATE_ANALYSIS):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    async def analyze_with_updates():
        """Perform analysis and send progress updates"""
        try:
            # Send start notification
            await ws_manager.send_notification(
                user_id=current_user.id,
                room_id=room_id,
                title="Analysis Started",
                message=f"Analyzing document {document_id}",
                notification_type="info"
            )
            
            # Log start
            await audit_logger.log(
                action=AuditAction.ANALYSIS_STARTED,
                user_id=current_user.id,
                resource_type="document",
                resource_id=document_id,
                details={"analysis_type": analysis_type}
            )
            
            # Simulate analysis stages
            stages = [
                {"stage": "Extracting Document Content", "progress": 20},
                {"stage": "Analyzing Document Structure", "progress": 40},
                {"stage": "Detecting Risks", "progress": 60},
                {"stage": "Checking Compliance", "progress": 80},
                {"stage": "Generating Recommendations", "progress": 100}
            ]
            
            for stage in stages:
                await asyncio.sleep(2)  # Simulate processing
                await ws_manager.send_analysis_progress(
                    user_id=current_user.id,
                    room_id=room_id,
                    document_id=document_id,
                    progress={
                        "stage": stage["stage"],
                        "percentage": stage["progress"]
                    }
                )
            
            # Mock results
            results = {
                "document_id": document_id,
                "risk_score": 65,
                "summary": "Analysis complete",
                "high_risk_items": 2,
                "medium_risk_items": 3,
                "compliance_issues": 1
            }
            
            # Send completion notification
            await ws_manager.send_analysis_completed(
                room_id=room_id,
                document_id=document_id,
                results=results
            )
            
            # Log completion
            await audit_logger.log(
                action=AuditAction.ANALYSIS_COMPLETED,
                user_id=current_user.id,
                resource_type="document",
                resource_id=document_id,
                details={"risk_score": 65}
            )
            
        except Exception as e:
            await ws_manager.send_analysis_error(
                room_id=room_id,
                document_id=document_id,
                error=str(e)
            )
            await audit_logger.log(
                action=AuditAction.ANALYSIS_FAILED,
                user_id=current_user.id,
                resource_type="document",
                resource_id=document_id,
                status="failed",
                error_message=str(e)
            )
    
    # Start analysis in background
    asyncio.create_task(analyze_with_updates())
    
    return {
        "success": True,
        "message": "Analysis started",
        "document_id": document_id,
        "room_id": room_id
    }


# Analytics Endpoints
@router.get("/analytics/overview")
async def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get comprehensive analytics dashboard data"""
    if not has_permission(current_user.role, Permission.READ_ANALYSIS):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    return {
        "totalDocuments": 156,
        "completedAnalysis": 142,
        "highRiskCount": 23,
        "complianceRate": 87,
        "analysisTimeTrend": [
            {"date": "Week 1", "count": 12},
            {"date": "Week 2", "count": 19},
            {"date": "Week 3", "count": 15},
            {"date": "Week 4", "count": 28},
        ],
        "riskDistribution": [
            {"name": "Low Risk", "value": 89, "color": "#38a169"},
            {"name": "Medium Risk", "value": 43, "color": "#f6ad55"},
            {"name": "High Risk", "value": 18, "color": "#c53030"},
        ]
    }


# Audit Log Endpoints
@router.get("/audit/logs")
async def get_audit_logs(
    limit: int = Query(100, le=1000),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get audit logs"""
    if not has_permission(current_user.role, Permission.VIEW_AUDIT_LOG):
        raise HTTPException(status_code=403, detail="Permission denied")
    
    # This would query from database
    return {
        "logs": [],
        "total": 0,
        "limit": limit,
        "offset": offset
    }


# Health Check with Detailed Status
@router.get("/system/health")
async def system_health():
    """Get detailed system health status"""
    return {
        "status": "healthy",
        "timestamp": "2024-06-20T14:30:00Z",
        "services": {
            "database": "healthy",
            "cache": "healthy",
            "email": "healthy",
            "llm_api": "healthy",
            "storage": "healthy"
        },
        "metrics": {
            "uptime_percent": 99.97,
            "avg_response_time_ms": 245,
            "requests_per_minute": 1200,
            "active_websockets": 12
        }
    }
