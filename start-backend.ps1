Write-Host "Starting YouTube Downloader Backend Server..." -ForegroundColor Green

Set-Location server

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host "Starting server on port 3001..." -ForegroundColor Green
npm start

Read-Host "Press Enter to exit"





