"""Compliance Checker Agent using LangGraph"""
from typing import Dict, Any, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.config import settings


class ComplianceCheckerAgent:
    """Agent for checking document compliance with regulations"""

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=settings.LLM_TEMPERATURE,
        )
        
        self.regulations = [
            "GDPR",
            "HIPAA",
            "CCPA",
            "SOX",
            "HIPAA",
            "FERPA",
            "PCI-DSS",
        ]

    def check_compliance(self, content: str, regulations: Optional[List[str]] = None) -> Dict[str, Any]:
        """Check document compliance against regulations"""
        try:
            if regulations is None:
                regulations = self.regulations
            
            system_prompt = f"""You are an expert compliance officer and legal advisor.
            Analyze the document for compliance with the following regulations:
            {', '.join(regulations)}
            
            For each regulation, provide:
            1. Compliance Status - compliant, non-compliant, or partial
            2. Violations - specific areas of non-compliance
            3. Recommendations - how to achieve compliance
            4. Evidence - references to specific clauses or gaps
            
            Provide responses in structured JSON format."""

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(
                    content=f"Check this document for regulatory compliance:\n\n{content[:10000]}"
                )
            ]

            response = self.llm.invoke(messages)
            
            result = self._parse_response(response.content)
            
            return {
                "success": True,
                "data": result,
                "regulations_checked": regulations,
                "status": "completed"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "status": "failed",
                "regulations_checked": regulations or []
            }

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """Parse LLM response into structured data"""
        import json
        import re
        
        try:
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                return json.loads(json_match.group())
            
            result = {
                "compliance_status": self._extract_compliance_status(response_text),
                "violations": self._extract_section(response_text, "Violations", as_list=True),
                "recommendations": self._extract_section(response_text, "Recommendations", as_list=True),
                "evidence": self._extract_section(response_text, "Evidence", as_list=True),
            }
            return result
        except Exception as e:
            return {"raw_response": response_text, "error": str(e)}

    @staticmethod
    def _extract_compliance_status(text: str) -> Optional[Dict[str, str]]:
        """Extract compliance status for each regulation"""
        import re
        
        status = {}
        regulations = ["GDPR", "HIPAA", "CCPA", "SOX", "FERPA", "PCI-DSS"]
        
        for reg in regulations:
            pattern = f"{reg}[:\s]*([^,\n]*?)(?=[\n,]|$)"
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                status[reg] = match.group(1).strip()
        
        return status if status else None

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
compliance_checker: Optional[ComplianceCheckerAgent] = None


def get_compliance_checker() -> ComplianceCheckerAgent:
    """Get or create compliance checker instance"""
    global compliance_checker
    if compliance_checker is None:
        compliance_checker = ComplianceCheckerAgent()
    return compliance_checker
