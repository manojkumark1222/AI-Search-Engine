@echo off
title Backend Server - Data Visualizer API
color 0A
echo ========================================
echo    Backend Server - Data Visualizer
echo ========================================
echo.
cd /d "%~dp0..\backend"
if not exist "run.py" (
    echo ERROR: run.py not found!
    echo Current directory: %CD%
    pause
    exit /b 1
)
echo Starting server...
echo.
python run.py
pause

