#!/bin/bash
# up2daite Database Backup — erstelle SQL-Dump der PostgreSQL DB
# Nutzer kann die Dumps versionieren (git) statt der Binär-DB

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
BACKUP_DIR="$PROJECT_DIR/backups"

# Sicherstellen, dass backups-Ordner existiert
mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="$BACKUP_DIR/up2daite-$TIMESTAMP.sql"

echo "🔄 Backing up PostgreSQL database..."
echo "📁 Output: $BACKUP_FILE"
echo ""

# Dump from running container
docker exec up2daite-postgres-1 \
  pg_dump -U up2daite -d up2daite \
  > "$BACKUP_FILE"

# Komprimieren
gzip "$BACKUP_FILE"
BACKUP_FILE="$BACKUP_FILE.gz"

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ Backup complete!"
echo "📊 Size: $FILE_SIZE"
echo ""
echo "Next steps:"
echo "  git add backups/$TIMESTAMP.sql.gz"
echo "  git commit -m 'backup: db snapshot'"
