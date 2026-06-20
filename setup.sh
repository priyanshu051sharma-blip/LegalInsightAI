#!/bin/bash

# Legal Assistant Setup Script
set -e

echo "🏛️ Legal Assistant Setup"
echo "======================="
echo ""

# Check Python
echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 not found. Please install Python 3.11+"
    exit 1
fi
PYTHON_VERSION=$(python3 --version)
echo "✅ $PYTHON_VERSION"

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
NODE_VERSION=$(node --version)
echo "✅ Node.js $NODE_VERSION"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo "✅ Docker installed"
else
    echo "⚠️ Docker not found. Skipping Docker setup"
fi

# Create backend environment
echo ""
echo "Setting up Backend..."
cd backend

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created backend .env file"
    echo "⚠️ Please edit backend/.env with your API keys"
fi

if [ ! -d "venv" ]; then
    python3 -m venv venv
    echo "✅ Created virtual environment"
fi

source venv/bin/activate
echo "✅ Activated virtual environment"

# Install dependencies
echo "Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt --quiet
echo "✅ Backend dependencies installed"

# Initialize database
echo "Initializing database..."
python -c "from app.database import init_db; init_db()" 2>/dev/null || true
echo "✅ Database initialized"

cd ..

# Create frontend environment
echo ""
echo "Setting up Frontend..."
cd frontend

if [ ! -f ".env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:8000/api" > .env.local
    echo "✅ Created frontend .env.local"
fi

if [ ! -d "node_modules" ]; then
    npm install --silent
    echo "✅ Frontend dependencies installed"
fi

cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📖 Quick Start:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python run.py"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
echo ""
