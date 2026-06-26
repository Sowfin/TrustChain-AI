@echo off
cd /d "%~dp0"
set NO_BROWSER=1
echo Starting trustchainAI at http://127.0.0.1:5500/
echo Keep this window open while using the website.
node server.js
if errorlevel 1 (
  echo.
  echo The website could not start. Make sure Node.js is installed, then try again.
  pause
)
