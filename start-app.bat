@echo off
echo 🚀 Starting YouTube Downloader Application...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Install frontend dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

REM Install backend dependencies if server/node_modules doesn't exist
if not exist "server\node_modules" (
    echo 📦 Installing backend dependencies...
    cd server
    npm install
    cd ..
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    echo 📝 Creating .env file...
    echo VITE_API_BASE_URL=http://localhost:3001/api > .env
)

REM Start backend server in background
echo 🔧 Starting backend server...
cd server
start "Backend Server" cmd /c "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server
echo 🌐 Starting frontend application...
npm run dev

pause
