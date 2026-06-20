# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 16 (or use Docker)
- Redis 7 (or use Docker)
- Gemini API Key (get from [Google AI Studio](https://aistudio.google.com))

## Option 1: Docker Setup (Recommended)

### 1. Get API Keys
```bash
# Get Gemini API Key from: https://aistudio.google.com
# Create .env file with your keys:
cp .env.example .env

# Edit .env:
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here  # optional
```

### 2. Start Everything with Docker
```bash
# Make sure Docker Desktop is running
docker-compose up -d

# Wait for services to start (30-60 seconds)
docker-compose logs -f

# Services ready when you see: "Database initialized" and "Frontend ready"
```

### 3. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Database**: PostgreSQL on localhost:5432

### 4. First Steps
1. Click "Register" → Create account
2. Login with your credentials
3. Upload a PDF, DOCX, or TXT legal document
4. Click "Start Analysis" → Wait for results
5. View risk assessment, compliance status, and Q&A

## Option 2: Local Development Setup

### 1. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Linux/Mac)
source venv/bin/activate

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variables
cp .env.example .env
# Edit .env with your Gemini API key

# Start the backend
python run.py
```

Backend runs at: `http://localhost:8000`

### 2. Frontend Setup

In a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local

# Start the frontend
npm run dev
```

Frontend runs at: `http://localhost:3000`

### 3. Database Setup

Make sure PostgreSQL is running on `localhost:5432` with credentials from `.env`

```bash
# The database is automatically initialized when backend starts
# If you need to reinitialize:
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
python -c "from app.database import init_db; init_db()"
```

## 📝 First Document Upload

1. **Register** at http://localhost:3000/register
2. **Login** with your credentials
3. **Upload** a legal document (PDF, DOCX, or TXT)
4. **Wait** for analysis (usually 30-60 seconds)
5. **View** the comprehensive analysis

### Sample Documents to Try
- Employment contracts
- NDAs
- Terms of service
- Privacy policies
- Service agreements
- Licensing agreements

## 🔍 Test the Features

### Risk Analysis
- Upload a contract with problematic clauses
- See risk score and categorization
- Get remediation suggestions

### Compliance Check
- Test with documents containing data collection
- See GDPR/HIPAA compliance status
- Get specific recommendations

### Legal Q&A
- Ask: "What are the termination terms?"
- Ask: "Who is liable for damages?"
- Ask: "What are the payment conditions?"

## 🛠️ Troubleshooting

### Port Already in Use
```bash
# Change port for frontend
# In frontend/.env.local:
NEXT_PUBLIC_API_URL=http://localhost:8001/api

# Run on different port:
npm run dev -- -p 3001
```

### Database Connection Error
```bash
# Check PostgreSQL is running:
psql -U user -d legal_assistant -c "SELECT 1"

# If not installed, use Docker:
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=legal_assistant \
  postgres:16-alpine
```

### Module Not Found
```bash
# Reinstall dependencies
cd backend
pip install --force-reinstall -r requirements.txt

cd frontend
rm -rf node_modules package-lock.json
npm install
```

### API Connection Issues
```bash
# Check backend is running:
curl http://localhost:8000/health

# Check frontend can reach backend:
# Open browser DevTools → Network → check API calls
# Should see requests to http://localhost:8000/api/...
```

## 📚 Next Steps

### Learn More
- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Check [API.md](./API.md) for complete API reference
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production setup

### Customization
1. Modify AI prompts in `/backend/app/agents/`
2. Add custom compliance checks
3. Extend the document parser
4. Create custom report templates

### Integration
- Integrate with your law firm's systems
- Build custom workflows
- Connect to document management systems
- Sync with case management tools

## 🔑 Key Files to Know

```
P1/
├── backend/
│   ├── app/
│   │   ├── agents/          # AI agents
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   └── rag/             # Vector search
│   └── requirements.txt      # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/           # React pages
│   │   ├── components/      # React components
│   │   ├── utils/           # Utilities & API
│   │   └── styles/          # Tailwind CSS
│   └── package.json         # NPM dependencies
├── docker-compose.yml       # Docker setup
├── README.md               # Full documentation
└── ARCHITECTURE.md         # Technical design
```

## 💡 Tips

1. **Speed up Analysis**: Use "risk" or "compliance" mode instead of "full"
2. **Better Results**: Upload clearer PDFs or DOCX files (not scanned images)
3. **Bulk Upload**: Convert multiple documents and upload one by one
4. **Export Reports**: Click "Generate Report" to download PDF
5. **Ask Questions**: Use the Chat feature to clarify contract terms

## 🤝 Support

- Check logs: `docker-compose logs backend`
- Read API docs: http://localhost:8000/docs
- Review database: Connect with pgAdmin
- Check browser console for frontend errors

---

**You're all set! Start analyzing legal documents with AI.** 🏛️
