@echo off
title PAM - Backend
color 0A

echo.
echo  ================================
echo   PAM - Backend
echo  ================================
echo.

:: ── Check Python available ──────────────────────────────────────────
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Install Python 3.12+ and add it to PATH.
    echo         https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

cd /d %~dp0backend

:: ── Create venv if missing ───────────────────────────────────────────
if not exist ".venv\Scripts\activate.bat" (
    echo [1/3] Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo [ERROR] Failed to create virtual environment.
        pause
        exit /b 1
    )
    echo       Done.
    echo.
) else (
    echo [1/3] Virtual environment found.
    echo.
)

:: ── Activate ────────────────────────────────────────────────────────
call .venv\Scripts\activate
if errorlevel 1 (
    echo [ERROR] Failed to activate virtual environment.
    echo         If you moved or renamed the project folder, the venv paths
    echo         are broken. Fix it by running:
    echo.
    echo           cd backend
    echo           rmdir /s /q .venv
    echo           python -m venv .venv
    echo           .venv\Scripts\activate
    echo           pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

:: ── Install / update dependencies ───────────────────────────────────
echo [2/3] Installing dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] pip install failed.
    pause
    exit /b 1
)
echo.

:: ── Start server ────────────────────────────────────────────────────
echo [3/3] Starting FastAPI backend...
echo.
echo  Backend : http://localhost:8000
echo  API docs: http://localhost:8000/api/docs
echo  Press Ctrl+C to stop.
echo.
uvicorn app.main:app --reload
