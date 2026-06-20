# Project Structure

```
P1/
│
├── backend/                         # FastAPI Backend
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                 # FastAPI app initialization
│   │   ├── config.py               # Configuration settings
│   │   ├── database.py             # Database connection & setup
│   │   │
│   │   ├── models/                 # SQLAlchemy models
│   │   │   ├── __init__.py
│   │   │   ├── user.py
│   │   │   ├── document.py
│   │   │   ├── case.py
│   │   │   ├── compliance.py
│   │   │   └── analysis_result.py
│   │   │
│   │   ├── schemas/                # Pydantic schemas (API contracts)
│   │   │   └── __init__.py         # All request/response models
│   │   │
│   │   ├── routes/                 # API route handlers
│   │   │   ├── __init__.py
│   │   │   ├── health_routes.py    # Health check endpoints
│   │   │   ├── auth_routes.py      # Authentication endpoints
│   │   │   ├── document_routes.py  # Document CRUD
│   │   │   ├── analysis_routes.py  # Analysis workflows
│   │   │   ├── chat_routes.py      # Q&A interface
│   │   │   └── report_routes.py    # Report generation
│   │   │
│   │   ├── services/               # Business logic
│   │   │   ├── __init__.py
│   │   │   ├── user_service.py     # User operations
│   │   │   └── document_service.py # Document operations
│   │   │
│   │   ├── agents/                 # AI Agents (LangGraph)
│   │   │   ├── __init__.py
│   │   │   ├── document_analyzer.py    # Extract clauses, summaries
│   │   │   ├── case_researcher.py      # Search precedents
│   │   │   ├── risk_detector.py        # Identify risks
│   │   │   ├── compliance_checker.py   # Check regulations
│   │   │   └── workflow.py             # Orchestrate agents
│   │   │
│   │   ├── rag/                    # Retrieval Augmented Generation
│   │   │   ├── __init__.py
│   │   │   ├── legal_rag.py        # ChromaDB integration
│   │   │   └── document_parser.py  # PDF/DOCX parsing
│   │   │
│   │   └── utils/                  # Utility functions
│   │       ├── __init__.py
│   │       ├── security.py         # JWT, password hashing
│   │       ├── file_handler.py     # File operations
│   │       └── text_processing.py  # Text cleaning
│   │
│   ├── tests/                       # Test files
│   ├── run.py                       # Entry point
│   ├── requirements.txt             # Python dependencies
│   ├── .env.example                 # Example env variables
│   └── Dockerfile                   # Backend container
│
├── frontend/                        # Next.js Frontend
│   ├── src/
│   │   ├── pages/                  # Next.js pages
│   │   │   ├── index.tsx           # Home page
│   │   │   ├── login.tsx           # Login page
│   │   │   ├── register.tsx        # Registration
│   │   │   ├── dashboard.tsx       # Dashboard
│   │   │   ├── documents.tsx       # Document management
│   │   │   └── _app.tsx            # App wrapper
│   │   │
│   │   ├── components/             # React components
│   │   │   ├── Header.tsx          # Navigation header
│   │   │   ├── RiskCard.tsx        # Risk visualization
│   │   │   ├── ComplianceCard.tsx  # Compliance display
│   │   │   └── AnalysisReport.tsx  # Full report view
│   │   │
│   │   ├── styles/                 # Global styles
│   │   │   └── globals.css         # Tailwind CSS
│   │   │
│   │   └── utils/                  # Utilities
│   │       ├── api.ts              # API client
│   │       └── store.ts            # Zustand stores
│   │
│   ├── public/                     # Static assets
│   ├── next.config.js              # Next.js config
│   ├── tailwind.config.js          # Tailwind config
│   ├── tsconfig.json               # TypeScript config
│   ├── package.json                # NPM dependencies
│   └── Dockerfile                  # Frontend container
│
├── config/                         # Configuration files
│
├── docs/                           # Documentation
│
├── chroma_db/                      # ChromaDB vector store (created at runtime)
├── uploads/                        # User uploaded documents (created at runtime)
│
├── .gitignore                      # Git ignore rules
├── docker-compose.yml              # Docker compose config
├── Dockerfile.backend              # Backend container
├── Dockerfile.frontend             # Frontend container
│
├── .env.example                    # Example environment variables
│
├── README.md                       # Main documentation
├── QUICKSTART.md                   # Quick start guide
├── ARCHITECTURE.md                 # Technical architecture
├── API.md                          # API documentation
├── DEPLOYMENT.md                   # Deployment guide
│
├── setup.sh                        # Linux/Mac setup script
├── setup.bat                       # Windows setup script
├── dev-start.sh                    # Linux/Mac dev server
└── dev-start.bat                   # Windows dev server
```

## Directory Descriptions

### `/backend`
Complete FastAPI backend with:
- RESTful API endpoints
- Database models and queries
- AI agent implementations
- RAG system for legal knowledge
- Authentication and authorization
- Document processing

### `/frontend`
React/Next.js frontend with:
- User authentication
- Document upload interface
- Analysis visualization
- Risk dashboards
- Compliance reports
- Legal Q&A chat

### Key Files to Understand

**Backend Entry Points**:
- `app/main.py` - FastAPI application setup
- `app/database.py` - Database configuration
- `app/config.py` - Application settings
- `backend/run.py` - Backend startup script

**Frontend Entry Points**:
- `src/pages/index.tsx` - Home page
- `src/pages/_app.tsx` - Root component
- `src/utils/store.ts` - State management
- `src/utils/api.ts` - API client

**Configuration**:
- `.env.example` - All environment variables
- `docker-compose.yml` - Multi-container setup
- `next.config.js` - Frontend build config
- `tailwind.config.js` - Styling configuration

**Documentation**:
- `README.md` - Complete setup and features
- `QUICKSTART.md` - 5-minute setup guide
- `ARCHITECTURE.md` - System design
- `API.md` - API reference
- `DEPLOYMENT.md` - Production deployment

## File Naming Conventions

- **Models** (SQLAlchemy): `singular.py` (e.g., `user.py`, `document.py`)
- **Schemas** (Pydantic): Combined in `schemas/__init__.py`
- **Routes**: `plural_routes.py` (e.g., `auth_routes.py`, `documents_routes.py`)
- **Services**: `singular_service.py` (e.g., `user_service.py`)
- **Agents**: `agent_type.py` (e.g., `document_analyzer.py`, `risk_detector.py`)
- **Pages**: `route_name.tsx` (e.g., `login.tsx`, `dashboard.tsx`)
- **Components**: `PascalCase.tsx` (e.g., `Header.tsx`, `RiskCard.tsx`)

## Code Organization Principles

1. **Separation of Concerns**: Each module has a single responsibility
2. **Layered Architecture**: Routes → Services → Models → Database
3. **Reusability**: Shared utilities in `/utils`
4. **Type Safety**: TypeScript frontend, Pydantic validation backend
5. **Configuration**: Environment variables for all settings
6. **Documentation**: Docstrings for all major functions

---

This structure supports:
- ✅ Easy navigation and maintenance
- ✅ Clear separation of concerns
- ✅ Scalable to large teams
- ✅ CI/CD friendly
- ✅ Docker containerization
- ✅ Testing organization
