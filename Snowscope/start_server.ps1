# Snowscope Flask Server Startup Script for PowerShell

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Snowscope Skiing Condition Rating Server" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Set the Python path
$PythonPath = "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe"

# Check if Python exists
if (-not (Test-Path $PythonPath)) {
    Write-Host "ERROR: Python not found at $PythonPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please check where Python is installed and update this script." -ForegroundColor Yellow
    pause
    exit
}

# Change to script directory
Set-Location $PSScriptRoot

Write-Host "Installing/Updating Flask..." -ForegroundColor Yellow
& $PythonPath -m pip install Flask --quiet

Write-Host ""
Write-Host "Starting Flask server..." -ForegroundColor Green
Write-Host ""
Write-Host "Server will be available at:" -ForegroundColor White
Write-Host "  - http://localhost:5000" -ForegroundColor Cyan
Write-Host "  - http://127.0.0.1:5000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press CTRL+C to stop the server" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Start the Flask server
& $PythonPath app.py

