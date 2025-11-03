@echo off
echo ============================================================
echo Starting Snowscope Server
echo ============================================================
echo.

cd /d "%~dp0"

set PYTHON=C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe

echo Checking imports...
"%PYTHON%" -c "import app" 2>error.txt
if %errorlevel% neq 0 (
    echo ERROR: Cannot import app.py
    echo.
    type error.txt
    echo.
    pause
    exit /b 1
)

echo OK: All imports successful!
echo.
echo Starting Flask server...
echo.
echo ============================================================
echo Open your browser to: http://localhost:5000
echo ============================================================
echo.
echo Press CTRL+C to stop the server
echo.

"%PYTHON%" app.py

pause

