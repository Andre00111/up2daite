# Architektur-Perspektive: Kubernetes & Infrastruktur
> Spezialist: Kubernetes / Infrastruktur | Stand: April 2026

---

## Tool-Empfehlung: OrbStack

**Empfehlung: OrbStack** (nicht minikube, nicht k3s).

| | OrbStack | minikube | k3s |
|---|---|---|---|
| arm64 nativ | ✓ | ✓ (mit Docker-Treiber) | ✓ |
| Setup-Aufwand | minimal | mittel | hoch |
| Ressourcenverbrauch | gering | mittel | gering |
| Kubernetes inklusive | ✓ (ein Klick) | ✓ | manuell |
| macOS-Integration | sehr gut | mittel | schlecht |
| Helm vorinstalliert | nein (brew install) | nein | nein |

OrbStack startet Kubernetes in ~10 Sekunden, hat nativ arm64-Support und integriert sich sauber in den Mac ohne VM-Overhead. Der Wechsel zu einem echten Cluster (Hetzner, GKE) später ist reibungslos — `kubectl` und Helm funktionieren identisch.

**Einschränkung:** OrbStack ist nicht kostenlos für kommerzielle Nutzung (ab ~8$/Monat). Für privates Lernen kostenlos.

---

## Kaniko auf arm64 — was zu beachten ist

Kaniko hat offizielle multi-arch Images (`linux/amd64` + `linux/arm64`). Auf Apple Silicon funktioniert es ohne Anpassung.

**Kritischer Punkt: Zielarchitektur des Images**

Kaniko baut standardmäßig für die Architektur des Runners — auf arm64 also ein arm64-Image. Das ist ein Problem wenn das Deployment-Ziel (Server, Cloud) x86_64 ist.

Lösung: `--custom-platform linux/amd64` als Kaniko-Argument setzen wenn das Ziel x86 ist.

```yaml
script:
  - /kaniko/executor
    --context $CI_PROJECT_DIR/frontend
    --dockerfile $CI_PROJECT_DIR/frontend/Dockerfile
    --destination $IMAGE_NAME:$IMAGE_TAG
    --custom-platform linux/amd64   # ← nur wenn Ziel x86 ist
```

Für lokalen Cluster (OrbStack auf arm64-Mac) kann `--custom-platform` weggelassen werden.

---

## Kritische Helm-Chart-Einstellungen

Beim Installieren des GitLab Runner Helm Charts sind diese Werte entscheidend:

```yaml
# values.yaml (Auszug)
gitlabUrl: https://gitlab.com
runnerToken: "glrt-..."        # aus GitLab Settings → CI/CD → Runners

runners:
  config: |
    [[runners]]
      [runners.kubernetes]
        namespace = "gitlab-runner"
        image = "alpine:latest"
        # Kaniko braucht keinen privileged-Modus:
        privileged = false
        # Pod-Cleanup nach Job:
        pod_termination_grace_period_seconds = 10
```

**Wichtigste Einstellung:** `privileged = false` — das ist der Hauptvorteil von Kaniko. Ohne Kaniko müsste hier `true` stehen, was ein Sicherheitsrisiko wäre.

---

## Namespace-Strategie

**Empfehlung: getrennter Namespace für Runner und App.**

```
gitlab-runner/    → Runner-Pods, RBAC-Berechtigungen für Job-Pods
staging/          → App-Deployment (später)
```

**Warum getrennt:**
- Der Runner braucht Berechtigungen zum Erstellen von Pods — diese Rechte sollten nicht im selben Namespace wie die App liegen
- Einfacheres Debugging: `kubectl get pods -n gitlab-runner` zeigt nur Runner-Aktivität
- Vorbereitung auf Multi-Environment: `staging/`, `production/` als separate Namespaces

---

## Minimales Kubernetes-Deployment für nginx-Frontend

Wenn die App selbst in den Cluster deployed wird, sind drei Objekte nötig:

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: staging
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: registry.gitlab.com/.../frontend:latest
          ports:
            - containerPort: 80
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend
  namespace: staging
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
---
# ingress.yaml (optional für lokalen Zugriff)
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: frontend
  namespace: staging
spec:
  rules:
    - host: up2daite.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend
                port:
                  number: 80
```

Für den Anfang reicht `Deployment + Service`. Ingress kommt wenn externer Zugriff nötig ist.

---

## Größtes Infrastruktur-Risiko

**Image-Pull-Secret fehlt.**

Die GitLab Container Registry ist privat. Kubernetes kann das Image nicht pullen ohne Authentifizierung. Ohne `imagePullSecret` schlägt das Deployment mit `ImagePullBackOff` fehl — still und ohne hilfreiche Fehlermeldung.

Lösung:
```bash
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<gitlab-username> \
  --docker-password=<gitlab-token> \
  -n staging
```

Dann im Deployment referenzieren:
```yaml
spec:
  imagePullSecrets:
    - name: gitlab-registry
```

Das muss einmalig pro Namespace angelegt werden und ist ein häufig vergessener Schritt.
