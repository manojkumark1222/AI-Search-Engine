@echo off
title Stop All Servers
color 0C
echo ========================================
echo   Stopping All Running Servers
echo ========================================
echo.

echo Stopping Node.js processes on ports 5173 and 5175...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5173') do (
    echo Stopping process %%a on port 5173...
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -aon ^| findstr :5175') do (
    echo Stopping process %%a on port 5175...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo Stopping Python processes on port 8888...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8888') do (
    echo Stopping process %%a on port 8888...
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo   All servers stopped!
echo ========================================
echo.
pause

