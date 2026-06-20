# 🏗️ Enhanced Architecture - Enterprise Edition

## System Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE LAYER                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────┐  ┌──────────────────┐  ┌──────────────────────┐  │
│  │  Landing Page        │  │  Dashboard       │  │  Admin Dashboard     │  │
│  │  Marketing Site      │  │  Documents       │  │  System Monitoring   │  │
│  │  Feature Showcase    │  │  Reports         │  │  User Management     │  │
│  │  Pricing             │  │  Analytics       │  │  Audit Logs          │  │
│  └──────────────────────┘  └──────────────────┘  └──────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────┐         ┌──────────────────────┐              │
│  │  Team Collaboration      │         │  Analytics Dashboard │              │
│  │  - Share Documents       │         │  - KPIs              │              │
│  │  - Real-time Comments    │         │  - Trends            │              │
│  │  - Member Management     │         │  - Risk Distribution │              │
│  └──────────────────────────┘         └──────────────────────┘              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                         ┌──────────────────────┐
                         │  Axios API Client    │
                         │  JWT Authentication  │
                         │  Request Interceptor │
                         └──────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        API GATEWAY LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  FastAPI Application - Port 8000                                    │   │
│  │  - CORS Middleware        - JWT Validation   - Error Handling      │   │
│  │  - Rate Limiting          - Request Logging  - Response Compression│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Authentication Routes          Analysis Routes         Admin Routes       │
│  ├─ POST /login               ├─ POST /analyze       ├─ GET /health      │
│  ├─ POST /register           ├─ GET /status         ├─ GET /audit       │
│  └─ POST /refresh            ├─ GET /results        └─ POST /settings   │
│                                                                              │
│  Document Routes              Real-time Routes       Batch Routes         │
│  ├─ POST /upload             ├─ WS /ws/{user}/{room} ├─ POST /batch    │
│  ├─ GET /list                ├─ WebSocket Events     ├─ GET /batch/{id} │
│  ├─ DELETE /{id}             └─ Real-time Progress   └─ GET /results    │
│  └─ GET /{id}/analysis                                                  │
│                                                                              │
│  Report Routes                Analytics Routes       Advanced Routes      │
│  ├─ POST /report/generate    ├─ GET /overview      ├─ POST /collaborate │
│  ├─ GET /report/{id}         └─ GET /metrics       └─ POST /export      │
│  └─ POST /report/share                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SERVICE LAYER                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Authentication & Security                                           │  │
│  │  ├─ JWT Token Generation & Validation                               │  │
│  │  ├─ Password Hashing (bcrypt)                                       │  │
│  │  ├─ Role-Based Access Control (RBAC)                               │  │
│  │  └─ Permission Checking                                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Document Processing Pipeline                                        │  │
│  │  ├─ File Upload & Storage                                           │  │
│  │  ├─ PDF/DOCX/TXT Parsing                                            │  │
│  │  ├─ Text Extraction & Chunking                                      │  │
│  │  ├─ spaCy NLP Entity Extraction                                     │  │
│  │  └─ Indexing to ChromaDB Vector Store                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  AI Analysis Engine                                                  │  │
│  │  ├─ Document Analyzer Agent    (Extract clauses)                    │  │
│  │  ├─ Risk Detector Agent        (Calculate risk score)               │  │
│  │  ├─ Compliance Checker Agent   (Verify regulations)                 │  │
│  │  ├─ Case Researcher Agent      (Find precedents via RAG)            │  │
│  │  └─ Workflow Orchestrator      (Coordinate agents)                  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  RAG (Retrieval Augmented Generation)                               │  │
│  │  ├─ ChromaDB Vector Store                                           │  │
│  │  ├─ Sentence Transformers Embeddings                               │  │
│  │  ├─ Semantic Search                                                 │  │
│  │  └─ Document Retrieval & Ranking                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Report Generation                                                   │  │
│  │  ├─ ReportLab PDF Creation                                          │  │
│  │  ├─ Professional Styling & Formatting                               │  │
│  │  ├─ Chart Generation (Recharts data)                                │  │
│  │  └─ Template Rendering                                              │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Email Service                                                       │  │
│  │  ├─ Email Template Rendering                                        │  │
│  │  ├─ SMTP Async Sending                                              │  │
│  │  ├─ Analysis Complete Notifications                                 │  │
│  │  ├─ Team Invitations                                                │  │
│  │  └─ Password Reset Emails                                           │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Batch Processing                                                    │  │
│  │  ├─ Concurrent Document Processing (Semaphore)                      │  │
│  │  ├─ Progress Tracking                                               │  │
│  │  ├─ Result Aggregation                                              │  │
│  │  └─ Partial Failure Handling                                        │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  WebSocket Manager                                                   │  │
│  │  ├─ Connection Management                                           │  │
│  │  ├─ Room-based Broadcasting                                         │  │
│  │  ├─ Real-time Progress Updates                                      │  │
│  │  ├─ Event Handler System                                            │  │
│  │  └─ Presence Tracking                                               │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Audit Logging                                                       │  │
│  │  ├─ User Action Tracking                                            │  │
│  │  ├─ Document Operations Logging                                     │  │
│  │  ├─ Analysis Lifecycle Logging                                      │  │
│  │  └─ Security Event Logging                                          │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────┐      ┌──────────────────────┐                │
│  │  PostgreSQL Database     │      │  Redis Cache         │                │
│  │  (Port 5432)             │      │  (Port 6379)         │                │
│  ├──────────────────────────┤      ├──────────────────────┤                │
│  │ Tables:                  │      │ Cache:               │                │
│  │ ├─ users                 │      │ ├─ Session tokens    │                │
│  │ ├─ documents             │      │ ├─ User data         │                │
│  │ ├─ document_analyses     │      │ ├─ Analysis results  │                │
│  │ ├─ cases                 │      │ ├─ Batch status      │                │
│  │ ├─ compliance_checks     │      │ └─ Rate limits       │                │
│  │ ├─ analysis_results      │      └──────────────────────┘                │
│  │ └─ audit_logs            │                                              │
│  └──────────────────────────┘                                              │
│                                                                              │
│  ┌──────────────────────────┐      ┌──────────────────────┐                │
│  │  ChromaDB Vector Store   │      │  File Storage        │                │
│  │  (./chroma_db)           │      │  (./uploads)         │                │
│  ├──────────────────────────┤      ├──────────────────────┤                │
│  │ Collections:             │      │ Stored:              │                │
│  │ ├─ legal_documents       │      │ ├─ Uploaded PDFs     │                │
│  │ ├─ case_law              │      │ ├─ DOCX files        │                │
│  │ ├─ compliance_guides     │      │ ├─ Generated reports │                │
│  │ └─ embeddings            │      │ └─ Analysis data     │                │
│  └──────────────────────────┘      └──────────────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EXTERNAL SERVICES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────┐      ┌──────────────────────┐                     │
│  │  Google Gemini API   │      │  SMTP Email Service  │                     │
│  │  (LLM Analysis)      │      │  (Notifications)     │                     │
│  └──────────────────────┘      └──────────────────────┘                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────┐               │
│  │  Monitoring & Analytics                                 │               │
│  │  ├─ Sentry (Error Tracking)                             │               │
│  │  ├─ CloudWatch (AWS Logs)                               │               │
│  │  └─ Custom Metrics                                      │               │
│  └──────────────────────────────────────────────────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### 1. Document Analysis Flow

