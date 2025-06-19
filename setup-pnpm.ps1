# Download pnpm executable
$pnpmDir = "$env:LOCALAPPDATA\pnpm"
if (-not (Test-Path $pnpmDir)) {
    New-Item -ItemType Directory -Path $pnpmDir -Force | Out-Null
}

# Download the latest pnpm release
Invoke-WebRequest -Uri "https://github.com/pnpm/pnpm/releases/latest/download/pnpm-win-x64.exe" -OutFile "$pnpmDir\pnpm.exe"

# Add pnpm to PATH for current session
$env:Path = "$env:Path;$pnpmDir"

# Add pnpm to PATH permanently
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$pnpmDir*") {
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$pnpmDir", "User")
}

# Create a shim for pnpm in a directory that's already in PATH
$shimDir = "$env:USERPROFILE\bin"
if (-not (Test-Path $shimDir)) {
    New-Item -ItemType Directory -Path $shimDir -Force | Out-Null
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    [Environment]::SetEnvironmentVariable("Path", "$userPath;$shimDir", "User")
}

# Create a pnpm.bat file
$batContent = @"
@echo off
"%LOCALAPPDATA%\pnpm\pnpm.exe" %*
"@
Set-Content -Path "$shimDir\pnpm.bat" -Value $batContent

Write-Host "pnpm has been installed successfully!"
Write-Host "Please restart your terminal or run 'refreshenv' to use pnpm"

# Check if pnpm is working
try {
    $pnpmVersion = & "$pnpmDir\pnpm.exe" --version
    Write-Host "pnpm version $pnpmVersion is now installed"
} catch {
    Write-Host "pnpm was installed but there was an error running it. Please restart your terminal."
} 