# kubectl apply — aus CI/CD-Sicht erklärt

Zielgruppe: Entwickler, der CI/CD und Kubernetes gerade zusammen lernt.

---

## 1. Einmalig vs. jedes Mal — der grundlegende Unterschied

### Was `kubectl apply -f k8s/frontend/` tut

Dieser Befehl liest drei YAML-Dateien und schickt sie an die Kubernetes-API:

```
k8s/frontend/
├── deployment.yaml   → erstellt das Deployment "frontend"
├── service.yaml      → erstellt den Service "frontend"
└── ingress.yaml      → erstellt den Ingress "frontend"
```

Kubernetes vergleicht dabei: "Gibt es dieses Objekt schon?"

- Nein → es wird erstellt (CREATE)
- Ja, aber anders → es wird angepasst (PATCH)
- Ja, identisch → nichts passiert

**Typische Ausgabe beim ersten Mal:**
```
deployment.apps/frontend created
service/frontend created
ingress.networking.k8s.io/frontend created
```

**Typische Ausgabe beim zweiten Mal (wenn nichts geändert):**
```
deployment.apps/frontend unchanged
service/frontend unchanged
ingress.networking.k8s.io/frontend unchanged
```

### Warum die Pipeline `kubectl set image` statt `kubectl apply` nutzt

Die Pipeline macht in `deploy-frontend` genau das:

```yaml
script:
  - kubectl set image deployment/frontend
      frontend=$FRONTEND_IMAGE:$IMAGE_TAG
      -n up2daite-staging
  - kubectl rollout status deployment/frontend
      -n $KUBE_NAMESPACE
      --timeout=120s
```

`kubectl set image` ist ein chirurgischer Eingriff: Er ändert **nur den Image-Tag** im Deployment. Das ist schneller, sicherer, und braucht keine YAML-Datei zur Laufzeit.

`kubectl apply -f` würde bedeuten: die Pipeline muss den aktuellen `IMAGE_TAG` in die YAML-Datei hineinschreiben, dann das gesamte Manifest schicken. Das funktioniert auch — ist aber komplizierter (braucht `envsubst` oder `sed`) und birgt mehr Fehlerquellen.

**Faustregel:**
- `kubectl apply -f` → Einrichtungsschritt, einmalig oder selten, meistens manuell oder in einem Setup-Job
- `kubectl set image` → Deployment-Schritt, bei jedem Commit, immer automatisch

---

## 2. Was passiert beim ersten Deploy über die Pipeline?

**Voraussetzung:** `kubectl apply -f k8s/namespace.yaml` und `kubectl apply -f k8s/frontend/` wurden bereits einmalig manuell ausgeführt. Das Deployment existiert im Cluster, läuft aber noch mit dem Placeholder-Image aus `deployment.yaml`:

```yaml
image: registry.gitlab.com/DEIN_GITLAB_USER/up2daite/frontend:latest
```

Jetzt wird Code gepusht und die Pipeline startet.

### Stage 1: build-frontend

```
node:20-alpine Container startet
cd frontend && npm ci && npm run build
```

Das Frontend wird kompiliert, das `dist/`-Verzeichnis entsteht. Keine Kubernetes-Interaktion.

### Stage 2: package-frontend

```
kaniko baut das Docker-Image aus frontend/Dockerfile
Image wird gepusht nach:
  registry.gitlab.com/.../frontend:abc1234   ← IMAGE_TAG = Commit-SHA
  registry.gitlab.com/.../frontend:latest
```

Das Image liegt jetzt in der GitLab Registry. Kubernetes weiß noch nichts davon.

### Stage 3: deploy-frontend

```
kubectl set image deployment/frontend \
  frontend=registry.gitlab.com/.../frontend:abc1234 \
  -n up2daite-staging
```

