@echo off
echo ========================================
echo Data Visualizer & Analyzer Tool
echo Installation and Setup Script
echo ========================================
echo.

echo Step 1: Installing Backend Dependencies...
cd backend
pip install -r requirements.txt
if errorlevel 1 (
    echo Backend installation failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Initializing Database...
python init_db.py
if errorlevel 1 (
    echo Database initialization failed!
    pause
    exit /b 1
)

echo.
echo Step 3: Installing Frontend Dependencies...
cd ..\frontend
npm install
if errorlevel 1 (
    echo Frontend installation failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation Complete!
echo ========================================
echo.
echo To start the application, run:
echo   START_ALL.bat
echo.
echo Or start servers separately:
echo   START_BACKEND.bat  (for backend)
echo   START_FRONTEND.bat (for frontend)
echo.
pause

