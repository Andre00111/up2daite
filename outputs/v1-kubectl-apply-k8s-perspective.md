# Was passiert intern bei `kubectl apply` — Kubernetes-Perspektive

Zielgruppe: Entwickler, der Kubernetes gerade lernt. Kein Ops-Hintergrund erforderlich.

---

## Überblick: Die zwei Befehle

```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/frontend/
```

Diese zwei Befehle erstellen den kompletten Stack: Namespace, Deployment, Service und Ingress.  
Klingt einfach — dahinter steckt ein durchdachtes System. Schauen wir es uns Schritt für Schritt an.

---

## 1. Was macht `kubectl apply` intern mit dem API-Server?

### Der Weg eines YAML-Files bis in den Cluster

`kubectl apply` ist kein direktes "Tu das jetzt"-Kommando. Es ist eine **deklarative Anfrage**: "Ich möchte, dass dieser Zustand existiert."

**Was kubectl dabei tut:**

```
Dein Terminal
    │
    │  1. YAML einlesen & validieren (client-seitig)
    ▼
kubectl (lokal)
    │
    │  2. HTTP PATCH/POST an den API-Server
    │     z.B. POST /api/v1/namespaces
    ▼
kube-apiserver
    │
    │  3. Authentifizierung (wer bist du?)
    │  4. Autorisierung (darfst du das?)
    │  5. Admission Control (ist das sinnvoll/gültig?)
    │  6. Persistierung in etcd
    ▼
etcd (die Datenbank des Clusters)
```

### Was "apply" von "create" unterscheidet

`kubectl create` schlägt fehl, wenn das Objekt schon existiert.  
`kubectl apply` vergleicht: Was steht im YAML? Was existiert gerade im Cluster? Was muss sich ändern?

Dafür nutzt Kubernetes eine Annotation, die beim ersten `apply` automatisch gesetzt wird:

```yaml
kubectl.kubernetes.io/last-applied-configuration: '{"apiVersion":"v1","kind":"Namespace",...}'
```

Beim zweiten `apply` berechnet kubectl einen **3-Wege-Merge**:
- Was war der letzte `apply`-Stand? (Annotation)
- Was steht jetzt im YAML?
- Was existiert aktuell im Cluster?

Nur die Differenz wird gepatcht — nicht das gesamte Objekt überschrieben.

### Was nach dem API-Server passiert

Der API-Server speichert den **gewünschten Zustand** in etcd. Das war's erstmal für kubectl.  
Den Rest übernehmen Controller im Hintergrund — dazu gleich mehr.

---

## 2. Reihenfolge bei `kubectl apply -f k8s/frontend/`

### Was kubectl macht

Kubernetes wendet alle YAML-Dateien in einem Verzeichnis **alphabetisch** an:

```
deployment.yaml  →  zuerst
ingress.yaml     →  dann
service.yaml     →  zuletzt
```

### Spielt die Reihenfolge eine Rolle?

**Kurzantwort: Meistens nein — aber es gibt Nuancen.**

Kubernetes ist **asynchron und selbstheilend**. Wenn der Ingress angelegt wird, bevor der Service existiert, passiert Folgendes:

1. Ingress wird gespeichert (API-Server akzeptiert ihn)
2. Der Ingress-Controller bemerkt: "Der referenzierte Service `frontend` existiert noch nicht"
3. Sobald der Service erscheint, konfiguriert der Ingress-Controller sich selbst nach

Das System **konvergiert** — es wartet nicht, sondern versucht kontinuierlich, den gewünschten Zustand herzustellen.

**Ausnahmen — hier spielt Reihenfolge eine Rolle:**

| Situation | Problem |
|-----------|---------|
| Namespace existiert nicht | Objekte im Namespace schlagen fehl → daher erst `namespace.yaml` |
| Secret fehlt beim Pod-Start | Pod startet nicht, wenn `imagePullSecret` nicht existiert |
| ConfigMap fehlt | Pod crasht, wenn er eine fehlende ConfigMap als Volume mountet |

Deswegen ist es eine gute Praxis:
```bash
kubectl apply -f k8s/namespace.yaml   # erst Namespace
kubectl apply -f k8s/frontend/        # dann alles darin
```

---

## 3. Was passiert im Cluster nach dem Apply?

Nach dem `apply` ist der gewünschte Zustand in etcd gespeichert. Jetzt werden verschiedene Kubernetes-Komponenten aktiv — sie **beobachten etcd** und reagieren auf Änderungen.

