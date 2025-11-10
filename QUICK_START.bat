@echo off
title Quick Start - Data Visualizer
color 0B
echo ========================================
echo   Data Visualizer - Quick Start
echo ========================================
echo.
echo This will start BOTH backend and frontend servers
echo.
echo Press any key to continue, or CTRL+C to cancel...
pause >nul

cd /d "%~dp0"
echo.
echo Starting servers...
echo.

start "Backend Server" cmd /k "cd /d %CD%\backend && python run.py"
timeout /t 4 /nobreak >nul
start "Frontend Server" cmd /k "cd /d %CD%\frontend && npm run dev"

echo.
echo ========================================
echo   Servers are starting!
echo ========================================
echo.
echo Two new windows should have opened:
echo   1. Backend Server (API)
echo   2. Frontend Server (Web App)
echo.
echo Backend URL: http://127.0.0.1:8888
echo Frontend URL: http://localhost:5173
echo.
echo Keep both server windows open!
echo Close this window when done (servers will keep running)
echo.
pause

