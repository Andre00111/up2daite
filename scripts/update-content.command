#!/bin/bash
# up2daite Content-Updater
# Doppelklick auf diese Datei → Claude recherchiert News, KI-Modelle & Jobs,
# generiert Instagram-Bilder und kopiert die Caption in die Zwischenablage.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "╔══════════════════════════════════════════════╗"
echo "║       up2daite · Content-Update              ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Starte Claude Code CLI..."
echo ""

PROMPT_FILE="$SCRIPT_DIR/update-content-prompt.md"

if [ ! -f "$PROMPT_FILE" ]; then
  echo "❌ Prompt-Datei nicht gefunden: $PROMPT_FILE"
  exit 1
fi

OUTPUT_DIR="$PROJECT_DIR/output/instagram-$(date +%Y-%m-%d)"
mkdir -p "$OUTPUT_DIR"

claude --print \
  -p "$(cat "$PROMPT_FILE")

OUTPUT_DIR=$OUTPUT_DIR
PROJECT_DIR=$PROJECT_DIR
TODAY=$(date +%Y-%m-%d)" \
  --allowedTools "WebSearch,WebFetch,Read,Write,Edit,Bash(git *),Bash(pbcopy),Bash(open *),Bash(cd *),Bash(node *),Bash(npx *)"

echo ""
echo "✅ Fertig! Bilder liegen in: $OUTPUT_DIR"
echo ""
echo "Drücke Enter zum Schließen..."
read -r
