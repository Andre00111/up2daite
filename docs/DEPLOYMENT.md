# Todo-App Deployment Dokumentation

## Übersicht

| Umgebung | URL | Status |
|----------|-----|--------|
| Lokal (Docker) | http://localhost:53000 | ✓ Funktioniert |
| Server (K8s) | http://31.70.75.157 | ✓ Erreichbar |

---

## Architektur

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │  Strato Server  │
              │  31.70.75.157   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    Traefik      │
              │ Ingress (k3s)   │
              └────────┬────────┘
                       │ :80
              ┌────────▼────────┐
              │    Frontend     │
              │  (nginx:8080)   │
              └────────┬────────┘
                       │
              ┌────────▼────────┐
              │    Backend      │
              │ (Spring:8080)   │
              └────────┬────────┘
                       │ :5432
              ┌────────▼────────┐
              │   PostgreSQL    │
              └─────────────────┘
```

---

## Cluster-Informationen

| Eigenschaft | Wert |
|-------------|------|
| Server | Strato VPS |
| IP | 31.70.75.157 |
| K8s Distribution | k3s v1.35.4 |
| Ingress Controller | Traefik |
| Namespace | todoapp-staging |

---

## Lokale Entwicklung

### Kubeconfig einrichten (einmalig)

```bash
# Kubeconfig kopieren
scp -i ~/.ssh/private root@31.70.75.157:/etc/rancher/k3s/k3s.yaml ~/.kube/config-strato

# Server-IP anpassen
sed -i '' 's/127.0.0.1/31.70.75.157/g' ~/.kube/config-strato
```

### Kubectl verwenden

```bash
# Config aktivieren
export KUBECONFIG=~/.kube/config-strato

# Cluster-Status
kubectl get nodes
kubectl get pods -n todoapp-staging
```

---

## Deployment-Befehle

### Initiales Deployment (einmalig)

```bash
export KUBECONFIG=~/.kube/config-strato

# Namespace
kubectl apply -f k8s/namespace.yaml

# Datenbank
kubectl apply -f k8s/postgres/

# Backend
kubectl apply -f k8s/backend/

# Frontend + Ingress
kubectl apply -f k8s/frontend/
```

### Update nach Code-Änderungen

```bash
# Neues Image deployen
kubectl set image deployment/backend backend=registry.gitlab.com/andre00111/up2daite/backend:$TAG -n todoapp-staging
kubectl set image deployment/frontend frontend=registry.gitlab.com/andre00111/up2daite/frontend:$TAG -n todoapp-staging

# Rollout-Status
kubectl rollout status deployment/backend -n todoapp-staging
kubectl rollout status deployment/frontend -n todoapp-staging
```

### Rollback

```bash
kubectl rollout undo deployment/backend -n todoapp-staging
kubectl rollout undo deployment/frontend -n todoapp-staging
```

---

## Debugging

### Pods prüfen

```bash
kubectl get pods -n todoapp-staging
kubectl describe pod <pod-name> -n todoapp-staging
```

### Logs anzeigen

```bash
# Backend
kubectl logs -n todoapp-staging deployment/backend

# Frontend
kubectl logs -n todoapp-staging deployment/frontend

# Live-Logs
kubectl logs -n todoapp-staging deployment/backend -f
```

### In Container einsteigen

```bash
kubectl exec -it deployment/backend -n todoapp-staging -- sh
kubectl exec -it deployment/frontend -n todoapp-staging -- sh
```

### Datenbank-Zugang

```bash
kubectl exec -it deployment/postgres -n todoapp-staging -- psql -U todoapp -d todoapp
```

---

## CI/CD Pipeline

### Stages

| Stage | Jobs | Trigger |
|-------|------|---------|
| security | gitleaks, semgrep | Jeder Push |
| build | build-frontend, build-backend | Jeder Push |
| package | package-frontend, package-backend | main Branch |
| scan | scan-frontend, scan-backend | main Branch |
| deploy | deploy-frontend, deploy-backend | main Branch |

### GitLab Variables (Settings → CI/CD → Variables)

| Variable | Wert | Beschreibung |
|----------|------|--------------|
| KUBE_CONFIG | Base64-encoded kubeconfig | `cat /etc/rancher/k3s/k3s.yaml \| base64` |
| KUBE_NAMESPACE | todoapp-staging | Ziel-Namespace |

---

## Nützliche Befehle

```bash
# Alle Ressourcen im Namespace
kubectl get all -n todoapp-staging

# Events (für Debugging)
kubectl get events -n todoapp-staging --sort-by='.lastTimestamp'

# Ressourcenverbrauch
kubectl top pods -n todoapp-staging

# Ingress-Status
kubectl get ingress -n todoapp-staging

# Secrets anzeigen
kubectl get secrets -n todoapp-staging
```

---

## Dateien

| Datei | Beschreibung |
|-------|--------------|
| `k8s/namespace.yaml` | Namespace-Definition |
| `k8s/postgres/` | PostgreSQL Deployment, Service, PVC, Secret |
| `k8s/backend/` | Spring Boot Backend Deployment, Service |
| `k8s/frontend/` | React Frontend Deployment, Service, Ingress |
| `.gitlab-ci.yml` | CI/CD Pipeline |
| `docker-compose.dev.yml` | Lokale Entwicklungsumgebung |

---

## Nächste Schritte

- [ ] Neuen Code pushen → Pipeline baut Todo-App Images
- [ ] GitLab Registry Secret im Cluster erstellen (falls private Registry)
- [ ] HTTPS/TLS mit Let's Encrypt einrichten
- [ ] Domain statt IP konfigurieren
