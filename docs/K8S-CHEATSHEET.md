# up2daite – Projekt-Cheatsheet

## Architektur

- **Frontend:** React + MUI + Vite (Port lokal: 43000)
- **Backend:** Spring Boot (Port lokal: 48080)
- **DB:** PostgreSQL (Port lokal: 45432)
- **Server:** K3s auf 31.70.75.157 (Traefik Ingress)
- **CI/CD:** GitLab Pipeline (Branch `ai-news-app` → auto-deploy)
- **Namespace:** `up2daite-staging`

---

## Git & Deployment

### Änderungen committen und deployen
```bash
git add -A
git commit -m "feat: beschreibung"
git push gitlab ai-news-app
```
Die Pipeline baut Images, pusht sie in die GitLab Registry und deployt automatisch auf den K3s-Server. Jeder Commit bekommt einen eigenen Image-Tag (Commit-SHA).

### Pipeline-Status prüfen
```bash
# Im Browser
# https://gitlab.com/andre00111/up2daite/-/pipelines

# Oder per CLI (braucht glab/gh)
git log --oneline -5
```

---

## Lokale Entwicklung

### App starten (Docker Compose)
```bash
docker compose -f docker-compose.dev.yml up -d
```
Frontend: http://localhost:43000

### Nur Frontend neu bauen
```bash
docker compose -f docker-compose.dev.yml stop frontend
docker compose -f docker-compose.dev.yml build --no-cache frontend
docker compose -f docker-compose.dev.yml up -d frontend
```

### Nur Backend neu bauen
```bash
docker compose -f docker-compose.dev.yml stop backend
docker compose -f docker-compose.dev.yml build --no-cache backend
docker compose -f docker-compose.dev.yml up -d backend
```

### Alles stoppen
```bash
docker compose -f docker-compose.dev.yml down
```

### Logs anschauen
```bash
docker compose -f docker-compose.dev.yml logs -f frontend
docker compose -f docker-compose.dev.yml logs -f backend
```

---

## Kubernetes (Server)

### Setup
```bash
export KUBECONFIG=~/.kube/config-up2daite
```

### Pods anzeigen
```bash
kubectl get pods -n up2daite-staging
```

### Rollout-Status
```bash
kubectl rollout status deployment/frontend -n up2daite-staging
kubectl rollout status deployment/backend -n up2daite-staging
```

### Logs lesen
```bash
kubectl logs -n up2daite-staging -l app.kubernetes.io/name=frontend
kubectl logs -n up2daite-staging -l app.kubernetes.io/name=backend
```

### Manifeste manuell anwenden
```bash
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/backend/
```

### Pods neu starten (z.B. nach manuellem Image-Push)
```bash
kubectl rollout restart deployment/frontend deployment/backend -n up2daite-staging
```

---

## Debugging

```bash
# Pod-Details und Events
kubectl describe pod <POD-NAME> -n up2daite-staging

# In einen Pod einloggen
kubectl exec -it <POD-NAME> -n up2daite-staging -- sh

# Services anzeigen
kubectl get svc -n up2daite-staging

# Ingress anzeigen
kubectl get ingress -n up2daite-staging

# Welches Image läuft gerade?
kubectl get deployment frontend -n up2daite-staging -o jsonpath='{.spec.template.spec.containers[0].image}'
```

---

## Registry-Token erneuern (wenn ImagePullBackOff)

Falls K8s keine Images mehr pullen kann:
```bash
kubectl delete secret gitlab-registry -n up2daite-staging

kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<GITLAB-USER> \
  --docker-password=<DEPLOY-TOKEN> \
  -n up2daite-staging
```
Deploy-Token erstellen unter: GitLab → Settings → Repository → Deploy tokens

---

## Zugriff

- **Lokal:** http://localhost:43000
- **Server:** http://31.70.75.157
- **PIN:** 2017 (sessionStorage, gilt pro Browser-Session)

---

## Schnellfix: Alles neu starten

```bash
export KUBECONFIG=~/.kube/config-up2daite
kubectl rollout restart deployment/frontend deployment/backend -n up2daite-staging
kubectl rollout status deployment/frontend deployment/backend -n up2daite-staging
```