```
┌─────────┐
│ Upload  │
│ Document│
└────┬────┘
     │
     ↓
┌──────────────────────────────────────────────────┐
│  Parse Document (PDF/DOCX/TXT)                   │
│  ├─ Extract text content                         │
│  ├─ Extract metadata (title, author, etc.)       │
│  └─ Split into chunks                           │
└────┬─────────────────────────────────────────────┘
     │
     ↓
┌──────────────────────────────────────────────────┐
│  NLP Processing (spaCy)                          │
│  ├─ Entity extraction (persons, orgs, dates)     │
│  ├─ Token identification                        │
│  └─ Relationship extraction                     │
└────┬─────────────────────────────────────────────┘
     │
     ↓
┌──────────────────────────────────────────────────┐
│  Generate Embeddings                             │
│  ├─ Chunk embedding                             │
│  ├─ Store in ChromaDB                           │
│  └─ Create searchable index                     │
└────┬─────────────────────────────────────────────┘
     │
     ├──────────────────────────────────────────────────────┐
     │                                                      │
     ↓                                                      ↓
┌──────────────────────┐                    ┌──────────────────────┐
│  Document Analyzer   │                    │  Risk Detector       │
│  Agent               │                    │  Agent               │
│                      │                    │                      │
│ Extracts:            │                    │ Calculates:          │
│ - Summary            │                    │ - Risk Score (0-100) │
│ - Key Terms          │                    │ - Risk Categories    │
│ - Obligations        │                    │ - Dangerous Clauses  │
│ - Deadlines          │                    │ - Recommendations    │
│ - Payment Terms      │                    │                      │
└──────┬───────────────┘                    └──────┬───────────────┘
       │                                           │
       └─────────────────┬───────────────────────────┘
                         │
     ┌───────────────────┼───────────────────┐
     │                   │                   │
     ↓                   ↓                   ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  Compliance  │ │Case Researcher│ │  Aggregate  │
│  Checker     │ │  Agent        │ │  Results    │
│  Agent       │ │               │ │             │
│              │ │ Searches:     │ │ Combines:   │
│ Checks:      │ │ - Similar     │ │ - All data  │
│ - GDPR       │ │   cases       │ │ - Create    │
│ - HIPAA      │ │ - Precedents  │ │   report    │
│ - CCPA       │ │ - Citations   │ │ - Save to DB│
│ - SOX        │ │               │ │             │
└──────┬───────┘ └──────┬────────┘ └──────┬──────┘
       │                │                 │
       └────────────────┴─────────────────┘
                        │
                        ↓
                ┌────────────────┐
                │  Store Results │
                │  in Database   │
                └────────┬───────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
         ↓               ↓               ↓
    ┌─────────┐    ┌──────────┐   ┌────────┐
    │ Notify   │    │ Generate │   │ Send   │
    │ User     │    │ Report   │   │ Email  │
    └─────────┘    └──────────┘   └────────┘
```

