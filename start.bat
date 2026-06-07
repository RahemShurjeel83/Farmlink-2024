@echo off
echo Starting FarmLink...

start "FarmLink Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"
timeout /t 4 /nobreak >nul

start "FarmLink Frontend" cmd /k "cd /d "%~dp0frontend" && npm start"
start "FarmLink Admin" cmd /k "cd /d "%~dp0admin" && npm start"

echo.
echo All three servers are starting:
echo   Backend  -^> http://localhost:1783
echo   Frontend -^> http://localhost:6464
echo   Admin    -^> http://localhost:6462
echo.
echo Wait about 20 seconds then open http://localhost:6464 in your browser.
echo Admin panel: http://localhost:6462
pause
