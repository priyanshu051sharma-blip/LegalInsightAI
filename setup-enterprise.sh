#!/bin/bash

# =============================================================================
# Legal Assistant - Enterprise Edition Setup Script
# =============================================================================
# This script will set up your complete Legal Assistant platform with all
# enterprise features ready to go.
# =============================================================================

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                   Legal Assistant - Enterprise Setup                      ║"
echo "║                    Professional Edition - Production Ready                ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Download from: https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✓ Docker detected"
echo "✓ Docker Compose detected"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "✓ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit the .env file with your settings:"
    echo ""
    echo "Required variables to set:"
    echo "  1. GEMINI_API_KEY - Get from: https://aistudio.google.com"
    echo "  2. OPENAI_API_KEY - (Optional) Get from: https://platform.openai.com"
    echo "  3. SENDER_EMAIL - Your email for notifications"
    echo "  4. SENDER_PASSWORD - App-specific password"
    echo ""
    echo "Open .env file now? (y/n)"
    read -r response
    if [ "$response" = "y" ]; then
        if command -v nano &> /dev/null; then
            nano .env
        elif command -v vim &> /dev/null; then
            vim .env
        else
            echo "Please edit .env manually with your preferred editor"
        fi
    fi
fi

echo ""
echo "Building Docker images..."
docker-compose build

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✓ Services started successfully"
else
    echo "❌ Failed to start services"
    docker-compose logs
    exit 1
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════════════════╗"
echo "║                    Setup Complete! Ready to Launch                        ║"
echo "╚════════════════════════════════════════════════════════════════════════════╝"
echo ""

echo "🌐 Access Your Application:"
echo "  Frontend:     http://localhost:3000"
echo "  Backend:      http://localhost:8000"
echo "  API Docs:     http://localhost:8000/docs"
echo "  ReDoc:        http://localhost:8000/redoc"
echo "  Database:     PostgreSQL on localhost:5432"
echo "  Cache:        Redis on localhost:6379"
echo ""

echo "📚 Quick Start:"
echo "  1. Open http://localhost:3000 in your browser"
echo "  2. Click 'Get Started' to create an account"
echo "  3. Upload a legal document (PDF, DOCX, or TXT)"
echo "  4. Click 'Start Analysis' and watch real-time progress"
echo "  5. Export professional PDF reports"
echo ""

echo "🎯 Try These Features:"
echo "  ✓ Real-time Analysis with live progress updates"
echo "  ✓ Professional PDF Report Generation"
echo "  ✓ Team Collaboration & Sharing"
echo "  ✓ Admin Dashboard for system management"
echo "  ✓ Analytics Dashboard with charts"
echo "  ✓ Batch Process Multiple Documents"
echo "  ✓ Email Notifications"
echo "  ✓ Audit Logging for compliance"
echo ""

echo "🔧 Useful Commands:"
echo "  docker-compose logs -f backend     # View backend logs"
echo "  docker-compose logs -f frontend    # View frontend logs"
echo "  docker-compose down                # Stop all services"
echo "  docker-compose restart             # Restart services"
echo ""

echo "📖 Documentation:"
echo "  - README.md - Full documentation"
echo "  - QUICKSTART.md - 5-minute setup guide"
echo "  - ENTERPRISE_FEATURES.md - New enterprise features"
echo "  - ENHANCEMENT_SUMMARY.md - What's new"
echo "  - API.md - API endpoint reference"
echo ""

echo "💡 Next Steps:"
echo "  1. Configure email service for notifications"
echo "  2. Set up your organization and team"
echo "  3. Invite team members with roles"
echo "  4. Test batch processing"
echo "  5. Generate and export reports"
echo "  6. Review audit logs"
echo ""

echo "🚀 You're all set! Your Legal Assistant platform is running!"
echo ""
