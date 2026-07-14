# Architektur-Perspektive: CI/CD
> Spezialist: GitLab CI/CD | Stand: April 2026

---

## Was an der aktuellen Pipeline gut ist

- **Zwei klare Stages** (`build` → `package`) mit sinnvoller Trennung: TypeScript-Fehler scheitern früh, ohne Docker zu bemühen.
- **Commit-SHA als Image-Tag** — jedes Image ist eindeutig einem Commit zuordenbar. Gut für Traceability.
- **`latest`-Tag zusätzlich** — einfacher Zugriff auf den aktuellen Stand ohne SHA nachschlagen zu müssen.
- **`rules`-Block statt `only/except`** — modernere Syntax, flexibler erweiterbar.
- **Cache für `node_modules`** — spart bei jedem Folge-Push Zeit.

---

## Was fehlt oder fragwürdig ist

### Kein Linting
`npm run build` prüft TypeScript-Typen, aber kein Code-Style. Ein fehlerhaft formatierter PR mergt durch.
→ `eslint` als eigener Job in `build`-Stage, schlägt fehl vor dem Docker-Build.

### Keine Tests
Es gibt keine Test-Stage. Für ein MVP akzeptabel — aber sobald Logik in Hooks oder Komponenten wächst, fehlt die Absicherung.
→ Platzhalter-Job vorbereiten: `test-frontend` mit `npm test -- --run` (Vitest).

### `dist/` liegt im Repository
`frontend/dist/` ist committed. Das ist ein Anti-Pattern: Build-Artefakte gehören nicht ins Repo, sie werden in der Pipeline erzeugt.
→ `dist/` in `.gitignore` aufnehmen.

### Kein Branch-Schutz in GitLab
Direkte Pushes auf `main` sind möglich. Ohne Merge-Request-Pflicht kann fehlerhafte Code ohne Pipeline-Durchlauf landen.
→ GitLab → Settings → Repository → Protected Branches → `main` auf "Maintainer only" + "Require MR".

### Shell-Runner ist fragil
Der Runner hängt davon ab, dass der Mac läuft und `gitlab-runner run` aktiv ist. Keine Resilienz.
→ Kubernetes-Runner löst das strukturell.

---

## Empfohlene Stage-Struktur langfristig

```
stages:
  - build    # npm lint + npm test + npm run build
  - package  # Kaniko: Docker-Image bauen und pushen
  - scan     # Tenable: Image auf Schwachstellen prüfen
  - deploy   # kubectl/helm: Deployment in k8s aktualisieren
```

**Warum diese Reihenfolge:**
- `build` schlägt schnell fehl (Sekunden) — keine Container nötig
- `package` nur wenn Code korrekt ist — kein sinnloses Image bauen
- `scan` nach dem Push, damit Tenable das finale Image sieht
- `deploy` nur wenn Scan grün — kein unsicheres Image landet in Produktion

---

## Tenable-Integration

**Empfehlung: nach `package`, vor `deploy`.**

Tenable scannt das fertige Container-Image in der Registry. Erst nach dem Push ist das Image vollständig und kann gescannt werden. Der Deploy-Job bekommt dann eine explizite Abhängigkeit:

```yaml
deploy:
  stage: deploy
  needs: [scan]   # startet nur wenn scan erfolgreich war
```

Alternativ: Tenable als GitLab-Integration über den Security Dashboard — dann erscheinen Findings direkt im Merge Request.

---

## Wenn ein Backend dazukommt

Zwei parallele `build`-Jobs — Frontend und Backend laufen gleichzeitig:

```
build-frontend  ──┐
                  ├──► package-frontend ──► scan ──► deploy-frontend
build-backend   ──┘
                  └──► package-backend  ──► scan ──► deploy-backend
```

Zwei separate Images, zwei separate Deployments. Die `docker-compose.yml` lokal verknüpft sie, in k8s laufen sie als unabhängige Deployments.

---

## Größtes Risiko aktuell

**`docker:dind` im `package`-Job.**

Docker-in-Docker erfordert privilegierten Modus. Auf dem lokalen Mac mit Shell-Runner funktioniert das zufällig — auf einem Kubernetes-Cluster ist `--privileged` ein Sicherheitsproblem und in vielen Umgebungen gesperrt.

Wenn der Wechsel zu Kubernetes-Runner kommt, bricht dieser Job ohne Vorwarnung.
→ Jetzt schon auf **Kaniko** migrieren, bevor es ein Problem wird.
