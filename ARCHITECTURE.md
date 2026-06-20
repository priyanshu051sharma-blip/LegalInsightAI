# Architecture Overview

## System Components

### 1. Frontend Layer (React/Next.js)
**Location**: `/frontend`

**Responsibilities**:
- User authentication and session management
- Document upload interface
- Analysis results visualization
- Risk dashboard and compliance reports
- Legal Q&A chat interface

**Key Pages**:
- `/login` - User authentication
- `/register` - Account creation
- `/dashboard` - Overview and statistics
- `/documents` - Document management
- `/documents/[id]` - Document details and analysis

**State Management**:
- Zustand stores for auth and documents
- Local component state for UI
- API integration via axios

### 2. Backend API Layer (FastAPI)
**Location**: `/backend/app`

**Responsibilities**:
- RESTful API endpoints
- User authentication and authorization
- Document processing and storage
- Orchestrating AI agents
- Database operations

**Route Modules**:
- `/routes/auth_routes.py` - Authentication endpoints
- `/routes/document_routes.py` - Document CRUD operations
- `/routes/analysis_routes.py` - Document analysis workflows
- `/routes/chat_routes.py` - Q&A interface
- `/routes/report_routes.py` - Report generation

### 3. AI Agent Layer (LangGraph)
**Location**: `/backend/app/agents`

**Agent Responsibilities**:

#### Document Analyzer
- Extracts document structure
- Identifies key clauses and terms
- Extracts obligations and deadlines
- Generates executive summary
- Detects legal entities and dates

#### Case Researcher
- Searches RAG knowledge base
- Identifies relevant precedents
- Retrieves legal citations
- Analyzes similar cases
- Provides legal arguments

#### Risk Detector
- Scores document risk (0-100)
- Categorizes risks (High/Medium/Low)
- Identifies missing protections
- Detects dangerous clauses
- Provides remediation suggestions

#### Compliance Checker
- Verifies GDPR compliance
- Checks HIPAA requirements
- Validates CCPA compliance
- Identifies regulatory violations
- Provides compliance recommendations

### 4. RAG System (LangChain + ChromaDB)
**Location**: `/backend/app/rag`

**Features**:
- Document embedding and indexing
- Semantic search for legal documents
- Vector similarity retrieval
- Metadata filtering
- Knowledge base management

**Workflow**:
1. Document chunks are created
2. Sentences transformed to embeddings
3. Stored in ChromaDB with metadata
4. Queried using semantic similarity

### 5. Data Layer (PostgreSQL)
**Location**: `/backend/app/models`

**Tables**:
- `users` - User accounts and profiles
- `documents` - Uploaded legal documents
- `document_analyses` - Analysis results
- `cases` - Legal case database
- `compliance_checks` - Compliance records
- `analysis_results` - Agent execution logs

### 6. Services Layer
**Location**: `/backend/app/services`

**Services**:
- `UserService` - User management
- `DocumentService` - Document operations
- `AuthService` - Authentication logic

## Data Flow

### Document Upload & Analysis

```
1. User uploads document
   ├─ Validate file (type, size)
   ├─ Save to filesystem
   ├─ Create DB record
   └─ Index in RAG
   
2. Frontend requests analysis
   ├─ Backend receives request
   ├─ Update document status → "processing"
   └─ Invoke workflow
   
3. Workflow orchestration
   ├─ Document Analyzer Agent
   │  ├─ Parse document content
   │  └─ Extract metadata
   ├─ Case Researcher Agent
   │  ├─ Search RAG database
   │  └─ Retrieve precedents
   ├─ Risk Detector Agent
   │  ├─ Analyze risks
   │  └─ Calculate score
   └─ Compliance Checker Agent
      ├─ Check regulations
      └─ Identify violations
      
4. Results aggregation
   ├─ Save to database
   ├─ Update document status → "analyzed"
   └─ Return to frontend
   
5. User views results
   ├─ Display analysis report
   ├─ Show risk visualization
   ├─ Display compliance status
   └─ Enable Q&A
```

### Chat Query Flow

```
1. User asks question
   ├─ Query: "What are the payment terms?"
   └─ Document context provided
   
2. RAG retrieval
   ├─ Search vector store
   ├─ Retrieve similar chunks
   └─ Score by relevance
   
3. LLM processing
   ├─ Combine query + context
   ├─ Generate answer
   └─ Cite sources
   
4. Response to user
   ├─ Display answer
   ├─ Show source references
   └─ Confidence score
```

## Authentication & Security

### JWT Flow
```
1. User registers/logs in
   ├─ Email + password verified
   └─ Hash password with bcrypt
   
2. Tokens issued
   ├─ Access token (30 min)
   ├─ Refresh token (7 days)
   └─ Store in localStorage
   
3. API requests
   ├─ Include JWT in header
   ├─ Backend verifies token
   └─ Extract user_id from claims
   
4. Token refresh
   ├─ Use refresh token
   └─ Issue new access token
```

## Scalability Considerations

### Horizontal Scaling
- Load balance frontend with CDN
- Use Application Load Balancer for API
- Scale ECS tasks for backend
- PostgreSQL read replicas

### Vertical Scaling
- Increase RDS instance size
- Upgrade cache instance
- Scale ECS task resources

### Caching Strategy
- Redis for session tokens
- API response caching
- Document metadata caching
- LLM response caching

### Database Optimization
- Indexing on frequently queried fields
- Connection pooling
- Query optimization
- Partition large tables

## Error Handling

### Frontend Error Handling
- Try-catch blocks in async operations
- User-friendly error messages
- Automatic retry for transient failures
- Error logging to backend

### Backend Error Handling
- HTTP exception responses
- Validation error reporting
- Agent timeout handling
- Database transaction rollback

### Monitoring & Alerting
- CloudWatch logs for application events
- APM for performance tracking
- Alert thresholds for critical failures
- Health check endpoints

## Performance Targets

| Component | Target |
|-----------|--------|
| API Response Time | < 500ms |
| Document Upload | < 5s |
| Analysis Completion | < 60s |
| RAG Search | < 1s |
| Page Load Time | < 2s |

## Future Enhancements

1. **Multi-document Analysis** - Analyze contracts in bulk
2. **Custom Agents** - Allow users to create custom workflows
3. **Integration with Law Firms** - Enterprise APIs
4. **Mobile App** - Native iOS/Android apps
5. **Advanced Analytics** - Detailed usage insights
6. **Collaboration Tools** - Team annotations and reviews
7. **Document Versioning** - Track changes over time
8. **Template Library** - Pre-built document templates

---

For detailed technical documentation, see specific module READMEs.
