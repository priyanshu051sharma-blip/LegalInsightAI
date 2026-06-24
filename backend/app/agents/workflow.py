"""LangGraph Workflow Orchestrator"""
from typing import Dict, Any, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from app.config import settings
from .document_analyzer import get_document_analyzer
from .case_researcher import get_case_researcher
from .risk_detector import get_risk_detector
from .compliance_checker import get_compliance_checker


class AgentWorkflow:
    """Orchestrates multi-agent workflow for document analysis"""

    def __init__(self):
        self.document_analyzer = get_document_analyzer()
        self.case_researcher = get_case_researcher()
        self.risk_detector = get_risk_detector()
        self.compliance_checker = get_compliance_checker()

    def run_full_analysis(self, document_content: str) -> Dict[str, Any]:
        """Run complete analysis workflow"""
        try:
            # Step 1: Document Analysis
            print("Starting document analysis...")
            doc_analysis = self.document_analyzer.analyze(document_content)
            if not doc_analysis["success"]:
                return {"success": False, "error": "Document analysis failed"}
            
            # Step 2: Case Research
            print("Starting case research...")
            query = doc_analysis["data"].get("executive_summary", "legal document analysis")
            case_research = self.case_researcher.research(
                query,
                context=document_content[:5000]
            )
            
            # Step 3: Risk Detection
            print("Starting risk detection...")
            risk_detection = self.risk_detector.detect_risks(
                document_content,
                analysis_context=doc_analysis["data"].get("executive_summary", "")
            )
            
            # Step 4: Compliance Checking
            print("Starting compliance checking...")
            compliance_check = self.compliance_checker.check_compliance(
                document_content
            )
            
            # Aggregate results
            final_result = {
                "success": True,
                "document_analysis": doc_analysis["data"],
                "case_research": case_research["data"],
                "risk_detection": risk_detection["data"],
                "compliance_check": compliance_check["data"],
                "workflow_status": "completed",
                "steps_completed": [
                    "document_analysis",
                    "case_research",
                    "risk_detection",
                    "compliance_check"
                ],
                "overall_progress": 100
            }
            
            return final_result

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "workflow_status": "failed"
            }

    def run_risk_analysis_only(self, document_content: str) -> Dict[str, Any]:
        """Run risk analysis workflow only"""
        try:
            doc_analysis = self.document_analyzer.analyze(document_content)
            risk_detection = self.risk_detector.detect_risks(document_content)
            
            return {
                "success": True,
                "document_analysis": doc_analysis["data"],
                "risk_detection": risk_detection["data"],
                "workflow_status": "completed",
                "steps_completed": ["document_analysis", "risk_detection"],
                "overall_progress": 100
            }
        except Exception as e:
            return {"success": False, "error": str(e), "workflow_status": "failed"}

    def run_compliance_only(self, document_content: str) -> Dict[str, Any]:
        """Run compliance check workflow only"""
        try:
            compliance_check = self.compliance_checker.check_compliance(document_content)
            
            return {
                "success": True,
                "compliance_check": compliance_check["data"],
                "workflow_status": "completed",
                "steps_completed": ["compliance_check"],
                "overall_progress": 100
            }
        except Exception as e:
            return {"success": False, "error": str(e), "workflow_status": "failed"}


# Global workflow instance
workflow: Optional[AgentWorkflow] = None


def get_workflow() -> AgentWorkflow:
    """Get or create workflow instance"""
    global workflow
    if workflow is None:
        workflow = AgentWorkflow()
    return workflow
