# K8s Deployment Cheatsheet

## Das Problem

GitLab CI/CD verwendet `kubectl set image` mit dem Tag `ai-news-app`. Wenn das Tag gleich bleibt, erkennt K8s keine Änderung und startet die Pods nicht neu → alte Version bleibt aktiv.

## Setup

```bash
export KUBECONFIG=~/.kube/config-up2daite
```

## Deployment

### Automatisch (GitLab CI/CD)
```bash
git push gitlab ai-news-app
```
Pipeline baut Images und deployt. **Danach Pods neu starten** (siehe unten).

### Manuell
```bash
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/backend/
```

## Pods neu starten (neues Image pullen)

```bash
kubectl rollout restart deployment/frontend deployment/backend -n up2daite-staging
```

## Status prüfen

```bash
# Pods anzeigen
kubectl get pods -n up2daite-staging

# Rollout-Status
kubectl rollout status deployment/frontend -n up2daite-staging

# Logs
kubectl logs -n up2daite-staging -l app.kubernetes.io/name=frontend
kubectl logs -n up2daite-staging -l app.kubernetes.io/name=backend
```

## Debugging

```bash
# Pod beschreiben (Events, Fehler)
kubectl describe pod <POD-NAME> -n up2daite-staging

# In Pod einloggen
kubectl exec -it <POD-NAME> -n up2daite-staging -- sh

# Services anzeigen
kubectl get svc -n up2daite-staging

# Ingress anzeigen
kubectl get ingress -n up2daite-staging
```

## Zugriff

- **URL:** http://31.70.75.157
- **Namespace:** `up2daite-staging`

## Schnellfix: Alles neu starten

```bash
export KUBECONFIG=~/.kube/config-up2daite
kubectl rollout restart deployment/frontend deployment/backend -n up2daite-staging
kubectl rollout status deployment/frontend deployment/backend -n up2daite-staging
```
