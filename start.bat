@echo off
title TodoApp — Launcher
color 0A

echo.
echo  ================================
echo   TodoApp — Starting services...
echo  ================================
echo.

:: ── Check venv exists ──────────────────────────────────────────────
if not exist "backend\.venv\Scripts\activate.bat" (
    echo [ERROR] Python venv not found.
    echo         Run setup first:
    echo           cd backend
    echo           python -m venv .venv
    echo           .venv\Scripts\activate
    echo           pip install -r requirements.txt
    echo.
    pause
    exit /b 1
)

:: ── Check node_modules exists ──────────────────────────────────────
if not exist "frontend\node_modules" (
    echo [ERROR] node_modules not found.
    echo         Run setup first:
    echo           cd frontend
    echo           npm install
    echo.
    pause
    exit /b 1
)

:: ── Start Backend ──────────────────────────────────────────────────
echo [1/2] Starting FastAPI backend on http://localhost:8000 ...
start "TodoApp — Backend" cmd /k ^
    "cd /d %~dp0backend && ^
    call .venv\Scripts\activate && ^
    echo. && ^
    echo  Backend running at http://localhost:8000 && ^
    echo  API docs at     http://localhost:8000/api/docs && ^
    echo  Press Ctrl+C to stop. && ^
    echo. && ^
    uvicorn app.main:app --reload"

:: ── Wait a moment, then start Frontend ────────────────────────────
timeout /t 3 /nobreak >nul

echo [2/2] Starting Angular frontend on http://localhost:4200 ...
start "TodoApp — Frontend" cmd /k ^
    "cd /d %~dp0frontend && ^
    echo. && ^
    echo  Frontend running at http://localhost:4200 && ^
    echo  Press Ctrl+C to stop. && ^
    echo. && ^
    npm start"

:: ── Open browser after a short delay ──────────────────────────────
echo.
echo  Both services are starting. Opening browser in 8 seconds...
echo  (close this window at any time — the servers keep running)
echo.
timeout /t 8 /nobreak >nul
start "" "http://localhost:4200"

exit
