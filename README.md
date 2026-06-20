# Multi-Agent Legal Assistant Platform

A production-ready AI-powered legal document analysis platform using LangGraph, FastAPI, React, PostgreSQL, ChromaDB, and Gemini API.

## 🚀 Features

### AI Agents
- **Document Analyzer**: Extract clauses, obligations, deadlines, and payment terms
- **Case Researcher**: Search legal knowledge base for relevant precedents
- **Risk Detector**: Identify high-risk clauses and calculate risk scores
- **Compliance Checker**: Verify GDPR, HIPAA, CCPA, and other regulations

### Capabilities
- Document upload (PDF, DOCX, TXT)
- Multi-agent workflow orchestration with LangGraph
- Semantic search with RAG using ChromaDB
- Risk scoring and categorization
- Compliance analysis and recommendations
- Legal Q&A chat interface
- Detailed report generation
- Export to PDF

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React/Next.js Frontend          │
│    (Dashboard, Document Viewer, Chat)   │
└────────────────┬────────────────────────┘
                 │ HTTP/REST API
┌────────────────▼────────────────────────┐
│         FastAPI Backend                 │
│  ┌──────────────────────────────────┐   │
│  │    LangGraph Workflow Agents     │   │
│  │  - Document Analyzer             │   │
│  │  - Case Researcher               │   │
│  │  - Risk Detector                 │   │
│  │  - Compliance Checker            │   │
│  └──────────────────────────────────┘   │
├────────────────────────────────────────┤
│  Services, Routes, Database Models     │
└──────┬────────────┬───────────┬────────┘
       │            │           │
   ┌───▼───┐    ┌───▼───┐   ┌──▼───┐
   │  RAG  │    │   DB  │   │Redis │
   │ChromaDB   │  PG   │   │Cache │
   └───────┘    └───────┘   └──────┘
```

## 📋 Tech Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **UI**: React + TailwindCSS + Shadcn UI
- **State Management**: Zustand
- **HTTP**: Axios
- **Visualization**: Recharts

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: PostgreSQL
- **Cache**: Redis
- **Auth**: JWT

### AI & ML
- **Orchestration**: LangGraph
- **LLM**: Google Gemini 2.0
- **RAG**: LangChain + ChromaDB
- **Embeddings**: Sentence Transformers
- **Document Processing**: PyMuPDF, python-docx
- **NLP**: spaCy

### DevOps
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pip (Python), npm (Node.js)
- **Web Server**: Uvicorn (Python), Vercel (Frontend)

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL 16
- Redis 7
- Gemini API Key

### Local Development

1. **Clone the repository**
```bash
cd P1
```

2. **Backend Setup**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your API keys

# Initialize database
python -c "from app.database import init_db; init_db()"

# Run backend
python run.py
```

Backend runs on: `http://localhost:8000`

3. **Frontend Setup**
```bash
cd frontend

# Install dependencies
npm install

# Set environment variables
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Run frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

### Docker Deployment

```bash
# Create .env file with API keys
cp .env.example .env
nano .env  # Add your Gemini API key

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Access application on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/verify` - Verify token

### Documents
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/` - List user documents
- `GET /api/documents/{id}` - Get document details
- `DELETE /api/documents/{id}` - Delete document
- `GET /api/documents/{id}/analysis` - Get analysis

### Analysis
- `POST /api/analysis/analyze/{id}` - Run analysis
- `GET /api/analysis/status/{id}` - Get analysis status

### Chat
- `POST /api/chat/ask` - Ask legal questions

### Reports
- `POST /api/reports/generate/{id}` - Generate report
- `GET /api/reports/download/{id}` - Download PDF

## 🔐 Environment Variables

**Backend (.env)**
```
DATABASE_URL=postgresql://user:password@localhost:5432/legal_assistant
REDIS_URL=redis://localhost:6379
SECRET_KEY=your-secret-key
GEMINI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=optional
LLM_MODEL=gemini-2.0-flash
DEBUG=False
```

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## 📊 Database Schema

### Core Tables
- `users` - User accounts
- `documents` - Uploaded legal documents
- `document_analyses` - Analysis results
- `cases` - Case law database
- `compliance_checks` - Compliance verification results
- `analysis_results` - Agent execution results

## 🤖 AI Workflow

1. **User uploads document** → Stored in PostgreSQL + indexed in ChromaDB
2. **Document Analyzer** → Extracts structure and key information
3. **Case Researcher** → Searches legal knowledge base via RAG
4. **Risk Detector** → Analyzes risks using LLM
5. **Compliance Checker** → Verifies regulatory compliance
6. **Results aggregated** → Stored and displayed to user

## 📈 Performance Optimizations

- Redis caching for frequent queries
- Chunked document processing
- Async/await for concurrent agent execution
- Vector search for fast semantic retrieval
- Connection pooling for database
- GZIP compression for API responses

## 🔍 Testing

```bash
cd backend
pytest tests/ -v
```

## 📖 Documentation

- API Documentation: `http://localhost:8000/docs` (Swagger UI)
- ReDoc: `http://localhost:8000/redoc`

## 🚀 Production Deployment

### AWS Deployment
```bash
# ECR - Container Registry
aws ecr create-repository --repository-name legal-assistant-api

# RDS - PostgreSQL
# ElastiCache - Redis
# ECS/Fargate - Container orchestration
# ALB - Load balancing
```

### Vercel Deployment (Frontend)
```bash
# Deploy Next.js frontend
vercel deploy
```

## 🔐 Security Features

- JWT authentication
- Password hashing with bcrypt
- HTTPS/TLS encryption
- CORS configuration
- Input validation
- SQL injection prevention
- XSS protection

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support

For issues and questions:
- GitHub Issues
- Email: support@legalassistant.com
- Documentation: https://docs.legalassistant.com

---

**Built with ❤️ for legal professionals**