### Die Kette der Ereignisse

```
etcd: "Neues Deployment: frontend, replicas: 1"
        │
        ▼
[Deployment-Controller]
  └─ Erstellt ReplicaSet: frontend-7d9f8b6c4
        │
        ▼
[ReplicaSet-Controller]
  └─ Erstellt Pod-Objekt: frontend-7d9f8b6c4-xk2p9
     (nur das Objekt in etcd — noch kein Container!)
        │
        ▼
[Scheduler]
  └─ Sucht einen passenden Node
  └─ Prüft: CPU-Request 50m, Memory-Request 32Mi — welcher Node hat Kapazität?
  └─ Bindet Pod an Node: node1
        │
        ▼
[kubelet auf node1]
  └─ Sieht: "Ich soll Pod frontend-7d9f8b6c4-xk2p9 ausführen"
  └─ Ruft Container Runtime (z.B. containerd) auf
  └─ Pulled Image: registry.gitlab.com/user/todoapp/frontend:latest
  └─ Startet Container
  └─ Startet Readiness- und Liveness-Probes
```

### Wer macht was — eine Übersicht

| Komponente | Aufgabe in diesem Beispiel |
|------------|---------------------------|
| **kube-apiserver** | Nimmt YAML entgegen, validiert, speichert in etcd |
| **etcd** | Datenbank — speichert den gesamten Cluster-Zustand |
| **Deployment-Controller** | Erstellt ReplicaSet aus dem Deployment-Spec |
| **ReplicaSet-Controller** | Erstellt Pod-Objekte (noch nicht gestartet) |
| **Scheduler** | Entscheidet: welcher Node führt den Pod aus |
| **kubelet** | Startet den Container auf dem zugewiesenen Node |
| **kube-proxy** | Richtet Netzwerkregeln für den Service ein |
| **Ingress-Controller** | Konfiguriert nginx-Routing für `todoapp.local` |

### Warum sind Controller getrennt?

Das ist das **Controller-Pattern** von Kubernetes: Jede Komponente ist für genau eine Aufgabe zuständig und reagiert auf Änderungen in etcd. Keine Komponente "wartet" — alle beobachten kontinuierlich.

---

## 4. Wann ist der Pod "bereit"?

"Bereit" heißt in Kubernetes: Der Pod empfängt Traffic vom Service. Das ist erst nach mehreren Schritten der Fall.

### Der vollständige Weg zum Ready-Status

```
1. Pod-Objekt erstellt (Status: Pending)
        │
2. Scheduler weist Node zu (Status: Pending → Scheduled)
        │
3. kubelet pulled das Image
   → bei "latest" immer ein Pull-Versuch
   → braucht Zugangsdaten: Secret "gitlab-registry" muss existieren!
        │
4. Container startet (Status: Running)
        │
5. initialDelaySeconds: 5 abwarten
        │
6. ReadinessProbe: GET http://localhost/
   → muss HTTP 200 zurückgeben
   → wird alle 10 Sekunden wiederholt (periodSeconds: 10)
        │
7. Erste erfolgreiche ReadinessProbe → Pod: Ready = True
        │
8. kube-proxy aktualisiert iptables/ipvs → Traffic fließt zum Pod
```

### Die Probes im Detail

**ReadinessProbe** — beantwortet: "Ist der Pod bereit für Traffic?"
```yaml
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5   # 5s warten bevor erste Probe
  periodSeconds: 10         # dann alle 10s prüfen
```
Solange die ReadinessProbe nicht erfolgreich ist, schickt der Service **keinen Traffic** zu diesem Pod. Das ist beim RollingUpdate besonders wichtig (dazu gleich mehr).

**LivenessProbe** — beantwortet: "Lebt der Pod noch?"
```yaml
livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 15    # 15s warten
  periodSeconds: 20          # alle 20s prüfen
  failureThreshold: 3        # nach 3 Fehlern: Container neu starten
```
Wenn die LivenessProbe 3-mal scheitert, **tötet kubelet den Container** und startet ihn neu. Der Pod bleibt, der Container wird ersetzt.

### Direkt beobachten

```bash
kubectl get pods -n todoapp-staging -w
```

Ausgabe während des Starts:
```
NAME                        READY   STATUS              RESTARTS   AGE
frontend-7d9f8b6c4-xk2p9   0/1     Pending             0          0s
frontend-7d9f8b6c4-xk2p9   0/1     ContainerCreating   0          2s
frontend-7d9f8b6c4-xk2p9   0/1     Running             0          8s
frontend-7d9f8b6c4-xk2p9   1/1     Running             0          13s  ← Ready!
```

