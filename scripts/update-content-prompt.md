# up2daite — Automatisches Content-Update

Du bist der Content-Automatisierer für up2daite.com, einen KI-News-Newsletter.
Führe die folgenden Schritte der Reihe nach aus.

## Kontext

- Backend-API läuft lokal auf `http://localhost:8080` ODER remote auf `https://up2daite.com`
- Verwende die API, die erreichbar ist (teste mit einem GET /api/stories)
- OUTPUT_DIR und PROJECT_DIR werden als Umgebungsvariablen übergeben
- Heute ist das Datum, das als TODAY übergeben wird

## Schritt 1: KI-News recherchieren

Recherchiere mit WebSearch die 5–7 wichtigsten KI-Nachrichten der letzten 7 Tage.

Für jede Story ermittle:
- **title**: Prägnante deutsche Überschrift
- **editorialComment**: 2–4 Sätze redaktionelle Einordnung (warum relevant, was es bedeutet)
- **source**: { name, url, type: 'primary' | 'analysis' | 'pr-driven' }
- **topicIds**: aus ['ai-research', 'ai-products', 'ai-policy', 'ai-business', 'ai-tools']
- **signalScore**: { impact: 1-5, hypeLevel: 1-5, sourceQuality: 1-5 }
- **buzzwords**: 2-4 Schlagwörter (z.B. 'AGI', 'Open Source', 'Regulation')
- **publishedAt**: Datum der Originalmeldung (YYYY-MM-DD)

Erstelle die Stories über die API:
```bash
curl -X POST http://localhost:8080/api/stories \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

## Schritt 2: Edition erstellen

Erstelle eine neue Edition und ordne alle neuen Stories zu:
```bash
# Edition erstellen
curl -X POST http://localhost:8080/api/editions \
  -H "Content-Type: application/json" \
  -d '{"title": "KI-News KW XX", "publishedAt": "TODAY", "status": "draft", "editorNote": "Automatisch generiert"}'

# Stories der Edition zuordnen (PUT mit editionId)
```

## Schritt 3: KI-Modelle aktualisieren

Recherchiere aktuelle KI-Modell-Rankings (ChatBot Arena, LMSYS, etc.).
Vergleiche mit den aktuellen Modellen über `GET /api/ai-models`.
Aktualisiere geänderte Modelle über die API:
```bash
curl -X PUT http://localhost:8080/api/ai-models/{id} \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

Felder pro Modell:
- name, company, logo (Emoji), gradient (CSS), accentColor, rank (1-N), category, highlights (String[]), releaseYear

## Schritt 4: KI-Jobs aktualisieren

Recherchiere aktuelle KI-Automatisierungstrends.
Vergleiche mit den aktuellen Jobs über `GET /api/ai-jobs`.
Aktualisiere riskScore und trend bei Änderungen:
```bash
curl -X PUT http://localhost:8080/api/ai-jobs/{id} \
  -H "Content-Type: application/json" \
  -d '{ ... }'
```

Felder pro Job:
- title, category, riskScore (0-100), trend ('rising'|'stable'|'declining'), reasoning, affectedTasks (String[]), sortOrder

## Schritt 5: Instagram-Bilder generieren

Nutze die Datei `scripts/render-cards.html` mit Node.js und Puppeteer/Playwright, um PNG-Bilder zu erzeugen.

Für die aktuelle Edition:
1. **Edition Cover** (1080×1350): Übersicht aller Stories
2. **Story Cards** (je 1080×1350): Eine Karte pro Story
3. **Model Cards** (optional): Für neue/geänderte Modelle
4. **Job Risk Cards** (optional): Für geänderte Jobs

Speichere alle PNGs in `$OUTPUT_DIR/`.

Alternativ, falls Puppeteer nicht installiert ist, verwende die render-cards.html direkt:
```bash
# Öffne die HTML mit Daten als Query-Parameter
open "$PROJECT_DIR/scripts/render-cards.html?type=edition&data=$(echo $JSON | base64)"
```

## Schritt 6: Instagram-Caption generieren

Erstelle eine Instagram-Caption im folgenden Format:

```
📰 KI-News der Woche — Ausgabe #XX

🔹 [Story 1 Titel]
🔹 [Story 2 Titel]
...

📊 Signal Score Ø: X.X/5
🏷️ #KI #AI #KünstlicheIntelligenz #AINews #up2daite #Tech #[Buzzwords]

👉 Alle Details: up2daite.com
```

Kopiere die Caption in die Zwischenablage:
```bash
echo "CAPTION_TEXT" | pbcopy
```

## Schritt 7: Abschluss

1. Git commit mit allen Änderungen:
```bash
git add -A
git commit -m "content: KW XX Update — News, Modelle, Jobs"
```

2. Öffne den Output-Ordner im Finder:
```bash
open "$OUTPUT_DIR"
```

3. Gib eine Zusammenfassung aus:
- Anzahl neuer Stories
- Anzahl aktualisierter Modelle
- Anzahl aktualisierter Jobs
- Anzahl generierter Bilder
