# scripts/claude-setup.ps1
# Claude Shared Config -- Bootstrap Wrapper
#
# Copy this file from claude-shared-config/templates/claude-setup.ps1 once per project.
# Do NOT modify the content of this file.
# All project-specific settings go in .claude-sync.json at the project root.
#
# Usage:
#   .\scripts\claude-setup.ps1           -- sync agents
#   .\scripts\claude-setup.ps1 --check  -- check only (for CI / pre-commit)
#   .\scripts\claude-setup.ps1 --update -- pull latest submodule then sync

param(
    [switch]$Check,
    [switch]$Update
)

$ErrorActionPreference = "Stop"

# Resolve project root (assumes this wrapper lives in <projectRoot>/scripts/)
$projectRoot = Split-Path (Split-Path $MyInvocation.MyCommand.Path -Parent) -Parent

# Read submodulePath from .claude-sync.json (default: "claude-shared-config")
$submodulePath = "claude-shared-config"
$configFile = Join-Path $projectRoot ".claude-sync.json"
if (Test-Path $configFile) {
    try {
        $cfg = Get-Content $configFile -Raw -Encoding UTF8 | ConvertFrom-Json
        if ($cfg.submodulePath) { $submodulePath = $cfg.submodulePath }
    } catch {}
}

$submoduleDir = Join-Path $projectRoot $submodulePath
$mainScript   = Join-Path $submoduleDir "scripts\sync.ps1"

# Bootstrap: auto-initialize submodule if sync.ps1 is not yet present
if (-not (Test-Path $mainScript)) {
    Write-Host "[claude-sync] Submodule not initialized. Running: git submodule update --init ..." -ForegroundColor Cyan
    git -C $projectRoot submodule update --init $submodulePath
    if ($LASTEXITCODE -ne 0) {
        Write-Error "[claude-sync] git submodule update --init failed. Check .gitmodules config."
        exit 1
    }
}

if (-not (Test-Path $mainScript)) {
    Write-Error "[claude-sync] sync.ps1 not found at: $mainScript -- check submodule path in .gitmodules."
    exit 1
}

# Delegate to main sync script
& $mainScript -ProjectRoot $projectRoot -Check:$Check -Update:$Update
exit $LASTEXITCODE
