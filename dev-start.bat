@echo off
REM Development environment startup script for Legal Assistant

echo Setting up development environment...
echo.

REM Start backend
echo Starting backend development server...
cd backend
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt -q
start "Legal Assistant Backend" python run.py
echo Backend server started in new window
timeout /t 3

REM Start frontend
echo Starting frontend development server...
cd ..\frontend
if not exist node_modules (
    npm install -q
)
start "Legal Assistant Frontend" cmd /k npm run dev
echo Frontend server started in new window

echo.
echo ========================================
echo Development Environment Ready
echo ========================================
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8000
echo API Docs:  http://localhost:8000/docs
echo ========================================
echo.
echo Windows will now show two terminal windows:
echo 1. Backend (Python FastAPI)
echo 2. Frontend (Node.js Next.js)
echo.
echo Close either window to stop that server.
pause