`0/1` bedeutet: 0 von 1 Containern sind ready.  
`1/1` bedeutet: bereit — Traffic fließt.

---

## 5. Idempotenz — was passiert beim zweiten `kubectl apply`?

### Das Wichtigste vorweg

`kubectl apply` ist **idempotent**: Mehrfaches Ausführen mit demselben YAML ändert nichts, wenn sich nichts geändert hat.

```bash
kubectl apply -f k8s/namespace.yaml
# → namespace/todoapp-staging configured  (beim ersten Mal)
# → namespace/todoapp-staging unchanged   (beim zweiten Mal)
```

### Drei mögliche Ausgaben

| Ausgabe | Bedeutung |
|---------|-----------|
| `created` | Objekt existierte nicht — wurde neu erstellt |
| `configured` | Objekt existierte — wurde gepatcht (Diff gefunden) |
| `unchanged` | Objekt existierte — kein Unterschied festgestellt |

### Was passiert intern beim zweiten Apply

1. kubectl liest das YAML
2. kubectl fragt: "Existiert `frontend` Deployment in `todoapp-staging` schon?"
3. Kubernetes vergleicht (3-Wege-Merge):
   - Letzter `apply`-Stand (Annotation)
   - Aktuelles YAML
   - Aktueller Cluster-Zustand
4. Kein Unterschied → kubectl sendet gar keinen Patch → `unchanged`

### Beispiel: Wenn sich das YAML ändert

Du änderst `replicas: 1` zu `replicas: 2`:

```bash
kubectl apply -f k8s/frontend/deployment.yaml
# → deployment.apps/frontend configured
```

Kubernetes berechnet den Diff, patcht nur das `replicas`-Feld. Der Deployment-Controller reagiert und erstellt einen zweiten Pod.

### Das RollingUpdate bei Image-Änderung

Das Deployment ist mit `RollingUpdate` konfiguriert:

```yaml
strategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 0   # kein Pod wird abgeschaltet bevor neuer bereit ist
    maxSurge: 1         # 1 zusätzlicher Pod darf temporär existieren
```

Wenn du ein neues Image deployst (`frontend:v2`):

```
Schritt 1: Neuer Pod mit v2 startet (jetzt: 2 Pods total)
Schritt 2: ReadinessProbe des neuen Pods muss 200 OK liefern
Schritt 3: Erst dann wird der alte Pod (v1) terminiert
Schritt 4: Wenn alter Pod weg: 1 Pod mit v2 läuft
```

`maxUnavailable: 0` garantiert: Während des Updates ist **immer mindestens 1 Pod** für Traffic verfügbar. Zero-Downtime-Deployment.

---

## 6. Was kann schiefgehen — und woran erkennt man es?

### Das erste Diagnosetool

```bash
kubectl get all -n todoapp-staging
```

```
NAME                            READY   STATUS             RESTARTS   AGE
pod/frontend-7d9f8b6c4-xk2p9   0/1     ImagePullBackOff   0          2m

NAME               TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
service/frontend   ClusterIP   10.96.143.201   <none>        80/TCP    2m

NAME                       READY   UP-TO-DATE   AVAILABLE   DEPLOYMENT
deployment.apps/frontend   0/1     1            0           2m
```

`0/1 AVAILABLE` im Deployment — es läuft noch nichts.

---

### Problem 1: ImagePullBackOff

**Symptom:**
```bash
kubectl get pods -n todoapp-staging
# STATUS: ImagePullBackOff oder ErrImagePull
```

**Details:**
```bash
kubectl describe pod frontend-7d9f8b6c4-xk2p9 -n todoapp-staging
```

Im Abschnitt `Events`:
```
Failed to pull image "registry.gitlab.com/...": 
  unauthorized: HTTP Basic: Access denied
```

**Ursache:** Das Secret `gitlab-registry` fehlt oder enthält falsche Zugangsdaten.

**Fix:**
```bash
# Secret erstellen (einmalig)
kubectl create secret docker-registry gitlab-registry \
  --docker-server=registry.gitlab.com \
  --docker-username=<user> \
  --docker-password=<token> \
  -n todoapp-staging
```

---

### Problem 2: Pod startet, bleibt aber auf 0/1 (nicht Ready)