### 2. Real-time WebSocket Flow

```
┌──────────┐
│  Browser │
└────┬─────┘
     │
     ↓
┌────────────────────────────────┐
│ Connect to WebSocket           │
│ ws://host/api/v1/ws/{uid}/{rm} │
└────┬───────────────────────────┘
     │
     ↓
┌────────────────────────────────────────────────────┐
│  WebSocket Manager                                 │
│  ├─ Register connection                           │
│  ├─ Add user to room                              │
│  └─ Broadcast: "User joined" event                │
└────┬───────────────────────────────────────────────┘
     │
     │ (Keep connection open)
     │
     ├─────────────┬──────────────┬────────────────┐
     │             │              │                │
     ↓             ↓              ↓                ↓
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Analysis │ │Comment   │ │Presence  │ │Notification
│Progress  │ │Message   │ │Update    │ │Broadcast
│Update    │ │Broadcast │ │(User     │ │(Email    
│          │ │(Real-time│ │joined/   │ │complete)
│stage: 60%│ │collab)   │ │left)     │ │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
     │             │              │                │
     └─────────────┴──────────────┴────────────────┘
                   │
                   ↓ (Browser receives)
              ┌─────────────┐
              │ Update UI   │
              │ - Progress  │
              │ - Comments  │
              │ - Status    │
              │ - Alerts    │
              └─────────────┘
```

### 3. Email Notification Flow

```
┌─────────────────────┐
│ Analysis Complete   │
│ Event Triggered     │
└────┬────────────────┘
     │
     ↓
┌────────────────────────────────────────┐
│ Email Service Routes to Task Queue     │
└────┬───────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────┐
│ Select Email Template                   │
│ (AnalysisCompleteEmail)                 │
└────┬────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────┐
│ Render Template                         │
│ - Populate user name                    │
│ - Insert analysis results               │
│ - Add dashboard link                    │
│ - Create HTML version                   │
└────┬────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────┐
│ Create MIME Message                     │
│ - Set subject, from, to                 │
│ - Attach HTML and text versions         │
└────┬────────────────────────────────────┘
     │
     ↓ (Async execution)
┌─────────────────────────────────────────┐
│ Connect to SMTP Server                  │
│ - smtp.gmail.com:587                    │
│ - Start TLS                             │
│ - Authenticate                          │
└────┬────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────┐
│ Send Email                              │
│ - Verify delivery                       │
│ - Handle errors gracefully              │
└────┬────────────────────────────────────┘
     │
     ↓
┌─────────────────────────────────────────┐
│ User Receives Email                     │
│ Clicks link → Opens dashboard           │
└─────────────────────────────────────────┘
```

---

## Component Integration Map

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           FRONTEND LAYER                                   │
│                                                                            │
│  Landing Page ←→ Login/Register ←→ Dashboard ←→ Analytics              │
│        ↓                  ↓               ↓           ↓                   │
│        └──────────────────┴───────────────┴───────────┘                   │
│                           ↓                                                │
│                   ┌─────────────────┐                                     │
│                   │  Store (Zustand)│                                     │
│                   │  - Auth state   │                                     │
│                   │  - Documents    │                                     │
│                   │  - User data    │                                     │
│                   └────────┬────────┘                                     │
│                            │                                               │
└────────────────────────────┼───────────────────────────────────────────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │  API Client      │
                    │  (Axios + JWT)   │
                    └────────┬─────────┘
                             │