**Was Kubernetes intern macht:**
1. Deployment-Objekt wird aktualisiert: Image-Feld wechselt von `latest` auf `abc1234`
2. Kubernetes erkennt: Soll-Zustand ≠ Ist-Zustand
3. Ein neuer Pod wird gestartet (wegen `maxSurge: 1` darf kurz 1 Pod mehr laufen)
4. Der neue Pod zieht das Image aus der Registry (`imagePullSecrets: gitlab-registry`)
5. Die `readinessProbe` wird geprüft: HTTP GET / auf Port 80
6. Erst wenn die Probe erfolgreich ist, gilt der Pod als "ready"
7. Der alte Pod wird beendet (wegen `maxUnavailable: 0` bleibt Verfügbarkeit erhalten)

---

## 3. Was passiert beim zweiten Deploy?

Entwickler ändert Code, macht einen Commit, pusht. Die Pipeline läuft erneut.

**Was sich ändert:**
- `IMAGE_TAG` ist jetzt eine neue Commit-SHA, z.B. `def5678`
- Kaniko baut ein neues Image und pusht es
- `kubectl set image` setzt den neuen Tag

**Was gleich bleibt:**
- Service existiert bereits, keine Änderung nötig
- Ingress existiert bereits, keine Änderung nötig
- Namespace existiert bereits
- Die Rolling-Update-Strategie läuft identisch ab wie beim ersten Mal

**Was Kubernetes beim zweiten Rollout macht:**

```
VORHER:  Pod "frontend-7d4b8-abc"  →  Image: ...frontend:abc1234  (running)
         kubectl set image ...frontend:def5678
NACHHER: Pod "frontend-9f2c1-xyz"  →  Image: ...frontend:def5678  (starting)
         → readinessProbe OK
         → alter Pod "frontend-7d4b8-abc" wird beendet
```

Der Wechsel ist unterbrechungsfrei, weil `maxUnavailable: 0` im Deployment definiert ist.

---

## 4. Warum ist `kubectl rollout status` in der Pipeline wichtig?

```yaml
- kubectl rollout status deployment/frontend
    -n $KUBE_NAMESPACE
    --timeout=120s
```

`kubectl set image` kehrt sofort zurück — es schickt nur den Befehl an die API. Ob der neue Pod tatsächlich gestartet ist, weiß die Pipeline an diesem Punkt noch nicht.

`kubectl rollout status` wartet und beobachtet:

**Erfolgreiche Ausgabe:**
```
Waiting for deployment "frontend" rollout to finish: 0 of 1 updated replicas are available...
deployment "frontend" successfully rolled out
```

**Fehlerhafte Ausgabe (Pod startet nicht):**
```
Waiting for deployment "frontend" rollout to finish: 0 of 1 updated replicas are available...
error: timed out waiting for the condition
```

Beim Timeout gibt `kubectl rollout status` **Exit Code 1** zurück. Die Pipeline markiert den Job als fehlgeschlagen. GitLab zeigt rot.

**Was passiert wenn dieser Befehl fehlt:**

1. `kubectl set image` gibt Exit Code 0 zurück
2. Pipeline-Job gilt als erfolgreich — grüner Haken
3. In Wirklichkeit crasht der neue Pod in einer Schleife (CrashLoopBackOff)
4. Der Entwickler sieht grün in GitLab, die App ist aber kaputt
5. Der Fehler wird erst beim manuellen Test oder Monitoring entdeckt

`kubectl rollout status` ist der Unterschied zwischen "Befehl abgeschickt" und "Deployment wirklich erfolgreich".

---

## 5. Was bedeutet `environment: staging` in GitLab?

```yaml
environment:
  name: staging
  url: http://up2daite.local
```

Dieser Block registriert eine Deployment-Umgebung in GitLab. Was der Entwickler in der UI sieht:

**Unter Operate → Environments:**
- Eine Zeile "staging" mit Status, letztem Deployment, Commit-SHA
- Ein direkter Link auf `http://up2daite.local`
- Eine Liste aller bisherigen Deployments mit Zeitstempel und wer sie ausgelöst hat

