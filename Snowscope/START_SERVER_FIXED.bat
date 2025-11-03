@echo off
REM This uses the full Python path to bypass Windows Store alias

cd /d "%~dp0"

set PYTHON=C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe

echo ============================================================
echo Snowscope Server - Using Python 3.14
echo ============================================================
echo.

echo Installing/Updating Flask...
"%PYTHON%" -m pip install Flask --quiet

echo.
echo Starting Flask server...
echo.
echo Open your browser to: http://localhost:5000
echo Press CTRL+C to stop the server
echo ============================================================
echo.

"%PYTHON%" app.py

pause

