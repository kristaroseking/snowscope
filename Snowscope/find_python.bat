@echo off
echo Searching for Python installation...
echo.

REM Check common Python locations
if exist "C:\Python*\python.exe" (
    echo Found: C:\Python*\python.exe
    dir C:\Python*\python.exe /s /b
)

if exist "C:\Program Files\Python*\python.exe" (
    echo Found: C:\Program Files\Python*\python.exe
    dir "C:\Program Files\Python*\python.exe" /s /b
)

if exist "%LOCALAPPDATA%\Programs\Python\Python*\python.exe" (
    echo Found: %LOCALAPPDATA%\Programs\Python\Python*\python.exe
    dir "%LOCALAPPDATA%\Programs\Python\Python*\python.exe" /s /b
)

if exist "%APPDATA%\Python\Python*\python.exe" (
    echo Found: %APPDATA%\Python\Python*\python.exe
    dir "%APPDATA%\Python\Python*\python.exe" /s /b
)

echo.
echo Checking if python3 works...
python3 --version 2>nul
if %errorlevel% equ 0 (
    echo python3 is available!
)

echo.
echo Checking registry for Python installations...
reg query "HKCU\Software\Python" /s 2>nul
reg query "HKLM\Software\Python" /s 2>nul

pause

