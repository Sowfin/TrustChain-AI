Set-Location $PSScriptRoot
$env:NO_BROWSER = "1"
Write-Host "Starting trustchainAI at http://127.0.0.1:5500/"
Write-Host "Keep this window open while using the website."
node .\server.js
if ($LASTEXITCODE -ne 0) {
  Write-Host ""
  Write-Host "The website could not start. Make sure Node.js is installed, then try again."
  Read-Host "Press Enter to close"
}
