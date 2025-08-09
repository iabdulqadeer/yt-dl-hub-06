@echo off
echo Starting YouTube Downloader Backend Server...

cd server

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing backend dependencies...
    npm install
)

echo Starting server on port 3001...
npm start

pause