**Symptom:**
```bash
kubectl get pods -n todoapp-staging
# NAME                        READY   STATUS    RESTARTS
# frontend-7d9f8b6c4-xk2p9   0/1     Running   0
```

Status `Running`, aber `0/1` Ready — die ReadinessProbe schlägt fehl.

**Details:**
```bash
kubectl describe pod frontend-7d9f8b6c4-xk2p9 -n todoapp-staging
```

Im Abschnitt `Events`:
```
Readiness probe failed: HTTP probe failed with statuscode: 503
```

**Ursachen:**
- Die App ist noch nicht fertig hochgefahren (erhöhe `initialDelaySeconds`)
- Die App gibt auf `/` keinen 200 zurück
- Falscher Port konfiguriert

---

### Problem 3: CrashLoopBackOff

**Symptom:**
```bash
NAME                        READY   STATUS             RESTARTS
frontend-7d9f8b6c4-xk2p9   0/1     CrashLoopBackOff   4
```

Der Container startet, crasht sofort, kubelet versucht es wieder — mit wachsendem Delay (10s, 20s, 40s...).

**Logs ansehen:**
```bash
kubectl logs frontend-7d9f8b6c4-xk2p9 -n todoapp-staging

# Vorherigen Container-Log (nach Restart):
kubectl logs frontend-7d9f8b6c4-xk2p9 -n todoapp-staging --previous
```

**Typische Ursachen:**
- App braucht Env-Variable, die nicht gesetzt ist
- Port-Konflikt
- Fehlende Dateien oder falsche Konfiguration im Image

---

### Problem 4: Namespace fehlt

Wenn du `kubectl apply -f k8s/frontend/` ausführst, **bevor** der Namespace existiert:

```bash
Error from server (NotFound): 
  error when creating "k8s/frontend/deployment.yaml": 
  namespaces "todoapp-staging" not found
```

**Fix:** Immer erst `kubectl apply -f k8s/namespace.yaml`.

---

### Problem 5: Ingress liefert keinen Traffic

Der Pod läuft und ist Ready, aber `http://todoapp.local` antwortet nicht.

**Diagnose-Schritte:**

```bash
# Ist der Ingress konfiguriert?
kubectl get ingress -n todoapp-staging
# ADDRESS-Spalte sollte eine IP zeigen

# Ist der Ingress-Controller überhaupt installiert?
kubectl get pods -n ingress-nginx

# Details zum Ingress:
kubectl describe ingress frontend -n todoapp-staging
```

**Typische Ursache:** `ingressClassName: nginx` — der Ingress-Controller muss im Cluster installiert sein (z.B. via `helm install ingress-nginx`).

Für lokale Entwicklung mit `todoapp.local`: `/etc/hosts` muss einen Eintrag haben:
```
127.0.0.1  todoapp.local
```

---

### Schnelle Diagnose-Checkliste

```bash
# 1. Überblick
kubectl get all -n todoapp-staging

# 2. Pod-Details (Events sind oft entscheidend)
kubectl describe pod <pod-name> -n todoapp-staging

# 3. Logs der App
kubectl logs <pod-name> -n todoapp-staging

# 4. Vorherige Logs (nach Crash)
kubectl logs <pod-name> -n todoapp-staging --previous

# 5. Events im Namespace
kubectl get events -n todoapp-staging --sort-by='.lastTimestamp'
```

`kubectl describe` und `kubectl get events` sind bei 80% der Probleme die erste Anlaufstelle — die Events zeigen genau, was Kubernetes versucht hat und warum es fehlschlug.

---

## Zusammenfassung

```
kubectl apply
    │
    ├─ Validiert YAML client-seitig
    ├─ Sendet HTTP-Request an API-Server
    ├─ API-Server: Auth → Admission → etcd
    │
    └─ Controller-Loop startet:
         Deployment-Controller → ReplicaSet → Pod-Objekt
         Scheduler → Node-Zuweisung
         kubelet → Image pull → Container start
         Probes → Ready-Status
         kube-proxy → Traffic-Routing
         Ingress-Controller → HTTP-Routing
```

Der wichtigste Denkshift beim Lernen von Kubernetes:

> "Ich sage Kubernetes **was** ich will — nicht **wie** es das tun soll."

`kubectl apply` schreibt einen Wunsch in etcd. Der Rest ist das Kubernetes-System, das diesen Wunsch kontinuierlich zu erfüllen versucht — auch wenn zwischendrin Dinge schiefgehen.
