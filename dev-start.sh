#!/bin/bash

# Development environment setup for Legal Assistant
# This script sets up hot-reload development environment

set -e

echo "Setting up development environment..."

# Backend development server
echo "Starting backend development server..."
cd backend
source venv/bin/activate 2>/dev/null || python -m venv venv && source venv/bin/activate
pip install -r requirements.txt -q
export PYTHONUNBUFFERED=1
python run.py &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID)"
sleep 3

# Frontend development server
echo "Starting frontend development server..."
cd ../frontend
npm install -q 2>/dev/null || true
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "========================================"
echo "Development Environment Running"
echo "========================================"
echo "Frontend:  http://localhost:3000"
echo "Backend:   http://localhost:8000"
echo "API Docs:  http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop servers"
echo "========================================"
echo ""

# Handle cleanup
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT

# Wait for processes
wait
