@echo off
echo ============================================================
echo Snowscope Skiing Condition Rating Server
echo ============================================================
echo.
echo Using Python from: C:\Users\Krista\AppData\Local\Programs\Python\Python314
echo.

cd /d "%~dp0"

REM Use the full path to Python
"C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" -m pip install Flask --quiet 2>nul

echo Starting server...
echo.
echo Server will be available at:
echo   - http://localhost:5000
echo   - http://127.0.0.1:5000
echo.
echo Press CTRL+C to stop the server
echo ============================================================
echo.

"C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" app.py

pause

