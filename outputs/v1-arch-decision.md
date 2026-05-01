# Architektur-Entscheidung: CI/CD & Infrastruktur
> Orchestrator-Synthese aus CI/CD- und K8s-Perspektive | Stand: April 2026

---

## Ausgangslage

| Dimension | Aktuell | Problem |
|---|---|---|
| Runner | Shell auf Mac | Manuell starten, kein Neustart bei Absturz |
| Docker-Build | docker:dind | Privileged-Modus, bricht auf k8s |
| Tests | keine | Kein Sicherheitsnetz |
| Linting | keine | Fehler mergen durch |
| dist/ im Repo | ja | Anti-Pattern |
| Branch-Schutz | nein | Direkte Pushes auf main möglich |

---

## Entscheidungen

### 1. Lokaler Kubernetes-Cluster: OrbStack

OrbStack wird als lokale Kubernetes-Umgebung eingesetzt. Begründung:
- Nativ arm64, minimaler Ressourcenverbrauch
- Kubernetes per Klick, keine VM-Konfiguration
- `kubectl` und Helm funktionieren identisch zu echten Clustern — kein Umlernen nötig

### 2. GitLab Runner: Kubernetes-Executor mit Kaniko

Der Shell-Runner wird durch den GitLab Runner Helm Chart ersetzt.
Jobs laufen als kurzlebige Pods im Namespace `gitlab-runner`.

Docker-in-Docker (`docker:dind`) wird durch **Kaniko** ersetzt:
- Kein `privileged`-Modus nötig
- Sicherer, produktionstauglich
- Gleiche Dockerfiles, kein Umbau der Anwendung

### 3. Namespace-Trennung

```
gitlab-runner/   → Runner und Job-Pods
staging/         → App-Deployment (wenn deploy-Stage kommt)
```

### 4. Sofort umsetzen: dist/ und Branch-Schutz

Unabhängig vom Runner-Wechsel — diese zwei Punkte jetzt:
- `dist/` aus `.gitignore` und Repo entfernen
- Branch-Schutz für `main` in GitLab aktivieren

---

## Ziel-Architektur

```
Entwickler-Mac (OrbStack)
│
├── kubectl / helm          → Cluster-Verwaltung
│
└── Kubernetes-Cluster (lokal)
    │
    ├── Namespace: gitlab-runner
    │   ├── gitlab-runner Pod (Helm Chart)
    │   └── Job-Pods (kurzlebig, pro Pipeline-Job)
    │       ├── node:20-alpine    → build-Job
    │       └── kaniko            → package-Job
    │
    └── Namespace: staging (später)
        ├── Deployment: frontend (nginx)
        ├── Service: frontend
        └── Secret: gitlab-registry (Image-Pull)
```

---

## Ziel-Pipeline

```yaml
stages:
  - build      # jetzt: lint + build | später: + test
  - package    # Kaniko: Image bauen + pushen
  - scan       # Tenable (noch nicht aktiv)
  - deploy     # kubectl/helm (noch nicht aktiv)
```

```
git push → build-frontend ──► package-frontend ──► [scan] ──► [deploy]
             (node Pod)         (kaniko Pod)
```

**Trigger-Regeln:**
- `build`: jeder Push, jeder Branch
- `package`, `deploy`: nur `main`
- `scan`: nach `package`, blockiert `deploy`

---

## Migrationsreihenfolge

### Schritt 1 — Sofort (unabhängig vom Runner)
- [ ] `dist/` zu `.gitignore` hinzufügen, aus Git-History entfernen
- [ ] Branch-Schutz für `main` in GitLab aktivieren

### Schritt 2 — Kubernetes-Runner einrichten
- [ ] OrbStack installieren, Kubernetes aktivieren
- [ ] Helm installieren (`brew install helm`)
- [ ] GitLab Runner Helm Chart installieren
- [ ] Neuen Runner-Token in GitLab generieren, Chart konfigurieren
- [ ] Jobs mit `tags: [kubernetes]` auf neuen Runner routen
- [ ] Shell-Runner deregistrieren

### Schritt 3 — Kaniko statt dind
- [ ] `build-and-push-image`-Job auf Kaniko umschreiben
- [ ] `docker:dind` Service entfernen
- [ ] Testen ob Image korrekt gebaut und gepusht wird

### Schritt 4 — Qualitätssicherung (wenn bereit)
- [ ] ESLint-Job in `build`-Stage ergänzen
- [ ] Vitest einrichten, Test-Job hinzufügen

### Schritt 5 — Deployment (wenn Zielserver entschieden)
- [ ] `staging/`-Namespace anlegen
- [ ] Image-Pull-Secret für GitLab Registry anlegen
- [ ] Kubernetes-Manifeste (Deployment, Service) erstellen
- [ ] `deploy`-Stage in Pipeline aktivieren

### Schritt 6 — Tenable
- [ ] Tenable-Credentials als GitLab CI Variable hinterlegen
- [ ] `scan`-Stage zwischen `package` und `deploy` einfügen

---

## Offene Fragen

| Frage | Relevant für |
|---|---|
| Deployment-Ziel: lokaler Cluster oder echter Server? | Schritt 5 |
| Zielarchitektur der Images: arm64 oder amd64? | Kaniko `--custom-platform` |
| Backend in V2: eigenes Repo oder Monorepo? | Pipeline-Struktur |
| Tenable: GitLab Security Dashboard oder CLI? | Scan-Integration |

---

## Quellen dieser Entscheidung

- [CI/CD-Perspektive](./v1-arch-cicd-perspective.md)
- [Kubernetes-Perspektive](./v1-arch-k8s-perspective.md)
- [K8s-Runner-Plan](./v1-k8s-runner-plan.md)
