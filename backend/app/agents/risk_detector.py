"""Risk Detection Agent using LangGraph"""
from typing import Dict, Any, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.config import settings


class RiskDetectorAgent:
    """Agent for detecting legal risks in documents"""

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=settings.LLM_TEMPERATURE,
        )

    def detect_risks(self, content: str, analysis_context: str = "") -> Dict[str, Any]:
        """Detect risks and red flags in document"""
        try:
            system_prompt = """You are an expert risk assessment specialist in legal matters.
            Analyze the document for risks and provide:
            1. Risk Score - 0-100 (0=no risk, 100=critical risk)
            2. High Risk Clauses - dangerous or problematic clauses
            3. Medium Risk Clauses - potentially problematic clauses
            4. Low Risk Clauses - minor concerns
            5. Missing Protections - important clauses that should be added
            
            Common high-risk issues:
            - Unlimited liability clauses
            - Missing termination clauses
            - Data privacy issues
            - One-sided obligations
            - Unreasonable penalties
            - Missing dispute resolution
            
            Provide responses in structured JSON format."""

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(
                    content=f"Analyze this document for legal risks:\n\n{content[:10000]}\n\n"
                            f"Additional context:\n{analysis_context}"
                )
            ]

            response = self.llm.invoke(messages)
            
            result = self._parse_response(response.content)
            
            # Ensure risk_score is present
            if "risk_score" not in result:
                result["risk_score"] = 50.0
            
            return {
                "success": True,
                "data": result,
                "status": "completed"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "status": "failed",
                "data": {"risk_score": 0.0}
            }

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """Parse LLM response into structured data"""
        import json
        import re
        
        try:
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                data = json.loads(json_match.group())
                if "risk_score" not in data:
                    data["risk_score"] = 50.0
                return data
            
            result = {
                "risk_score": self._extract_number(response_text, "Risk Score"),
                "high_risk_clauses": self._extract_section(response_text, "High Risk", as_list=True),
                "medium_risk_clauses": self._extract_section(response_text, "Medium Risk", as_list=True),
                "low_risk_clauses": self._extract_section(response_text, "Low Risk", as_list=True),
                "missing_protections": self._extract_section(response_text, "Missing Protections", as_list=True),
            }
            
            if result["risk_score"] is None:
                result["risk_score"] = 50.0
            
            return result
        except Exception as e:
            return {"raw_response": response_text, "error": str(e), "risk_score": 50.0}

    @staticmethod
    def _extract_number(text: str, label: str) -> Optional[float]:
        """Extract a number from text"""
        import re
        
        pattern = f"{label}[:\s]*([0-9.]+)"
        match = re.search(pattern, text, re.IGNORECASE)
        
        if match:
            try:
                return float(match.group(1))
            except ValueError:
                return None
        return None

    @staticmethod
    def _extract_section(text: str, section_name: str, as_list: bool = False) -> Any:
        """Extract a specific section from response text"""
        import re
        
        pattern = f"{section_name}[:\s]*([^]*?)(?=\n(?:[A-Z]|$))"
        match = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        
        if match:
            content = match.group(1).strip()
            if as_list:
                return [item.strip() for item in content.split('\n') if item.strip()]
            return content
        return None


# Initialize global instance
risk_detector: Optional[RiskDetectorAgent] = None


def get_risk_detector() -> RiskDetectorAgent:
    """Get or create risk detector instance"""
    global risk_detector
    if risk_detector is None:
        risk_detector = RiskDetectorAgent()
    return risk_detector