**Weitere Features die dadurch freigeschaltet werden:**

- **Rollback per Klick:** GitLab kann einen früheren erfolgreichen Deployment-Job erneut auslösen
- **Stop-Aktion:** Optional kann ein Job definiert werden der die Umgebung herunterfährt
- **Deployment-Tracking:** Welcher Commit läuft gerade in staging? GitLab weiß es und zeigt es im Merge Request

**Was der Entwickler im Merge Request sieht:**

Wenn ein Merge Request in staging deployed wurde, erscheint ein "View deployment"-Button direkt im MR. Ein Klick öffnet `http://up2daite.local`.

---

## 6. Die häufige Falle: grüne Pipeline, kaputte App

**Szenario:** Der deploy-Job ist erfolgreich, aber der Pod läuft nicht.

Das kann passieren weil `kubectl rollout status` zwar wartet — aber nur bis zum Timeout. Wenn der Pod beim Start abstürzt und Kubernetes ihn sofort neu startet (CrashLoopBackOff), kann das so aussehen:

```
Waiting for deployment "frontend" rollout to finish: 0 of 1 updated replicas are available...
error: timed out waiting for the condition
```

Pipeline schlägt fehl. Gut so.

**Aber es gibt einen tückischeren Fall:**

Der Pod startet, die readinessProbe schlägt einige Sekunden lang fehl, dann wird er als ready markiert — und erst danach fängt er an zu crashen (weil z.B. eine Umgebungsvariable fehlt, die erst beim ersten Request gebraucht wird).

In diesem Fall:
1. `kubectl rollout status` meldet Erfolg (der Pod war kurz ready)
2. Pipeline ist grün
3. Der Pod crasht danach in der Produktion

**Was dann zu tun ist:**

```bash
# Pods im Namespace anzeigen
kubectl get pods -n up2daite-staging

# Ausgabe zeigt:
# NAME                        READY   STATUS             RESTARTS   AGE
# frontend-9f2c1-xyz          0/1     CrashLoopBackOff   3          2m

# Logs des crashenden Pods anzeigen
kubectl logs deployment/frontend -n up2daite-staging

# Wenn der Pod schon tot ist, letzte Logs:
kubectl logs deployment/frontend -n up2daite-staging --previous

# Details zum Pod (Events, Fehlermeldungen):
kubectl describe pod frontend-9f2c1-xyz -n up2daite-staging
```

**Schutz dagegen:**

Die Kombination aus `readinessProbe` und `livenessProbe` im `deployment.yaml` hilft bereits:

```yaml
readinessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 5
  periodSeconds: 10

livenessProbe:
  httpGet:
    path: /
    port: 80
  initialDelaySeconds: 15
  periodSeconds: 20
  failureThreshold: 3
```

- Die `readinessProbe` verhindert, dass ein halbfertig gestarteter Pod Traffic bekommt
- Die `livenessProbe` stellt sicher, dass ein hängender Pod neugestartet wird
- Aber: beide Probes prüfen nur `/` auf Port 80 — tiefere Fehler (fehlende Env-Vars, DB-Verbindung) werden damit nicht erkannt

Für robustere Pipelines: Monitoring-Alerts oder ein Post-Deploy-Test-Job der nach dem Rollout kurz die echte App prüft.

---

## Zusammenfassung

| Aktion | Wer | Wann |
|---|---|---|
| `kubectl apply -f k8s/namespace.yaml` | Entwickler manuell | Einmalig beim Setup |
| `kubectl apply -f k8s/frontend/` | Entwickler manuell | Einmalig beim Setup, bei Strukturänderungen |
| `kubectl set image ...` | Pipeline automatisch | Bei jedem Commit |
| `kubectl rollout status ...` | Pipeline automatisch | Nach jedem `set image` |

Die Pipeline ist kein Ersatz für das initiale Setup — sie ist der schnelle, sichere Weg um ein bereits existierendes Deployment mit einem neuen Image zu aktualisieren.
