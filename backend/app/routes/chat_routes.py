"""Chat and Q&A routes"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas import ChatRequest, ChatResponse
from app.services import DocumentService
from app.rag import get_rag
from app.agents import get_document_analyzer
from app.utils.security import decode_token
from fastapi.security import HTTPBearer, HTTPAuthCredentials
from typing import Optional

router = APIRouter(prefix="/api/chat", tags=["chat"])
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


@router.post("/ask", response_model=ChatResponse)
async def ask_legal_question(
    request: ChatRequest,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Ask legal questions about a document"""
    try:
        # Get document if specified
        if request.document_id:
            doc = DocumentService.get_document(db, str(request.document_id))
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
            
            document_content = doc.content
        else:
            document_content = ""
        
        # Search RAG for relevant information
        rag = get_rag()
        search_results = rag.search(request.query, k=5)
        
        # Prepare context
        rag_context = "\n".join([
            f"Source: {r['metadata'].get('source', 'Document')}\n{r['content']}"
            for r in search_results
        ])
        
        # Use document analyzer to answer
        analyzer = get_document_analyzer()
        
        system_prompt = """You are an expert legal advisor. Answer legal questions based on 
        the provided context and document information. Be precise and cite relevant clauses."""
        
        from langchain_google_genai import ChatGoogleGenerativeAI
        from langchain_core.messages import HumanMessage, SystemMessage
        from app.config import settings
        
        llm = ChatGoogleGenerativeAI(
            model=settings.LLM_MODEL,
            google_api_key=settings.GEMINI_API_KEY,
            temperature=settings.LLM_TEMPERATURE,
        )
        
        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(
                content=f"Question: {request.query}\n\n"
                       f"Document:\n{document_content[:5000]}\n\n"
                       f"Similar documents:\n{rag_context}"
            )
        ]
        
        response = llm.invoke(messages)
        
        # Extract sources
        sources = [r['metadata'].get('source', 'Document') for r in search_results]
        
        return ChatResponse(
            query=request.query,
            response=response.content,
            sources=sources,
            confidence=0.85
        )
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error processing query: {str(e)}"
        )
