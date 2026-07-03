#!/bin/bash
# up2daite Instagram Seed-Generator
# Doppelklick auf diese Datei → Claude rendert alle vorhandenen Inhalte
# (Editions, Stories, Modelle, Jobs) als Instagram-Bilder.
# Einmalige Aktion zum Aufbau des Instagram-Archivs.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo "╔══════════════════════════════════════════════╗"
echo "║    up2daite · Instagram Seed Generator       ║"
echo "║  (alle vorhandenen Inhalte rendern)          ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "Starte Claude Code CLI..."
echo ""

PROMPT_FILE="$SCRIPT_DIR/seed-instagram-prompt.md"

if [ ! -f "$PROMPT_FILE" ]; then
  echo "❌ Prompt-Datei nicht gefunden: $PROMPT_FILE"
  exit 1
fi

OUTPUT_DIR="$PROJECT_DIR/output/instagram-seed-$(date +%Y-%m-%d_%H-%M-%S)"
mkdir -p "$OUTPUT_DIR"

claude --print \
  -p "$(cat "$PROMPT_FILE")

OUTPUT_DIR=$OUTPUT_DIR
PROJECT_DIR=$PROJECT_DIR" \
  --allowedTools "WebSearch,WebFetch,Read,Write,Edit,Bash(git *),Bash(pbcopy),Bash(open *),Bash(cd *),Bash(node *),Bash(npx *)"

echo ""
echo "✅ Fertig! Bilder liegen in: $OUTPUT_DIR"
echo ""
echo "Drücke Enter zum Schließen..."
read -r
