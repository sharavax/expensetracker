# ==============================================================================
# Build React & Package Unified Spring Boot Standalone JAR
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Building SpendWise Unified Production Package" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Build React
Write-Host "[1/3] Building React Frontend with Vite..." -ForegroundColor Yellow
Set-Location (Join-Path $ScriptDir "frontend")
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Frontend build failed!" -ForegroundColor Red
    exit 1
}

# 2. Copy dist to Spring Boot static resources
Write-Host "[2/3] Copying dist to backend resources/static..." -ForegroundColor Yellow
$StaticDir = Join-Path $ScriptDir "backend\src\main\resources\static"
if (Test-Path $StaticDir) {
    Remove-Item -Path $StaticDir -Recurse -Force
}
New-Item -ItemType Directory -Path $StaticDir -Force | Out-Null
Copy-Item -Path (Join-Path $ScriptDir "frontend\dist\*") -Destination $StaticDir -Recurse -Force

# 3. Package JAR with Maven
Write-Host "[3/3] Packaging executable JAR with Maven..." -ForegroundColor Yellow
Set-Location (Join-Path $ScriptDir "backend")
mvn package -DskipTests
if ($LASTEXITCODE -ne 0) {
    Write-Host "Backend packaging failed!" -ForegroundColor Red
    exit 1
}

Write-Host "==========================================================" -ForegroundColor Green
Write-Host " Build Complete! Running Unified Application JAR..." -ForegroundColor Green
Write-Host " Open in browser: http://localhost:8081" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Green

java -jar target\expense-tracker-api-1.0.0.jar
