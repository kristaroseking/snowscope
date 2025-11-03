@echo off
echo Testing Python installations...
echo.

echo Checking Python 3.14 location...
if exist "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" (
    echo [FOUND] Python 3.14
    "C:\Users\Krista\AppData\Local\Programs\Python\Python314\python.exe" --version
) else (
    echo [NOT FOUND] Python 3.14
)

echo.
echo Checking other Python locations...
if exist "%LOCALAPPDATA%\Programs\Python\Python*\python.exe" (
    echo [FOUND] Python in Local Programs
    dir "%LOCALAPPDATA%\Programs\Python\Python*\python.exe" /b
)

if exist "C:\Python*\python.exe" (
    echo [FOUND] Python in C:\
    dir C:\Python*\python.exe /b /s
)

if exist "C:\Program Files\Python*\python.exe" (
    echo [FOUND] Python in Program Files
    dir "C:\Program Files\Python*\python.exe" /b /s
)

echo.
echo Checking for py launcher...
py --version 2>nul
if %errorlevel% equ 0 (
    echo [FOUND] Python launcher (py)
    py --version
)

echo.
pause

