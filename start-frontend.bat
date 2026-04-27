@echo off
title PAM - Frontend
color 0A

echo.
echo  ================================
echo   PAM - Frontend
echo  ================================
echo.

:: Check Node / npm available
where npm >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not found. Install Node.js 18+ and add it to PATH.
    echo         https://nodejs.org/
    echo.
    pause
    exit /b 1
)

cd /d %~dp0frontend

:: Install / update dependencies
echo [1/2] Installing dependencies...
call npm install --no-audit --no-fund
echo.

:: Start dev server
echo [2/2] Starting Angular frontend...
echo.
echo  Frontend: http://localhost:4200
echo  Press Ctrl+C to stop.
echo.
call npm start

echo.
echo  [INFO] npm start exited with code %errorlevel%.
pause
