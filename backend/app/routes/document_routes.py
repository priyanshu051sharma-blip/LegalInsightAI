"""Document routes"""
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List
import os
from app.database import get_db
from app.schemas import DocumentResponse, DocumentCreate, DocumentAnalysisResponse
from app.services import DocumentService
from app.utils import get_file_extension, is_allowed_file, generate_file_path
from app.rag.document_parser import DocumentParser
from app.utils.security import decode_token
from fastapi.security import HTTPBearer
from starlette.requests import Request
import uuid

router = APIRouter(prefix="/api/documents", tags=["documents"])
security = HTTPBearer()


async def get_current_user_id(authorization: str = Depends(security)) -> str:
    """Get current user ID from token"""
    credentials = authorization.credentials if hasattr(authorization, 'credentials') else authorization
    user_id = decode_token(credentials)
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    return user_id


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    title: str = Form(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Upload a legal document"""
    try:
        # Validate file
        if not is_allowed_file(file.filename):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File type not allowed. Allowed: {', '.join(['pdf', 'docx', 'txt', 'doc'])}"
            )
        
        # Save file
        file_ext = get_file_extension(file.filename)
        file_path = generate_file_path(user_id, file.filename)
        
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        file_size = len(contents)
        
        # Parse document
        content = DocumentParser.parse_file(file_path, file_ext)
        if not content:
            os.remove(file_path)
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Could not parse document"
            )
        
        # Create document record
        doc_data = DocumentCreate(
            title=title,
            file_name=file.filename,
            file_type=file_ext
        )
        
        document = DocumentService.create_document(
            db,
            user_id,
            doc_data,
            file_path,
            file_size,
            content
        )
        
        return document
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading document: {str(e)}"
        )


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Get document details"""
    doc = DocumentService.get_document(db, document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found"
        )
    
    if str(doc.user_id) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this document"
        )
    
    return doc


@router.get("/", response_model=List[DocumentResponse])
async def list_documents(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """List all documents for current user"""
    documents = DocumentService.get_user_documents(db, user_id)
    return documents


@router.delete("/{document_id}")
async def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Delete a document"""
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
    
    # Delete file
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)
    
    # Delete from DB
    DocumentService.delete_document(db, document_id)
    
    return {"message": "Document deleted"}


@router.get("/{document_id}/analysis", response_model=DocumentAnalysisResponse)
async def get_analysis(
    document_id: str,
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user_id)
):
    """Get analysis results for a document"""
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
    
    analysis = DocumentService.get_analysis(db, document_id)
    if not analysis:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Analysis not found"
        )
    
    return analysis
