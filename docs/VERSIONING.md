# Versionierung & Release-Workflow

## SNAPSHOT vs Release

| Version | Bedeutung |
|---------|-----------|
| `0.2.0-SNAPSHOT` | Entwicklung (kann sich ändern) |
| `0.2.0` | Release (stabil, unveränderlich) |

## Docker Image Tags

**Entwicklung (Push auf main):**
- `:latest` — neueste Entwicklungsversion
- `:snapshot` — explizit als "nicht stabil" markiert
- `:abc123f` — Commit-SHA

**Release (Git-Tag v0.2.0):**
- `:stable` — neuestes stabiles Release
- `:v0.2.0` — exakte Version
- `:abc123f` — Commit-SHA

## Release erstellen

```bash
# 1. Version in pom.xml/package.json: -SNAPSHOT entfernen
# 2. Commit + Tag
git commit -am "release: v0.2.0"
git tag v0.2.0
git push origin main --tags
git push gitlab main --tags

# 3. Nächste Entwicklung starten
#    Version auf 0.3.0-SNAPSHOT setzen
git commit -am "chore: start 0.3.0-SNAPSHOT"
git push
```

## Welches Image nutzen?

| Zweck | Tag |
|-------|-----|
| Entwicklung testen | `:latest` |
| Produktion | `:stable` oder `:v0.2.0` |
| Debugging | `:abc123f` (Commit-SHA) |
