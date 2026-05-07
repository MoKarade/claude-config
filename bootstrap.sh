#!/usr/bin/env bash
# bootstrap.sh — Linux/Mac equivalent de bootstrap.ps1.
set -euo pipefail
MODE="symlink"; FORCE=false; DRY_RUN=false
CLAUDE_HOME="${CLAUDE_HOME:-$HOME/.claude}"
SOURCE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

while [[ $# -gt 0 ]]; do
    case $1 in
        --mode) MODE="$2"; shift 2 ;;
        --force) FORCE=true; shift ;;
        --dry-run) DRY_RUN=true; shift ;;
        --target) CLAUDE_HOME="$2"; shift 2 ;;
        *) echo "Arg inconnu: $1"; exit 1 ;;
    esac
done

ensure_dir() { [[ -d "$1" ]] || { $DRY_RUN && echo "  [dry] mkdir $1" && return; mkdir -p "$1"; echo "  [+] cree $1"; }; }
backup_existing() {
    [[ -e "$1" || -L "$1" ]] || return
    local name; name="$(basename "$1")"
    $DRY_RUN && { echo "  [dry] backup $1"; return; }
    mkdir -p "$2"; mv "$1" "$2/$name"; echo "  [b] backup $name"
}

echo "=== bootstrap claude-config ==="
echo "  Source: $SOURCE_ROOT | Target: $CLAUDE_HOME | Mode: $MODE"
ensure_dir "$CLAUDE_HOME"

ts="$(date '+%Y%m%d-%H%M%S')"
backup_root="$CLAUDE_HOME/.backup-$ts"

for dir in agents skills commands rules; do
    src="$SOURCE_ROOT/$dir"; tgt="$CLAUDE_HOME/$dir"
    [[ -d "$src" ]] || { echo "  [!] $src absent"; continue; }
    echo ""; echo "[$dir]"
    if [[ "$MODE" == "symlink" ]]; then
        if [[ -L "$tgt" && ! $FORCE = true ]]; then echo "  [=] deja lien"; continue; fi
        backup_existing "$tgt" "$backup_root"
        $DRY_RUN || ln -s "$src" "$tgt"
        echo "  [v] symlink $tgt"
    else
        backup_existing "$tgt" "$backup_root"
        $DRY_RUN || cp -r "$src" "$tgt"
        echo "  [v] copie $tgt"
    fi
done

echo ""; echo "[CLAUDE.md]"
if [[ -f "$SOURCE_ROOT/CLAUDE.md" ]]; then
    if [[ -e "$CLAUDE_HOME/CLAUDE.md" && ! $FORCE = true ]]; then echo "  [=] deja existant"
    else
        backup_existing "$CLAUDE_HOME/CLAUDE.md" "$backup_root"
        $DRY_RUN || cp "$SOURCE_ROOT/CLAUDE.md" "$CLAUDE_HOME/CLAUDE.md"
        echo "  [v] copie"
    fi
fi

echo ""; echo "=== Termine ==="
