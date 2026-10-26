# ==============================================================================
# SpendWise Expense Tracker - Start All Services (PowerShell)
# Starts Spring Boot Backend (Port 8081) and React Frontend (Port 5173)
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting SpendWise Personal Expense Tracker" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Start Spring Boot Backend in background
Write-Host "[1/2] Launching Spring Boot REST API on port 8081..." -ForegroundColor Yellow
$BackendDir = Join-Path $ScriptDir "backend"
$BackendProcess = Start-Process java -ArgumentList "-jar", "target\expense-tracker-api-1.0.0.jar" -WorkingDirectory $BackendDir -PassThru

# 2. Start React Frontend Dev Server
Write-Host "[2/2] Launching React Frontend Dev Server on port 5173..." -ForegroundColor Yellow
$FrontendDir = Join-Path $ScriptDir "frontend"
Start-Process npm -ArgumentList "run", "dev" -WorkingDirectory $FrontendDir

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Applications are running!" -ForegroundColor Green
Write-Host " - React Frontend UI:       http://localhost:5173" -ForegroundColor Cyan
Write-Host " - Spring Boot Unified App: http://localhost:8081" -ForegroundColor Cyan
Write-Host " - Swagger API Docs:        http://localhost:8081/swagger-ui.html" -ForegroundColor Cyan
Write-Host " - H2 Database Console:     http://localhost:8081/h2-console" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Press Ctrl+C or close windows to stop."
