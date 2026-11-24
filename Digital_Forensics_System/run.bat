@echo off
title Digital Forensics & Evidence Correlation System
cls

echo ==============================================================================
echo   INTELLIGENT DIGITAL FORENSICS AND EVIDENCE CORRELATION SYSTEM
echo   Using Advanced Data Structures (Academic College Lab Edition)
echo ==============================================================================
echo.

:: 1. Check whether Node.js is available
echo [1/4] Checking Node.js runtime environment...
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org (v18 or higher recommended).
    pause
    exit /b 1
)
node -v
echo [OK] Node.js is available.
echo.

:: 2. Check and install dependencies if necessary
echo [2/4] Verifying dependencies in node_modules...
if not exist node_modules (
    echo [INFO] Installing required dependencies (express, multer, cors, chart.js, cytoscape)...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install dependencies. Check network or permissions.
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies are already installed.
)
echo.

:: 3. Check and initialize database
echo [3/4] Checking SQLite database and seeding 10 forensic crime cases...
if not exist database\evidence.db (
    echo [INFO] Seeding initial database with cases, evidence, and logs...
    node database\seed.js
) else (
    echo [OK] Database exists (database\evidence.db).
)
echo.

:: 4. Launch browser and start backend server
echo [4/4] Starting backend forensics server on port 3000...
echo.
echo ==============================================================================
echo   Application URL:  http://localhost:3000
echo   Demonstration:    http://localhost:3000/index.html
echo   Credentials:      admin / admin123  (Special Agent Sarah Connor)
echo                     analyst / forensics2026 (Examiner Alex Mercer)
echo ==============================================================================
echo.

:: Open default web browser after short delay in background
start "" cmd /c "timeout /t 2 /nobreak >nul & start http://localhost:3000/index.html"

:: Run backend Node.js server
node backend\server.js

pause
