# bootstrap.ps1 — installe la config Claude Code globale dans ~/.claude/.
# Idempotent. Modes : symlink (default) ou copy.
#
# Usage :
#   .\bootstrap.ps1                # symlinks
#   .\bootstrap.ps1 -Mode copy     # copies
#   .\bootstrap.ps1 -Force         # ecrase l'existant
#   .\bootstrap.ps1 -DryRun        # simulation

[CmdletBinding()]
param(
    [ValidateSet('symlink', 'copy')]
    [string]$Mode = 'symlink',
    [switch]$Force,
    [switch]$DryRun,
    [string]$ClaudeHome = (Join-Path $env:USERPROFILE '.claude'),
    [string]$SourceRoot = $PSScriptRoot
)

$ErrorActionPreference = 'Stop'

function Log($msg, $color = 'White') { Write-Host $msg -ForegroundColor $color }

function Ensure-Dir($path) {
    if (-not (Test-Path $path)) {
        if ($DryRun) { Log "  [dry] mkdir $path" 'DarkGray'; return }
        New-Item -Path $path -ItemType Directory -Force | Out-Null
        Log "  [+] cree $path" 'DarkGreen'
    }
}

function Backup-Existing($target, $backupRoot) {
    if (Test-Path $target) {
        $name = Split-Path $target -Leaf
        $backupPath = Join-Path $backupRoot $name
        if ($DryRun) { Log "  [dry] backup $target -> $backupPath" 'DarkGray'; return }
        if (-not (Test-Path $backupRoot)) { New-Item -Path $backupRoot -ItemType Directory -Force | Out-Null }
        Move-Item -Path $target -Destination $backupPath -Force
        Log "  [b] backup $name -> $backupRoot" 'Yellow'
    }
}

function Install-Symlink($source, $target, $backupRoot) {
    if (Test-Path $target) {
        $item = Get-Item $target -Force
        $isLink = $item.LinkType -eq 'SymbolicLink' -or $item.LinkType -eq 'Junction'
        if ($isLink -and -not $Force) { Log "  [=] $target deja un lien (skip)" 'DarkGreen'; return }
        Backup-Existing -target $target -backupRoot $backupRoot
    }
    if ($DryRun) { Log "  [dry] symlink $target -> $source" 'DarkGray'; return }
    try {
        New-Item -ItemType SymbolicLink -Path $target -Target $source -Force | Out-Null
        Log "  [v] symlink $target -> $source" 'Green'
    } catch {
        $isDir = (Get-Item $source).PSIsContainer
        if ($isDir) {
            cmd /c "mklink /J `"$target`" `"$source`"" | Out-Null
            Log "  [v] junction $target -> $source" 'Green'
        } else { throw "Impossible (active Developer Mode) : $_" }
    }
}

function Install-Copy($source, $target, $backupRoot) {
    if (Test-Path $target) { Backup-Existing -target $target -backupRoot $backupRoot }
    if ($DryRun) { Log "  [dry] copy $source -> $target" 'DarkGray'; return }
    Copy-Item -Path $source -Destination $target -Recurse -Force
    Log "  [v] copie $target" 'Green'
}

Log "=== bootstrap claude-config ===" 'Cyan'
Log "  Source : $SourceRoot  |  Cible : $ClaudeHome  |  Mode : $Mode"
Log ""

if (-not (Test-Path $SourceRoot)) { throw "SourceRoot introuvable : $SourceRoot" }
Ensure-Dir $ClaudeHome

$ts = Get-Date -Format 'yyyyMMdd-HHmmss'
$backupRoot = Join-Path $ClaudeHome ".backup-$ts"
$dirsToInstall = @('agents', 'skills', 'commands', 'rules')

foreach ($dir in $dirsToInstall) {
    $source = Join-Path $SourceRoot $dir
    $target = Join-Path $ClaudeHome $dir
    if (-not (Test-Path $source)) { Log "  [!] $source absent, skip" 'Yellow'; continue }
    Log ""
    Log "[$dir]" 'Cyan'
    if ($Mode -eq 'symlink') { Install-Symlink -source $source -target $target -backupRoot $backupRoot }
    else { Install-Copy -source $source -target $target -backupRoot $backupRoot }
}

Log ""
Log "[CLAUDE.md]" 'Cyan'
$claudeMdSource = Join-Path $SourceRoot 'CLAUDE.md'
$claudeMdTarget = Join-Path $ClaudeHome 'CLAUDE.md'
if (Test-Path $claudeMdSource) {
    if ((Test-Path $claudeMdTarget) -and -not $Force) {
        Log "  [=] $claudeMdTarget existe deja (skip, utilise -Force)" 'DarkGreen'
    } else {
        if (Test-Path $claudeMdTarget) { Backup-Existing -target $claudeMdTarget -backupRoot $backupRoot }
        if (-not $DryRun) { Copy-Item -Path $claudeMdSource -Destination $claudeMdTarget -Force }
        Log "  [v] copie $claudeMdTarget" 'Green'
    }
}

Log ""
Log "[mcp-configs]" 'Cyan'
$mcpSource = Join-Path $SourceRoot 'mcp-configs'
$mcpTarget = Join-Path $ClaudeHome 'mcp-configs'
if (Test-Path $mcpSource) {
    if ((Test-Path $mcpTarget) -and -not $Force) { Log "  [=] $mcpTarget existe deja (skip)" 'DarkGreen' }
    else {
        if (Test-Path $mcpTarget) { Backup-Existing -target $mcpTarget -backupRoot $backupRoot }
        if (-not $DryRun) { Copy-Item -Path $mcpSource -Destination $mcpTarget -Recurse -Force }
        Log "  [v] copie $mcpTarget (a integrer manuellement dans Claude Code settings)" 'Green'
    }
}

Log ""
Log "=== Termine ===" 'Cyan'
if ($Mode -eq 'symlink') { Log "git pull dans ce repo = update auto sur ce PC." 'DarkCyan' }
else { Log "Relance bootstrap.ps1 apres chaque git pull." 'DarkCyan' }
