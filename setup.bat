@echo off
REM Legal Assistant Setup Script for Windows

echo.
echo Legal Assistant Setup
echo =====================
echo.

REM Check Python
echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python not found. Please install Python 3.11+
    exit /b 1
)
for /f "tokens=*" %%i in ('python --version') do set PYTHON_VERSION=%%i
echo + %PYTHON_VERSION%

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js not found. Please install Node.js 18+
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo + Node.js %NODE_VERSION%

REM Backend Setup
echo.
echo Setting up Backend...
cd backend

if not exist ".env" (
    copy .env.example .env
    echo + Created backend .env file
    echo ! Please edit backend\.env with your API keys
)

if not exist "venv" (
    python -m venv venv
    echo + Created virtual environment
)

call venv\Scripts\activate.bat
echo + Activated virtual environment

echo Installing backend dependencies...
pip install --upgrade pip
pip install -r requirements.txt
echo + Backend dependencies installed

python -c "from app.database import init_db; init_db()" 2>nul || echo.
echo + Database initialized

cd ..

REM Frontend Setup
echo.
echo Setting up Frontend...
cd frontend

if not exist ".env.local" (
    (echo NEXT_PUBLIC_API_URL=http://localhost:8000/api) > .env.local
    echo + Created frontend .env.local
)

if not exist "node_modules" (
    npm install
    echo + Frontend dependencies installed
)

cd ..

echo.
echo + Setup Complete!
echo.
echo Quick Start:
echo.
echo Command Prompt 1 - Backend:
echo   cd backend
echo   venv\Scripts\activate.bat
echo   python run.py
echo.
echo Command Prompt 2 - Frontend:
echo   cd frontend
echo   npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
