@echo off
title SpendWise Personal Expense Tracker
echo ==========================================================
echo Starting SpendWise Personal Expense Tracker
echo ==========================================================

echo [1/2] Starting Spring Boot REST API (Port 8081)...
start "SpendWise Backend" cmd /k "cd /d %~dp0backend && java -jar target\expense-tracker-api-1.0.0.jar"

timeout /t 5 >nul

echo [2/2] Starting React Frontend (Port 5173)...
start "SpendWise Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo ==========================================================
echo Applications launched successfully!
echo - React Frontend UI:       http://localhost:5173
echo - Spring Boot Unified App: http://localhost:8081
echo - Swagger API Docs:        http://localhost:8081/swagger-ui.html
echo - H2 Database Console:     http://localhost:8081/h2-console
echo ==========================================================
pause
