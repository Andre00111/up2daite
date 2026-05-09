# K8s & CI/CD Review für Todo-App

## Geprüfte Dateien

| Datei | Status |
|-------|--------|
| `docker-compose.dev.yml` | ✓ Referenz |
| `k8s/backend/deployment.yaml` | ✓ Geprüft & Korrigiert |
| `k8s/frontend/deployment.yaml` | ✓ Geprüft & Korrigiert |
| `k8s/postgres/deployment.yaml` | ✓ OK |
| `k8s/postgres/secret.yaml` | ✓ OK |
| `.gitlab-ci.yml` | ✓ Geprüft |

---

## Änderungen durchgeführt

### 1. Backend Memory Limits erhöht
**Datei:** `k8s/backend/deployment.yaml`

**Vorher:**
```yaml
resources:
  requests:
    memory: "128Mi"
  limits:
    memory: "256Mi"
```

**Nachher:**
```yaml
resources:
  requests:
    memory: "384Mi"
  limits:
    memory: "512Mi"
```

**Grund:** Spring Boot benötigt mehr Speicher für JVM Heap.

---

### 2. GitLab Registry Pfad korrigiert
**Dateien:** `k8s/backend/deployment.yaml`, `k8s/frontend/deployment.yaml`

**Vorher:**
```yaml
image: registry.gitlab.com/andre00111/todoapp/backend:latest
image: registry.gitlab.com/andre00111/todoapp/frontend:latest
```

**Nachher:**
```yaml
image: registry.gitlab.com/andre00111/up2daite/backend:latest
image: registry.gitlab.com/andre00111/up2daite/frontend:latest
```

**Grund:** Das GitLab-Projekt heißt noch `up2daite`. CI/CD pusht Images dorthin.

---

## Konsistenz-Check: docker-compose.dev.yml vs. K8s

| Einstellung | docker-compose | K8s | Status |
|-------------|----------------|-----|--------|
| DB Name | `todoapp` | `todoapp` | ✓ |
| DB User | `todoapp` | `todoapp` (aus Secret) | ✓ |
| DB Password | `todoapp` | `todoapp` (aus Secret) | ✓ |
| Backend Port | `8080` | `8080` | ✓ |
| Frontend Port | `8080` | `8080` | ✓ |
| Postgres Image | `postgres:16-alpine` | `postgres:16-alpine` | ✓ |

---

## CI/CD Pipeline Status

| Stage | Jobs | Status |
|-------|------|--------|
| security | gitleaks, semgrep | ✓ Aktiv |
| build | build-frontend, build-backend | ✓ Aktiv |
| package | package-frontend, package-backend | ✓ Aktiv (nur main) |
| scan | scan-frontend, scan-backend | ✓ Aktiv |
| deploy | deploy-frontend, deploy-backend | ⚠️ Auskommentiert |

**Hinweis:** Deploy-Stage ist auskommentiert. Um K8s-Deployment zu aktivieren:
1. `deploy` zu `stages:` hinzufügen
2. `KUBE_CONFIG` und `KUBE_NAMESPACE` in GitLab CI/CD Variables setzen

---

## Noch zu tun

- [ ] GitLab-Projekt umbenennen (`up2daite` → `todo-app`) ODER K8s Image-Pfade belassen
- [ ] Deploy-Stage aktivieren wenn Cluster bereit
- [ ] `KUBE_CONFIG` Secret in GitLab eintragen
- [ ] `KUBE_NAMESPACE=todoapp-staging` Variable setzen
