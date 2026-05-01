# GitLab Runner auf Kubernetes — Umsetzungsplan (Apple Silicon / arm64)

> Zielgruppe: Entwickler, der gerade CI/CD lernt. Kein Kubernetes-Vorwissen vorausgesetzt.
> Stand: April 2026

---

## 1. Empfehlung: Lokales Kubernetes-Tool

**Empfehlung: OrbStack (mit integriertem Kubernetes)**

Begründung:

- OrbStack ist die defacto-Standard-Docker/Kubernetes-Umgebung auf Apple Silicon. Es ersetzt Docker Desktop vollständig und liefert einen eingebetteten Kubernetes-Cluster mit einem Klick.
- Kein separates Tool notwendig, keine VM-Konfiguration, kein Port-Forwarding-Stress.
- Nativ arm64 — keine Emulation, keine Rosetta-Probleme.
- Startet in Sekunden, verbraucht deutlich weniger RAM als minikube mit QEMU.
- `kubectl` ist automatisch konfiguriert sobald Kubernetes in OrbStack aktiviert ist.

**Alternative, wenn OrbStack nicht gewünscht: minikube**

```bash
# minikube mit Docker-Treiber auf Apple Silicon
minikube start --driver=docker --cpus=4 --memory=6g
```

minikube mit Docker-Treiber läuft sauber auf arm64. Der QEMU-Treiber ist langsamer und fehleranfälliger — vermeiden.

**k3s und kind** — beide funktionieren auf arm64, aber erfordern mehr manuelle Setup-Arbeit (k3s via Lima-VM, kind via Docker). Für Einsteiger unnötig komplex.

**Fazit:** OrbStack installieren, Kubernetes-Tab aktivieren, fertig.

---

## 2. Wie der GitLab Kubernetes Runner funktioniert

### Shell-Executor (jetzt)

```
GitLab-Server
    → sendet Job an Runner
        → Runner führt Script direkt in macOS-Shell aus
            → Ergebnis geht zurück an GitLab
```

Alles passiert auf deinem Mac, in deiner normalen Shell-Umgebung. Das `image:`-Feld in der `.gitlab-ci.yml` wird beim Shell-Executor komplett ignoriert.

### Kubernetes-Executor (neu)

```
GitLab-Server
    → sendet Job an Runner
        → Runner erstellt einen Kubernetes-Pod
            → Pod läuft das Docker-Image das in `image:` steht
                → Script läuft im Container
                    → Pod wird nach dem Job gelöscht
                        → Ergebnis geht zurück an GitLab
```

**Was sich konkret ändert:**

| Aspekt | Shell-Executor | Kubernetes-Executor |
|---|---|---|
| Ausführungsumgebung | macOS Shell | Kubernetes Pod |
| `image:` in CI-Job | ignoriert | wird tatsächlich gestartet |
| Isolation zwischen Jobs | keine | vollständig (eigener Container) |
| Zustand zwischen Jobs | bleibt auf dem Mac | weg nach dem Job (außer Artifacts) |
| Muss manuell gestartet werden | ja | nein (Runner läuft als Deployment) |
| Skalierung | ein Job gleichzeitig | mehrere Jobs parallel möglich |

Der Runner selbst ist ein Kubernetes-Deployment das permanent läuft und auf neue Jobs wartet. Du startest nichts manuell.

---

## 3. Docker-in-Docker auf Kubernetes — das Problem und die Lösung

### Das Problem mit docker:dind auf Kubernetes

Dein aktueller `build-and-push-image`-Job nutzt:

```yaml
image: docker:24
services:
  - docker:24-dind
```

Docker-in-Docker bedeutet: ein Docker-Daemon läuft als Container innerhalb eines Containers. Das erfordert auf Kubernetes `--privileged`-Modus für den Pod. Das ist:

- ein Sicherheitsrisiko (der Container hat fast root-Rechte auf dem Node)
- auf vielen Cluster-Konfigurationen standardmäßig deaktiviert
- auf OrbStack/minikube grundsätzlich möglich, aber unnötig komplex

### Die empfohlene Alternative: Kaniko

**Kaniko** baut Docker-Images ohne Docker-Daemon — direkt aus einem Dockerfile, ohne `--privileged`. Es ist der Industriestandard für Docker-Builds auf Kubernetes.

**Warum Kaniko und nicht Docker-Socket-Mount?**

Docker-Socket-Mount (`/var/run/docker.sock` in den Container mounten) funktioniert zwar, ist aber noch unsicherer als dind — jeder Container mit Socket-Zugriff kann den gesamten Kubernetes-Node kontrollieren. Kaniko braucht keinen Socket und keinen privilegierten Modus.

**Wie Kaniko funktioniert:**

