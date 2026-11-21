
#!/bin/bash
set -euo pipefail

# Percorsi originali GitLab
FRONTEND="$HOME/Documents/workspace-js/culturehub-fe"
BACKEND="$HOME/Documents/workspace-python/culturehub-be"

# Repository GitHub: cartella che contiene questo script
DEST="$(cd "$(dirname "$0")" && pwd)"

# Verifica sorgenti
for SOURCE in "$FRONTEND" "$BACKEND"; do
    if [ ! -d "$SOURCE" ]; then
        echo "ERRORE: cartella non trovata: $SOURCE"
        exit 1
    fi
done

echo "=== Sincronizzazione CultureHub PW22 ==="

# Esclusioni condivise
EXCLUDES=(
    --exclude='.git/'
    --exclude='.env'
    --exclude='.env.*'
    --exclude='!.env.example'
    --exclude='node_modules/'
    --exclude='dist/'
    --exclude='build/'
    --exclude='coverage/'
    --exclude='.venv/'
    --exclude='venv/'
    --exclude='__pycache__/'
    --exclude='.pytest_cache/'
    --exclude='.mypy_cache/'
    --exclude='.ruff_cache/'
    --exclude='test-results/'
    --exclude='playwright-report/'
    --exclude='.DS_Store'
    --exclude='*.pyc'
    --exclude='*.log'
    --exclude='*.sqlite'
    --exclude='*.sqlite3'
    --exclude='*.db'
)

mkdir -p "$DEST/frontend" "$DEST/backend"

echo ""
echo "1. Aggiornamento frontend..."
rsync -av --delete "${EXCLUDES[@]}" \
    "$FRONTEND/" "$DEST/frontend/"

echo ""
echo "2. Aggiornamento backend..."
rsync -av --delete "${EXCLUDES[@]}" \
    "$BACKEND/" "$DEST/backend/"

echo ""
echo "3. Stato repository GitHub..."
cd "$DEST"
git status --short

echo ""
echo "Sincronizzazione completata."
echo "Nessun commit o push eseguito."
echo "Controlla sempre i file prima di pubblicarli."

