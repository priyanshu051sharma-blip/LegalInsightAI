"""Document Analyzer Agent using LangGraph"""
from typing import Dict, Any, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.config import settings
from app.rag.document_parser import DocumentParser


class DocumentAnalyzerAgent:
    """Agent for analyzing legal documents"""

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=settings.LLM_TEMPERATURE,
        )

    def analyze(self, content: str) -> Dict[str, Any]:
        """Analyze document and extract key information"""
        try:
            system_prompt = """You are an expert legal document analyzer. 
            Analyze the provided legal document and extract:
            1. Executive Summary - concise overview of the document
            2. Key Entities - parties involved, dates, locations
            3. Key Terms - important clauses and definitions
            4. Obligations - what each party must do
            5. Deadlines - important dates and timelines
            6. Penalties - consequences of breach
            7. Payment Terms - financial conditions
            
            Provide responses in structured JSON format."""

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=f"Please analyze this legal document:\n\n{content[:10000]}")
            ]

            response = self.llm.invoke(messages)
            
            # Parse response
            result = self._parse_response(response.content)
            
            return {
                "success": True,
                "data": result,
                "status": "completed"
            }

        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "status": "failed"
            }

    def _parse_response(self, response_text: str) -> Dict[str, Any]:
        """Parse LLM response into structured data"""
        import json
        import re
        
        try:
            # Try to extract JSON from response
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                return json.loads(json_match.group())
            
            # Fallback: extract key sections
            result = {
                "executive_summary": self._extract_section(response_text, "Executive Summary"),
                "key_entities": self._extract_section(response_text, "Key Entities", as_list=True),
                "key_terms": self._extract_section(response_text, "Key Terms", as_list=True),
                "obligations": self._extract_section(response_text, "Obligations", as_list=True),
                "deadlines": self._extract_section(response_text, "Deadlines", as_list=True),
                "penalties": self._extract_section(response_text, "Penalties", as_list=True),
                "payment_terms": self._extract_section(response_text, "Payment Terms"),
            }
            return result
        except Exception as e:
            return {"raw_response": response_text, "error": str(e)}

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
document_analyzer: Optional[DocumentAnalyzerAgent] = None


def get_document_analyzer() -> DocumentAnalyzerAgent:
    """Get or create document analyzer instance"""
    global document_analyzer
    if document_analyzer is None:
        document_analyzer = DocumentAnalyzerAgent()
    return document_analyzer