```
Kaniko-Container
    → liest das Dockerfile
    → baut Layer für Layer im Userspace
    → pusht direkt in die Registry
    → kein Docker-Daemon nötig
```

**arm64-Kompatibilität:** Kaniko hat offizielle arm64-Images (`gcr.io/kaniko-project/executor:latest` ist multi-arch).

---

## 4. Schritt-für-Schritt Installationsplan

### Schritt 1: OrbStack installieren und Kubernetes aktivieren

```bash
# OrbStack installieren (falls noch nicht vorhanden)
brew install --cask orbstack

# Danach: OrbStack öffnen → Kubernetes-Tab → "Enable Kubernetes"
# Warten bis Status "Running" zeigt (ca. 30 Sekunden)

# Verbindung prüfen
kubectl cluster-info
kubectl get nodes
```

Erwartete Ausgabe von `kubectl get nodes`:
```
NAME       STATUS   ROLES           AGE   VERSION
orbstack   Ready    control-plane   1m    v1.29.x
```

### Schritt 2: Helm installieren

Helm ist der Paket-Manager für Kubernetes. Der GitLab Runner wird per Helm installiert.

```bash
brew install helm

# Prüfen
helm version
```

### Schritt 3: GitLab Runner Namespace erstellen

```bash
kubectl create namespace gitlab-runner
```

### Schritt 4: GitLab Runner Registration Token holen

In GitLab:
1. Dein Projekt öffnen
2. Settings → CI/CD → Runners → "New project runner"
3. Tags setzen: `kubernetes` (wichtig — wird später in der Pipeline verwendet)
4. "Create runner" klicken
5. Den angezeigten Token kopieren (beginnt mit `glrt-...`)

### Schritt 5: Helm Chart für GitLab Runner installieren

```bash
# GitLab Helm Repository hinzufügen
helm repo add gitlab https://charts.gitlab.io
helm repo update

# Runner installieren
# GITLAB_URL: deine GitLab-Instanz, z.B. https://gitlab.com
# REGISTRATION_TOKEN: der Token aus Schritt 4

helm install gitlab-runner gitlab/gitlab-runner \
  --namespace gitlab-runner \
  --set gitlabUrl=https://gitlab.com \
  --set runnerToken=glrt-DEIN-TOKEN-HIER \
  --set rbac.create=true \
  --set runners.privileged=false \
  --set runners.tags="kubernetes"
```

**Erklärung der Flags:**
- `rbac.create=true` — erlaubt dem Runner, Pods zu erstellen (nötig)
- `runners.privileged=false` — kein privilegierter Modus (wir nutzen Kaniko statt dind)
- `runners.tags="kubernetes"` — Jobs mit diesem Tag landen auf diesem Runner

### Schritt 6: Runner-Status prüfen

```bash
# Pod-Status anzeigen
kubectl get pods -n gitlab-runner

# Logs anzeigen (Runner sollte "Listening for jobs" melden)
kubectl logs -n gitlab-runner -l app=gitlab-runner -f
```

Erwartete Ausgabe in den Logs:
```
Configuration loaded                                builds=0
Listening for jobs
```

### Schritt 7: In GitLab prüfen

GitLab → Projekt → Settings → CI/CD → Runners

Der Runner sollte mit grünem Punkt als "Online" erscheinen.

### Schritt 8: Kaniko — Registry-Zugang als Kubernetes Secret anlegen

Kaniko braucht Zugangsdaten für die GitLab Registry. Diese werden als Kubernetes Secret gespeichert.

```bash
# Secret für GitLab Registry erstellen
# CI_REGISTRY: z.B. registry.gitlab.com
# CI_REGISTRY_USER: dein GitLab-Username oder "gitlab-ci-token"
# CI_REGISTRY_PASSWORD: dein Access Token oder CI-Token

kubectl create secret docker-registry gitlab-registry-secret \
  --namespace gitlab-runner \
  --docker-server=registry.gitlab.com \
  --docker-username=DEIN_GITLAB_USERNAME \
  --docker-password=DEIN_GITLAB_ACCESS_TOKEN
```

Alternativ: In der Pipeline mit CI/CD-Variablen lösen (siehe Abschnitt 5).

---

## 5. Angepasste .gitlab-ci.yml

