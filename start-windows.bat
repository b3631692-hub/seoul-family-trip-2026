@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if %errorlevel%==0 (
  start "首爾旅行手帖伺服器" cmd /k "node server.mjs"
  timeout /t 2 /nobreak >nul
  start "" "http://localhost:4173"
  exit /b 0
)
where python >nul 2>nul
if %errorlevel%==0 (
  start "首爾旅行手帖伺服器" cmd /k "python -m http.server 4173"
  timeout /t 2 /nobreak >nul
  start "" "http://localhost:4173"
  exit /b 0
)
echo 請先安裝 Node.js 或 Python，再執行本檔。
pause
