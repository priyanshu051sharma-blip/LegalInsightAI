"""Case Research Agent using LangGraph"""
from typing import Dict, Any, List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from app.config import settings
from app.rag import get_rag


class CaseResearcherAgent:
    """Agent for researching relevant case laws and precedents"""

    def __init__(self):
        self.llm = ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=settings.LLM_TEMPERATURE,
        )
        self.rag = get_rag()

    def research(self, query: str, context: str = "") -> Dict[str, Any]:
        """Research relevant case laws and precedents"""
        try:
            # Search RAG for relevant cases
            search_results = self.rag.search(query, k=5)
            
            system_prompt = """You are an expert legal researcher. 
            Based on the provided context and search results, find and analyze:
            1. Relevant Cases - similar cases and their outcomes
            2. Citations - legal citations and references
            3. Precedents - similar judgments and their application
            4. Legal Arguments - key arguments from precedent cases
            
            Provide responses in structured JSON format."""

            rag_context = "\n".join([
                f"Source: {r['metadata'].get('source', 'Unknown')}\n{r['content']}"
                for r in search_results
            ])

            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(
                    content=f"Research legal cases related to:\n{query}\n\n"
                            f"Context:\n{context}\n\n"
                            f"RAG Results:\n{rag_context}"
                )
            ]

            response = self.llm.invoke(messages)
            
            result = self._parse_response(response.content)
            
            return {
                "success": True,
                "data": result,
                "rag_sources": search_results,
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
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                return json.loads(json_match.group())
            
            result = {
                "relevant_cases": self._extract_section(response_text, "Relevant Cases", as_list=True),
                "citations": self._extract_section(response_text, "Citations", as_list=True),
                "precedents": self._extract_section(response_text, "Precedents", as_list=True),
                "legal_arguments": self._extract_section(response_text, "Legal Arguments", as_list=True),
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
case_researcher: Optional[CaseResearcherAgent] = None


def get_case_researcher() -> CaseResearcherAgent:
    """Get or create case researcher instance"""
    global case_researcher
    if case_researcher is None:
        case_researcher = CaseResearcherAgent()
    return case_researcher
