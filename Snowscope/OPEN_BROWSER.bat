@echo off
echo Waiting 3 seconds for server to start...
timeout /t 3 /nobreak >nul

echo Opening browser...
start http://localhost:5000

echo.
echo If the page doesn't load, wait a few more seconds and refresh.
echo.
pause

