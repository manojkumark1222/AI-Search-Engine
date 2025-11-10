@echo off
echo ========================================
echo Starting Backend Server
echo ========================================
echo.
cd backend
echo Current directory: %CD%
echo.
echo Starting server on port 8888 (or next available port)...
echo.
python run.py
pause

