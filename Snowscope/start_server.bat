@echo off
echo ============================================================
echo Snowscope Skiing Condition Rating Server
echo ============================================================
echo.
cd /d "%~dp0"

REM Use the full path to Python (Python 3.14)
set PYTHON_PATH=C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe

echo Checking Flask installation...
"%PYTHON_PATH%" -m pip install Flask --quiet 2>nul

echo.
echo Starting server...
echo Server will be available at: http://localhost:5000
echo Press CTRL+C to stop the server
echo ============================================================
echo.

"%PYTHON_PATH%" app.py
pause

