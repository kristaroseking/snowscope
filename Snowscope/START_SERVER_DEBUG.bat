@echo off
echo ============================================================
echo Starting Snowscope Server with Debug Info
echo ============================================================
echo.

cd /d "%~dp0"

set PYTHON=C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe

echo Step 1: Checking Python...
"%PYTHON%" --version
if %errorlevel% neq 0 (
    echo ERROR: Python not found!
    pause
    exit /b 1
)

echo.
echo Step 2: Checking Flask...
"%PYTHON%" -c "import flask; print('Flask version:', flask.__version__)"
if %errorlevel% neq 0 (
    echo ERROR: Flask not installed!
    echo Installing Flask...
    "%PYTHON%" -m pip install Flask requests beautifulsoup4 lxml
)

echo.
echo Step 3: Checking app imports...
"%PYTHON%" -c "import app" 2>import_error.txt
if %errorlevel% neq 0 (
    echo ERROR: Cannot import app.py
    echo.
    type import_error.txt
    echo.
    pause
    exit /b 1
)
echo OK!

echo.
echo Step 4: Checking template file...
if not exist "templates\stowe_app.html" (
    echo ERROR: Template file not found!
    pause
    exit /b 1
)
echo OK!

echo.
echo Step 5: Starting Flask server...
echo.
echo ============================================================
echo Server will be available at:
echo   http://localhost:5000
echo   http://127.0.0.1:5000
echo ============================================================
echo.
echo Press CTRL+C to stop the server
echo.

"%PYTHON%" app.py

pause

