@echo off
echo ========================================
echo Data Visualizer & Analyzer Tool
echo ========================================
echo.
echo Starting Backend and Frontend servers...
echo.

cd /d "%~dp0.."
start "Backend Server" cmd /k "cd /d %CD%\backend && python run.py"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd /d %CD%\frontend && npm run dev"

echo.
echo Servers are starting in separate windows...
echo Backend: http://127.0.0.1:8888
echo Frontend: http://localhost:5173 (or check the terminal)
echo.
echo Keep both windows open while using the application!
echo.
echo Press any key to exit this window (servers will keep running)...
pause >nul