┌────────────────────────────┼───────────────────────────────────────────────┐
│                            ↓                                               │
│                     FASTAPI BACKEND                                        │
│                                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Routes Layer                                                       │  │
│  │  (25+ endpoints handling HTTP requests)                             │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                             │                                              │
│                             ↓                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Middleware Stack                                                   │  │
│  │  ├─ Authentication (JWT)                                            │  │
│  │  ├─ Authorization (RBAC)                                            │  │
│  │  ├─ Rate Limiting (slowapi)                                         │  │
│  │  ├─ Error Handling                                                  │  │
│  │  └─ Logging                                                         │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                             │                                              │
│                             ↓                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Service Layer                                                      │  │
│  ├─ User Service           ├─ Batch Processor                          │  │
│  ├─ Document Service       ├─ Email Service                           │  │
│  ├─ Report Generator       ├─ WebSocket Manager                       │  │
│  ├─ Audit Logger           └─ AI Agent Orchestrator                   │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                             │                                              │
│                             ↓                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Data Layer                                                         │  │
│  ├─ SQLAlchemy ORM         ├─ ChromaDB Client                         │  │
│  ├─ Database Connection    ├─ File Storage Manager                    │  │
│  └─ Cache (Redis)          └─ Session Management                      │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└────────────────────────────┬───────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │                 │
                    ↓                 ↓
            ┌─────────────┐    ┌──────────────┐
            │ PostgreSQL  │    │ Redis Cache  │
            │ Database    │    │              │
            └─────────────┘    └──────────────┘
                    │                 │
                    └────────┬────────┘
                             │
                             ↓
                    ┌──────────────────┐
                    │ ChromaDB Vector  │
                    │ Store            │
                    └──────────────────┘
```

---

## Data Model Relationships

```
┌──────────────┐
│    Users     │ ← SUPER_ADMIN, ADMIN, MANAGER,
│              │   LAWYER, PARALEGAL, VIEWER
├──────────────┤
│ id (PK)      │
│ email        │
│ username     │
│ password_hash│
│ role         │
│ organization │
│ is_active    │
│ created_at   │
└──────┬───────┘
       │ 1
       │
       │ has many
       │
       ↓ N
┌────────────────────────┐
│     Documents          │
├────────────────────────┤
│ id (PK)                │
│ user_id (FK)           │
│ title                  │
│ file_path              │
│ content                │
│ status                 │
│ created_at             │
│ updated_at             │
└────────┬───────────────┘
         │ 1
         │
         │ has one
         │
         ↓ N
    ┌─────────────────────────┐
    │ DocumentAnalysis        │
    ├─────────────────────────┤
    │ id (PK)                 │
    │ document_id (FK)        │
    │ summary                 │
    │ risk_score              │
    │ risk_level              │
    │ high_risk_clauses       │
    │ medium_risk_clauses     │
    │ low_risk_clauses        │
    │ compliance_status       │
    │ violations              │
    │ recommendations         │
    │ analysis_type           │
    │ completed_at            │
    └────────┬────────────────┘
             │
             │ 1
             │
             │ has many
             │
             ↓ N
        ┌──────────────────┐
        │ AnalysisResults  │
        ├──────────────────┤
        │ id (PK)          │
        │ analysis_id (FK) │
        │ agent_name       │
        │ result_data      │
        │ execution_time   │
        │ created_at       │
        └──────────────────┘

┌──────────────┐
│ AuditLogs    │
├──────────────┤
│ id (PK)      │
│ user_id (FK) │
│ action       │
│ resource     │
│ details      │
│ ip_address   │
│ timestamp    │
│ status       │
└──────────────┘
```

---

## Feature Integration Summary

| Feature | Frontend | Backend | Database | External |
|---------|----------|---------|----------|----------|
| **Real-time Updates** | WebSocket client | WebSocket Manager | Redis (sessions) | — |
| **Professional Reports** | Download button | ReportLab service | PostgreSQL (store) | — |
| **Team Collaboration** | Collab page | WebSocket events | PostgreSQL (shares) | Email (invites) |
| **RBAC** | Route guards | Permission checks | PostgreSQL (roles) | — |
| **Batch Processing** | UI status | Batch processor | PostgreSQL (jobs) | — |
| **Email Notifications** | Links in emails | Email service | PostgreSQL (logs) | SMTP server |
| **Analytics** | Dashboard charts | Analytics API | PostgreSQL (metrics) | — |
| **Audit Logging** | Admin view | Audit logger | PostgreSQL (logs) | Sentry (errors) |
| **Admin Dashboard** | Admin UI | Admin routes | PostgreSQL (all) | — |

---

**This architecture enables horizontal scaling, high availability, and enterprise-grade reliability!** 🚀