```yaml
stages:
  - build
  - package

variables:
  IMAGE_NAME: $CI_REGISTRY_IMAGE/frontend
  IMAGE_TAG: $CI_COMMIT_SHORT_SHA

build-frontend:
  stage: build
  # Tag sorgt dafür, dass dieser Job auf dem Kubernetes-Runner läuft
  tags:
    - kubernetes
  # image: wird jetzt tatsächlich als Container gestartet (Kubernetes-Executor)
  image: node:20-alpine
  cache:
    key: "$CI_COMMIT_REF_SLUG"
    paths:
      - frontend/node_modules/
  script:
    - cd frontend
    - npm ci
    - npm run build
  artifacts:
    name: frontend-dist
    paths:
      - frontend/dist/
    expire_in: 1 hour

build-and-push-image:
  stage: package
  # Tag für Kubernetes-Runner
  tags:
    - kubernetes
  # Kaniko-Image ersetzt docker:24 + docker:24-dind
  # debug-Variante hat eine Shell (nötig für before_script)
  image:
    name: gcr.io/kaniko-project/executor:v1.23.2-debug
    entrypoint: [""]
  # Keine services: mehr — kein dind nötig
  # variables: DOCKER_TLS_CERTDIR nicht mehr nötig
  before_script:
    # Kaniko liest Registry-Zugangsdaten aus /kaniko/.docker/config.json
    - mkdir -p /kaniko/.docker
    - echo "{\"auths\":{\"$CI_REGISTRY\":{\"auth\":\"$(printf "%s:%s" "$CI_REGISTRY_USER" "$CI_REGISTRY_PASSWORD" | base64 | tr -d '\n')\"}}}" > /kaniko/.docker/config.json
  script:
    # Kaniko baut und pusht direkt — kein docker build, kein docker push
    - /kaniko/executor
        --context "${CI_PROJECT_DIR}/frontend"
        --dockerfile "${CI_PROJECT_DIR}/frontend/Dockerfile"
        --destination "$IMAGE_NAME:$IMAGE_TAG"
        --destination "$IMAGE_NAME:latest"
        --cache=true
        --cache-repo "$CI_REGISTRY_IMAGE/cache"
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

### Was sich ändert und warum

| Was | Vorher | Nachher | Grund |
|---|---|---|---|
| `tags:` | fehlt | `- kubernetes` | Routing auf Kubernetes-Runner |
| `image:` in build-job | wird ignoriert | wird gestartet | k8s-Executor nutzt images wirklich |
| `image:` in package-job | `docker:24` | `kaniko:...-debug` | Kaniko ersetzt Docker |
| `services:` | `docker:24-dind` | entfernt | Kaniko braucht keinen Daemon |
| `DOCKER_TLS_CERTDIR` | gesetzt | entfernt | war nur für dind nötig |
| `before_script` | docker login | kaniko config.json schreiben | Kaniko-eigenes Auth-Format |
| `script` | docker build + push | kaniko executor | Kaniko macht beides in einem Schritt |

### Kaniko `--cache` Erklärung

```yaml
--cache=true
--cache-repo "$CI_REGISTRY_IMAGE/cache"
```

Kaniko kann Layer-Cache in der GitLab Registry speichern. Das beschleunigt wiederholte Builds erheblich (vor allem `npm install`-Layer). Beim ersten Build wird der Cache aufgebaut, danach genutzt.

---

## 6. Was bleibt wie es ist

Folgendes muss nicht geändert werden:

- **Das Dockerfile** (`frontend/Dockerfile`) — Kaniko liest dasselbe Dockerfile wie Docker
- **Die GitLab Registry** — gleiche Registry, gleiche Zugangsdaten (`$CI_REGISTRY_*`)
- **Die CI-Variablen** `$CI_REGISTRY`, `$CI_REGISTRY_USER`, `$CI_REGISTRY_PASSWORD`, `$CI_REGISTRY_IMAGE` — diese werden von GitLab automatisch gesetzt
- **`$CI_COMMIT_SHORT_SHA`** und andere GitLab-Variablen — funktionieren genauso
- **Der `stages:`-Block** — build vor package, bleibt identisch
- **`artifacts:`** — Frontend-Build-Artefakt wird weitergegeben, gleiche Mechanik
- **`cache:`** — npm-Cache-Logik bleibt gleich (Kubernetes-Executor unterstützt GitLab-Cache)
- **`rules:`** — nur auf `main`-Branch packen, bleibt identisch

---

## 7. Risiken und Fallstricke

### arm64 / Apple Silicon spezifisch

**Image-Verfügbarkeit**

Nicht alle Docker-Images haben arm64-Varianten. Wenn ein CI-Job ein x86-only Image nutzt, gibt es Probleme.

Prüfen ob ein Image arm64 unterstützt:
```bash
docker buildx imagetools inspect node:20-alpine | grep -i platform
```

Für dieses Projekt: `node:20-alpine` und `gcr.io/kaniko-project/executor` sind multi-arch und unterstützen arm64.

**Kaniko auf arm64**

Kaniko baut das Image für die Architektur des laufenden Pods. Auf Apple Silicon (arm64) produziert Kaniko standardmäßig arm64-Images. Wenn das Image später auf x86-Servern deployed werden soll, muss Cross-Compilation konfiguriert werden:

```yaml
# Multi-arch Build (arm64 + amd64) — für später / optional
script:
  - /kaniko/executor
      --context "${CI_PROJECT_DIR}/frontend"
      --dockerfile "${CI_PROJECT_DIR}/frontend/Dockerfile"
      --destination "$IMAGE_NAME:$IMAGE_TAG"
      --custom-platform linux/amd64
      --custom-platform linux/arm64
