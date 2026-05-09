# Argo CD Integration für Todo-App

## Was ist Argo CD?

Argo CD ist ein **GitOps-Tool** für Kubernetes. Statt dass die CI/CD-Pipeline Deployments pusht, **überwacht Argo CD ein Git-Repository** und synchronisiert automatisch den Cluster-Zustand mit dem gewünschten Zustand im Repo.

```
┌─────────────────────────────────────────────────────────────────┐
│                        AKTUELL (Push-basiert)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   GitLab CI  ──push──>  kubectl apply  ──>  K8s Cluster        │
│                                                                 │
│   Problem: CI braucht Cluster-Zugang (KUBE_CONFIG Secret)       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        MIT ARGO CD (Pull-basiert)               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   GitLab CI  ──push──>  Git Repo (k8s/ Manifeste)              │
│                              │                                  │
│                              │ (Argo CD überwacht)              │
│                              ▼                                  │
│                         Argo CD  ──sync──>  K8s Cluster        │
│                                                                 │
│   Vorteil: CI braucht KEINEN Cluster-Zugang                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Vorteile von Argo CD

| Feature | Ohne Argo CD | Mit Argo CD |
|---------|--------------|-------------|
| Deployment-Trigger | CI/CD Pipeline | Git Push (automatisch) |
| Cluster-Zugang | CI braucht KUBE_CONFIG | Nur Argo CD hat Zugang |
| Rollback | Manuell oder komplexe Pipeline | Ein Klick / `git revert` |
| Drift Detection | Keine | Automatisch (zeigt Abweichungen) |
| UI | Keine | Web-Dashboard |
| Multi-Cluster | Komplex | Eingebaut |

---

## Integrationsschritte

### Schritt 1: Argo CD im Cluster installieren

```bash
# Namespace erstellen
kubectl create namespace argocd

# Argo CD installieren
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Warten bis alles läuft
kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s

# Admin-Passwort holen
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Schritt 2: Argo CD UI zugänglich machen

**Option A: Port-Forward (lokal/dev)**
```bash
kubectl port-forward svc/argocd-server -n argocd 8443:443
# Öffne https://localhost:8443
```

**Option B: Ingress (Produktion)**
```yaml
# k8s/argocd/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: argocd-server
  namespace: argocd
  annotations:
    nginx.ingress.kubernetes.io/ssl-passthrough: "true"
    nginx.ingress.kubernetes.io/backend-protocol: "HTTPS"
spec:
  ingressClassName: nginx
  rules:
    - host: argocd.dein-server.de
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: argocd-server
                port:
                  number: 443
```

### Schritt 3: GitLab Repository verbinden

```bash
# Argo CD CLI installieren (macOS)
brew install argocd

# Einloggen
argocd login localhost:8443 --username admin --password <passwort>

# GitLab Repo hinzufügen (für private Repos)
argocd repo add https://gitlab.com/andre00111/up2daite.git \
  --username <gitlab-user> \
  --password <gitlab-token>
```

### Schritt 4: Application erstellen

**Option A: Per CLI**
```bash
argocd app create todo-app \
  --repo https://gitlab.com/andre00111/up2daite.git \
  --path k8s \
  --dest-server https://kubernetes.default.svc \
  --dest-namespace todoapp-staging \
  --sync-policy automated \
  --auto-prune \
  --self-heal
```

**Option B: Per Manifest (empfohlen - GitOps-konform)**

Erstelle `k8s/argocd/application.yaml`:
```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: todo-app
  namespace: argocd
spec:
  project: default
  
  source:
    repoURL: https://gitlab.com/andre00111/up2daite.git
    targetRevision: main
    path: k8s
    
  destination:
    server: https://kubernetes.default.svc
    namespace: todoapp-staging
    
  syncPolicy:
    automated:
      prune: true      # Entfernt gelöschte Ressourcen
      selfHeal: true   # Korrigiert manuelle Änderungen
    syncOptions:
      - CreateNamespace=true
```

```bash
kubectl apply -f k8s/argocd/application.yaml
```

---

## GitLab CI/CD Anpassungen

### Vorher (kubectl-basiert)
```yaml
deploy-backend:
  stage: deploy
  script:
    - kubectl set image deployment/backend ...
```

### Nachher (Argo CD)

Die Deploy-Stage entfällt komplett! Stattdessen:

```yaml
# .gitlab-ci.yml

stages:
  - security
  - build
  - package
  - scan
  - update-manifests  # NEU: Statt deploy

update-manifests:
  stage: update-manifests
  image: alpine:latest
  before_script:
    - apk add --no-cache git sed
  script:
    # Image-Tag in K8s Manifesten aktualisieren
    - sed -i "s|image:.*backend:.*|image: $BACKEND_IMAGE:$IMAGE_TAG|g" k8s/backend/deployment.yaml
    - sed -i "s|image:.*frontend:.*|image: $FRONTEND_IMAGE:$IMAGE_TAG|g" k8s/frontend/deployment.yaml
    
    # Änderungen committen
    - git config user.email "ci@gitlab.com"
    - git config user.name "GitLab CI"
    - git add k8s/
    - git commit -m "chore: update images to $IMAGE_TAG [skip ci]"
    - git push https://oauth2:$CI_JOB_TOKEN@gitlab.com/andre00111/up2daite.git HEAD:main
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

**Ablauf:**
1. CI baut Images und pusht zur Registry
2. CI aktualisiert die Image-Tags in den K8s-Manifesten
3. CI pusht die Änderung zu Git
4. Argo CD erkennt die Änderung und deployed automatisch

---

## Verzeichnisstruktur mit Argo CD

```
k8s/
├── argocd/
│   └── application.yaml      # Argo CD Application Definition
├── backend/
│   ├── deployment.yaml
│   └── service.yaml
├── frontend/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── postgres/
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── pvc.yaml
│   └── secret.yaml
└── namespace.yaml
```

---

## Nützliche Argo CD Befehle

```bash
# App-Status anzeigen
argocd app get todo-app

# Manuell synchronisieren
argocd app sync todo-app

# Rollback zur vorherigen Version
argocd app rollback todo-app

# Alle Apps anzeigen
argocd app list

# Logs eines Pods anzeigen
argocd app logs todo-app --name backend
```

---

## Zusammenfassung

| Schritt | Beschreibung |
|---------|--------------|
| 1 | Argo CD im Cluster installieren |
| 2 | UI via Ingress/Port-Forward zugänglich machen |
| 3 | GitLab Repo in Argo CD registrieren |
| 4 | Application-Manifest erstellen und anwenden |
| 5 | GitLab CI anpassen (deploy → update-manifests) |
| 6 | Fertig! Argo CD übernimmt das Deployment |

---

## Weiterführende Themen

- **Kustomize**: Verschiedene Umgebungen (dev/staging/prod) verwalten
- **Helm**: Charts statt roher Manifeste verwenden
- **ApplicationSets**: Mehrere Apps aus einem Template generieren
- **Notifications**: Slack/Teams Benachrichtigungen bei Sync-Events
- **RBAC**: Benutzerrechte in Argo CD verwalten

---

## Ressourcen

- [Argo CD Docs](https://argo-cd.readthedocs.io/)
- [GitOps mit Argo CD (Tutorial)](https://codefresh.io/learn/gitops/)
- [Argo CD Best Practices](https://argo-cd.readthedocs.io/en/stable/user-guide/best_practices/)
