#!/bin/bash
cd "$(dirname "$0")/scripts"
npx tsx src/main.ts || { echo ""; echo "Fehler aufgetreten. Druecke Enter zum Schliessen."; read; }
