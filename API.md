# API Integration Guide

## Authentication

All API requests (except `/auth/login` and `/auth/register`) require JWT token in Authorization header:

```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     http://localhost:8000/api/documents/
```

## Endpoints Reference

### Authentication

#### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "secure_password",
  "full_name": "John Doe",
  "organization": "Law Firm Inc"
}

Response: 200 OK
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "full_name": "John Doe",
  "organization": "Law Firm Inc",
  "is_active": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password"
}

Response: 200 OK
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer"
}
```

### Documents

#### Upload Document
```bash
POST /api/documents/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "file": <file>,
  "title": "NDA Agreement"
}

Response: 200 OK
{
  "id": "uuid",
  "title": "NDA Agreement",
  "file_name": "nda.pdf",
  "file_type": "pdf",
  "file_size": 1024000,
  "status": "uploaded",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Get Documents
```bash
GET /api/documents/
Authorization: Bearer {token}

Response: 200 OK
[
  {
    "id": "uuid",
    "title": "NDA Agreement",
    "file_name": "nda.pdf",
    "file_type": "pdf",
    "status": "uploaded",
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Get Single Document
```bash
GET /api/documents/{document_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "title": "NDA Agreement",
  "file_name": "nda.pdf",
  "file_type": "pdf",
  "status": "uploaded",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Delete Document
```bash
DELETE /api/documents/{document_id}
Authorization: Bearer {token}

Response: 200 OK
{"message": "Document deleted"}
```

### Analysis

#### Analyze Document
```bash
POST /api/analysis/analyze/{document_id}?analysis_type=full
Authorization: Bearer {token}

Query Parameters:
- analysis_type: "full" | "risk" | "compliance"

Response: 200 OK (Streaming)
{
  "document_id": "uuid",
  "status": "completed",
  "steps_completed": [
    "document_analysis",
    "case_research",
    "risk_detection",
    "compliance_check"
  ],
  "overall_progress": 100,
  "analysis_result": {
    "id": "uuid",
    "executive_summary": "...",
    "risk_score": 75.5,
    "high_risk_clauses": [...],
    "compliance_status": {...}
  }
}
```

#### Get Analysis Status
```bash
GET /api/analysis/status/{document_id}
Authorization: Bearer {token}

Response: 200 OK
{
  "document_id": "uuid",
  "status": "processing",
  "analysis_available": false
}
```

#### Get Analysis Results
```bash
GET /api/documents/{document_id}/analysis
Authorization: Bearer {token}

Response: 200 OK
{
  "id": "uuid",
  "document_id": "uuid",
  "executive_summary": "...",
  "key_entities": {...},
  "key_terms": [...],
  "obligations": [...],
  "risk_score": 75.5,
  "high_risk_clauses": [...],
  "compliance_status": {...}
}
```

### Chat

#### Ask Question
```bash
POST /api/chat/ask
Authorization: Bearer {token}
Content-Type: application/json

{
  "query": "What are the payment terms?",
  "document_id": "uuid",
  "conversation_history": [
    {
      "role": "user",
      "content": "What is this contract about?"
    },
    {
      "role": "assistant",
      "content": "This is an NDA..."
    }
  ]
}

Response: 200 OK
{
  "query": "What are the payment terms?",
  "response": "According to Section 3.1...",
  "sources": ["Section 3.1", "Exhibit A"],
  "confidence": 0.95
}
```

### Reports

#### Generate Report
```bash
POST /api/reports/generate/{document_id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "include_citations": true,
  "include_recommendations": true
}

Response: 200 OK
{
  "document_id": "uuid",
  "report_title": "Legal Analysis Report: NDA Agreement",
  "generated_at": "2024-01-01T00:00:00Z",
  "sections": {
    "document_summary": {...},
    "executive_summary": "...",
    "case_references": {...}
  },
  "risk_summary": {
    "risk_score": 75.5,
    "high_risk_count": 3,
    "high_risk_items": [...]
  },
  "compliance_summary": {...},
  "recommendations": [...]
}
```

## Error Responses

```bash
# 400 Bad Request
{
  "detail": "Invalid file type. Allowed: pdf, docx, txt, doc"
}

# 401 Unauthorized
{
  "detail": "Invalid token"
}

# 403 Forbidden
{
  "detail": "Not authorized to access this document"
}

# 404 Not Found
{
  "detail": "Document not found"
}

# 500 Internal Server Error
{
  "detail": "Error during analysis: ..."
}
```

## Code Examples

### JavaScript/TypeScript
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api'
});

// Upload document
const uploadDocument = async (file: File, title: string, token: string) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', title);
  
  const response = await api.post('/documents/upload', formData, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return response.data;
};

// Analyze document
const analyzeDocument = async (docId: string, token: string) => {
  const response = await api.post(`/analysis/analyze/${docId}`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  return response.data;
};

// Ask question
const askQuestion = async (query: string, docId: string, token: string) => {
  const response = await api.post('/chat/ask', 
    { query, document_id: docId },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  
  return response.data;
};
```

### Python
```python
import requests
import json

API_URL = "http://localhost:8000/api"

class LegalAssistantClient:
    def __init__(self, token):
        self.headers = {"Authorization": f"Bearer {token}"}
    
    def upload_document(self, file_path, title):
        with open(file_path, 'rb') as f:
            files = {'file': f}
            data = {'title': title}
            response = requests.post(
                f"{API_URL}/documents/upload",
                files=files,
                data=data,
                headers=self.headers
            )
        return response.json()
    
    def analyze_document(self, doc_id, analysis_type='full'):
        response = requests.post(
            f"{API_URL}/analysis/analyze/{doc_id}",
            params={'analysis_type': analysis_type},
            headers=self.headers
        )
        return response.json()
    
    def ask_question(self, query, doc_id=None):
        response = requests.post(
            f"{API_URL}/chat/ask",
            json={'query': query, 'document_id': doc_id},
            headers=self.headers
        )
        return response.json()

# Usage
client = LegalAssistantClient(token="your_jwt_token")
doc = client.upload_document("nda.pdf", "NDA Agreement")
analysis = client.analyze_document(doc['id'])
answer = client.ask_question("What are payment terms?", doc['id'])
```

## Rate Limiting

Current limits (per authenticated user):
- 100 API requests per minute
- 10 concurrent requests
- 100MB total file upload per day

## WebSocket Support (Coming Soon)

Real-time analysis updates via WebSocket:
```bash
ws://localhost:8000/api/analysis/{document_id}/stream
```

---

For more details, visit the interactive API docs at `http://localhost:8000/docs`