```

Alternativ: Kaniko `--custom-platform linux/amd64` setzen wenn das Deployment-Ziel x86 ist.

### Kubernetes-spezifisch

**Cache-Persistenz**

Der npm-Cache (`frontend/node_modules/`) funktioniert über GitLab's Distributed Cache (S3 oder GitLab selbst). Beim lokalen Cluster ohne S3 kann der Cache-Upload langsam oder fehlerhaft sein. Im Zweifelsfall `cache:` in der CI-Konfiguration temporär deaktivieren und beobachten ob Jobs durchlaufen.

**DNS-Auflösung im Pod**

Wenn `npm ci` auf private Packages zugreift oder der GitLab-Server nicht öffentlich erreichbar ist, muss DNS im Kubernetes-Cluster korrekt konfiguriert sein. Bei OrbStack ist das automatisch der Fall.

**Kaniko Registry-Push schlägt fehl**

Häufigster Fehler: das `config.json` für Kaniko ist falsch formatiert oder der Token hat keine Push-Berechtigung.

Debugging:
```bash
# Pod-Logs eines fehlgeschlagenen Jobs anschauen
kubectl get pods -n gitlab-runner
kubectl logs -n gitlab-runner POD_NAME
```

**Runner registriert sich nicht**

Falls der Runner-Pod startet aber "Offline" in GitLab zeigt:
```bash
# Logs des Runner-Pods prüfen
kubectl logs -n gitlab-runner -l app=gitlab-runner

# Häufige Ursache: falscher Token oder falsche gitlabUrl
# Runner neu installieren mit korrekten Werten:
helm upgrade gitlab-runner gitlab/gitlab-runner \
  --namespace gitlab-runner \
  --set gitlabUrl=https://gitlab.com \
  --set runnerToken=NEUER_TOKEN
```

**Privileged-Mode-Fehler**

Falls trotzdem ein Job mit `docker:dind` auf den Kubernetes-Runner geroutet wird (z.B. weil `tags:` fehlt), wird der Job mit einem Fehler wie `operation not permitted` fehlschlagen. Lösung: sicherstellen dass alle Jobs `tags: [kubernetes]` haben, oder `runners.privileged=true` im Helm Chart setzen (nicht empfohlen).

### Lokaler Betrieb (nicht Produktion)

Der Cluster auf dem Mac ist nicht hochverfügbar. Bei Neustart des Macs startet OrbStack/Kubernetes automatisch wieder, der GitLab Runner Deployment kommt von selbst hoch. Trotzdem: wenn der Mac aus ist, laufen keine Pipelines. Das ist für lokale Entwicklung akzeptabel.

---

## Zusammenfassung: Reihenfolge der Umsetzung

```
1. OrbStack installieren und Kubernetes aktivieren          → 5 Minuten
2. Helm installieren                                         → 2 Minuten
3. gitlab-runner Namespace erstellen                         → 1 Minute
4. GitLab: neuen Runner anlegen, Token kopieren              → 5 Minuten
5. Helm Chart installieren (mit Token)                       → 5 Minuten
6. Runner-Status in GitLab prüfen (grüner Punkt)             → 2 Minuten
7. .gitlab-ci.yml anpassen (tags + Kaniko)                   → 10 Minuten
8. Pipeline pushen und beobachten                            → erste Pipeline
```

Gesamtaufwand: ca. 30 Minuten für die initiale Einrichtung.

---

## Optional / Später

- **Multi-arch Images mit Kaniko** (arm64 + amd64) wenn Deployment auf x86-Server geplant
- **Kubernetes-Runner mit eigenem ServiceAccount und eingeschränkten RBAC-Rechten** für mehr Sicherheit
- **PersistentVolumeClaim für npm-Cache** wenn GitLab-Distributed-Cache nicht ausreicht
- **Runner auf dediziertem Server/VPS** statt lokalem Mac wenn 24/7-Pipelines benötigt werden
- **Helm Values-Datei** statt Inline-Flags für reproduzierbare Runner-Konfiguration:

```yaml
# gitlab-runner-values.yaml
gitlabUrl: https://gitlab.com
runnerToken: "glrt-..."
rbac:
  create: true
runners:
  privileged: false
  tags: "kubernetes"
  cache:
    cacheType: s3  # optional, für besseren Cache
```

```bash
helm install gitlab-runner gitlab/gitlab-runner \
  --namespace gitlab-runner \
  -f gitlab-runner-values.yaml
```
