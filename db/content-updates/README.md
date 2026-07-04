# Content Updates

Versionierte SQL-Exporte des kurierten KI-News-Contents.

## Struktur

```
content-updates/
├── 2026-07-03-content-16-03-45.sql  ← Datum + Timestamp
├── 2026-06-26-content-15-30-22.sql
└── README.md (diese Datei)
```

## Workflow

### Neue Version erstellen:

```bash
# 1. Content generieren mit Claude (im update-content.command)
./scripts/update-content.command

# 2. SQL exportieren (lokal, kostenlos)
./scripts/export-content-to-sql.sh

# 3. Überprüfen
cat db/content-updates/2026-07-03-content-*.sql | head -50

# 4. Committen
git add db/content-updates/
git commit -m "content: KW27 — 5 Stories, 2 new Jobs, AI Model updates"
```

### Alte Version wiederherstellen:

```bash
# Production-DB updaten (z.B. nach Deployment)
psql -h localhost -p 45432 -U up2daite -d up2daite < db/content-updates/2026-07-03-content-16-03-45.sql
```

## Versionsverlauf

| Datum | KW | Stories | Models | Jobs | Ausgabe |
|-------|----|---------|---------|----|---------|
| 2026-07-03 | 27 | 5 | 0 | 2 | #4 |
| 2026-06-26 | 26 | 4 | 1 | 0 | #3 |

(Manuell aktualisieren nach jedem Content-Update)

## Technisches

- **Tool:** `scripts/export-content-to-sql.sh` (Bash + psql)
- **Quelle:** PostgreSQL Container (Port 45432)
- **Format:** Standard SQL (INSERTS mit UPSERT für Models/Jobs)
- **Größe:** ~5-50KB pro File (vs. 5MB für DB-Dumps!)
- **Versionierung:** Git-friendly, lesbar, reviewbar

## Wichtig

- ✅ Vor Git-Push ein SQL exportieren
- ✅ Timestamp im Namen = eindeutig
- ✅ Keine persönliche Daten/Secrets im SQL
- ⚠️  Großere Änderungen = eigenes File pro KW
