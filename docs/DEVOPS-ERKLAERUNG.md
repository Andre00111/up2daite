# DevOps-Setup erklaert: todoapp.com

> **Dieses Dokument ist dein Guide durch das gesamte DevOps-Setup.**
> Wir starten mit der Vogelperspektive und arbeiten uns spiralfoermig in die Details.

---

## Inhaltsverzeichnis

1. [Das grosse Bild](#1-das-grosse-bild)
2. [Die vier Saeulen: Security, Build, Deploy, Observe](#2-die-vier-saeulen)
3. [CI/CD Pipeline im Detail](#3-cicd-pipeline-im-detail)
4. [Security Tools erklaert](#4-security-tools-erklaert)
5. [Container und Images](#5-container-und-images)
6. [Lokales Development](#6-lokales-development)
7. [Monitoring](#7-monitoring)
8. [Kubernetes-Vorbereitung](#8-kubernetes-vorbereitung)
9. [Versionierung und Release-Workflow](#9-versionierung-und-release-workflow)
10. [Quick Reference](#10-quick-reference)

---

## 1. Das grosse Bild

Bevor wir in Details eintauchen: Was passiert eigentlich, wenn du Code pusht?

```
                            DAS GROSSE BILD
    +-----------------------------------------------------------------+
    |                                                                 |
    |   Developer          GitLab CI/CD           Production          |
    |                                                                 |
    |   +-------+          +------------+         +------------+      |
    |   |       |  push    |            |  deploy |            |      |
    |   |  IDE  | -------> |  Pipeline  | ------> | Container  |      |
    |   |       |          |            |         |            |      |
    |   +-------+          +------------+         +------------+      |
    |       |                    |                      |             |
    |       v                    v                      v             |
    |   Code schreiben     Tests + Scans          App laeuft          |
    |                      Images bauen           Monitoring          |
    |                                                                 |
    +-----------------------------------------------------------------+
```

**Die einfache Wahrheit:** Du schreibst Code, GitLab prueft und verpackt ihn, und am Ende laeuft deine App in einem Container.

### Warum dieser ganze Aufwand?

Stell dir vor, du wuerdest alles manuell machen:

| Ohne Automatisierung | Mit CI/CD |
|---------------------|-----------|
| "Hab ich die Tests laufen lassen?" | Tests laufen automatisch |
| "Ist da ein Passwort im Code?" | Gitleaks findet es |
| "Funktioniert das Docker-Image?" | Trivy scannt es |
| "Welche Version laeuft gerade?" | Klare Tags: `v1.2.3` |

**Das Ziel:** Du fokussierst dich auf Code, die Pipeline kuemmert sich um den Rest.

---

## 1.5 Service-Architektur im Detail

### Alle Services und ihre Verbindungen

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│                              VOLLSTAENDIGE ARCHITEKTUR                               │
│                                                                                      │
├──────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                      │
│    INTERNET / BROWSER                                                                │
│         │                                                                            │
│         │ http://localhost:3000                                                      │
│         ▼                                                                            │
│    ┌─────────────────────────────────────────────────────┐                           │
│    │                    FRONTEND                          │                           │
│    │                                                      │                           │
│    │  ┌────────────────────────────────────────────────┐ │                           │
│    │  │              nginx-unprivileged                 │ │                           │
│    │  │                  (Port 8080)                    │ │                           │
│    │  │                                                 │ │                           │
│    │  │   /api/*  ──────────┐                           │ │                           │
│    │  │                     │   Proxy zu Backend        │ │                           │
│    │  │   /*      ────────────► index.html (SPA)        │ │                           │
│    │  │                     │                           │ │                           │
│    │  └─────────────────────│───────────────────────────┘ │                           │
│    │                        │                             │                           │
│    │  Image: nginxinc/nginx-unprivileged:alpine          │                           │
│    │  User: nginx (UID 101)                               │                           │
│    └────────────────────────│─────────────────────────────┘                           │
│                             │                                                         │
│                             │ http://backend:8080/api/                                │
│                             ▼                                                         │
│    ┌─────────────────────────────────────────────────────┐                           │
│    │                     BACKEND                          │                           │
│    │                                                      │                           │
│    │  ┌────────────────────────────────────────────────┐ │                           │
│    │  │              Spring Boot + Tomcat               │ │                           │
│    │  │                  (Port 8080)                    │ │                           │
│    │  │                                                 │ │                           │
│    │  │   /api/editions     REST Endpoints              │ │                           │
│    │  │   /api/stories                                  │ │                           │
│    │  │   /api/topics                                   │ │                           │
│    │  │                                                 │ │                           │
│    │  │   /actuator/health   ◄── Healthcheck            │ │                           │
│    │  │   /actuator/prometheus ◄── Metriken             │ │                           │
│    │  │                                                 │ │                           │
│    │  └─────────────────────────────────────────────────┘ │                           │
│    │                                                      │                           │
│    │  Image: eclipse-temurin:21-jre-alpine               │                           │
│    │  User: appuser (UID 1001)                            │                           │
│    └──────────────────────────────────────────────────────┘                           │
│              │                              ▲                                          │
│              │ jdbc:postgresql://           │ scrape alle 15s                         │
│              │ postgres:5432                │ GET /actuator/prometheus                │
│              ▼                              │                                          │
│    ┌──────────────────────┐      ┌─────────┴──────────────────────┐                   │
│    │      POSTGRES        │      │         PROMETHEUS             │                   │
│    │                      │      │                                │                   │
│    │  ┌────────────────┐  │      │  ┌────────────────────────┐   │                   │
│    │  │ PostgreSQL 16  │  │      │  │  Time Series Database  │   │                   │
│    │  │   (Port 5432)  │  │      │  │      (Port 9090)       │   │                   │
│    │  │                │  │      │  │                        │   │                   │
│    │  │  DB: todoapp  │  │      │  │  http_requests_total   │   │                   │
│    │  │  User: todoapp│  │      │  │  jvm_memory_used       │   │                   │
│    │  │                │  │      │  │  hikaricp_connections  │   │                   │
│    │  └────────────────┘  │      │  │  process_cpu_usage     │   │                   │
│    │                      │      │  └────────────────────────┘   │                   │
│    │  Volume: postgres_   │      │                                │                   │
│    │          data        │      │  http://localhost:9090         │                   │
│    └──────────────────────┘      └────────────────────────────────┘                   │
│                                               │                                        │
│                                               │ PromQL Queries                         │
│                                               ▼                                        │
│                                  ┌────────────────────────────────┐                   │
│                                  │          GRAFANA               │                   │
│                                  │                                │                   │
│                                  │  ┌────────────────────────┐   │                   │
│                                  │  │   Dashboard Engine     │   │                   │
│                                  │  │      (Port 3000)       │   │                   │
│                                  │  │                        │   │                   │
│                                  │  │  ┌──────┐ ┌──────┐    │   │                   │
│                                  │  │  │Chart │ │Chart │    │   │                   │
│                                  │  │  └──────┘ └──────┘    │   │                   │
│                                  │  │  ┌──────┐ ┌──────┐    │   │                   │
│                                  │  │  │Chart │ │Chart │    │   │                   │
│                                  │  │  └──────┘ └──────┘    │   │                   │
│                                  │  └────────────────────────┘   │                   │
│                                  │                                │                   │
│                                  │  http://localhost:3001         │                   │
│                                  │  Login: admin / admin          │                   │
│                                  └────────────────────────────────┘                   │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

### Request-Flow: Was passiert bei einem API-Call?

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  BEISPIEL: Browser ruft GET /api/editions auf                                       │
│                                                                                     │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐  │
│  │          │     │          │     │          │     │          │     │          │  │
│  │ Browser  │────►│  nginx   │────►│ Backend  │────►│   JPA    │────►│ Postgres │  │
│  │          │     │          │     │          │     │          │     │          │  │
│  └──────────┘     └──────────┘     └──────────┘     └──────────┘     └──────────┘  │
│       │                │                │                │                │         │
│       │                │                │                │                │         │
│       ▼                ▼                ▼                ▼                ▼         │
│                                                                                     │
│  1. Browser          2. nginx          3. Controller    4. Repository   5. Datenbank │
│     sendet              erkennt           empfaengt        fuehrt          liefert   │
│     Request             /api/*            Request          Query aus       Rows      │
│                         und proxied                                                  │
│                                                                                     │
│  ◄─────────────────────────────────────────────────────────────────────────────────│
│                                                                                     │
│  6. Response fliesst zurueck: Postgres ► JPA ► Backend ► nginx ► Browser            │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Monitoring-Flow: Wie kommen Metriken nach Grafana?

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  METRIKEN-PIPELINE                                                                  │
│                                                                                     │
│  ┌────────────┐                                                                     │
│  │  Backend   │                                                                     │
│  │            │   1. Micrometer sammelt Metriken:                                   │
│  │ Micrometer │      - HTTP Request Count                                           │
│  │     +      │      - Request Duration                                             │
│  │  Actuator  │      - JVM Memory                                                   │
│  │            │      - DB Connection Pool                                           │
│  └─────┬──────┘                                                                     │
│        │                                                                            │
│        │  2. Exponiert unter /actuator/prometheus                                   │
│        │     (Prometheus-Format: Metriken als Text)                                 │
│        ▼                                                                            │
│  ┌────────────┐                                                                     │
│  │ Prometheus │   3. Scraped alle 15 Sekunden                                       │
│  │            │                                                                     │
│  │  scrape    │   4. Speichert in Time Series DB:                                   │
│  │  config:   │      Metrik + Timestamp + Labels                                    │
│  │  backend   │                                                                     │
│  │  :8080     │      http_requests_total{method="GET", uri="/api/editions"} 1234    │
│  │            │      http_requests_total{method="GET", uri="/api/stories"} 567      │
│  └─────┬──────┘                                                                     │
│        │                                                                            │
│        │  5. Grafana queried Prometheus mit PromQL                                  │
│        │     Beispiel: rate(http_requests_total[5m])                                │
│        ▼                                                                            │
│  ┌────────────┐                                                                     │
│  │  Grafana   │   6. Visualisiert als:                                              │
│  │            │      - Line Charts (Zeitverlauf)                                    │
│  │ Dashboard: │      - Gauges (aktuelle Werte)                                      │
│  │ Spring Boot│      - Tables (Breakdown)                                           │
│  │   Backend  │                                                                     │
│  └────────────┘                                                                     │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### CI/CD-Flow: Vom Code zum laufenden Container

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  CI/CD PIPELINE: git push bis Container laeuft                                      │
│                                                                                     │
│  DEVELOPER                 GITLAB                           LOKAL                   │
│  ─────────                 ──────                           ─────                   │
│                                                                                     │
│  ┌─────────┐                                                                        │
│  │git push │                                                                        │
│  └────┬────┘                                                                        │
│       │                                                                             │
│       ▼                                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐               │
│  │                     GITLAB CI/CD RUNNER                          │               │
│  │                                                                  │               │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │               │
│  │  │ SECURITY │    │  BUILD   │    │ PACKAGE  │    │   SCAN   │  │               │
│  │  │          │    │          │    │          │    │          │  │               │
│  │  │ Gitleaks │───►│ npm ci   │───►│ Kaniko   │───►│  Trivy   │  │               │
│  │  │ Semgrep  │    │ mvn      │    │ build    │    │  CVE     │  │               │
│  │  │          │    │ verify   │    │ push     │    │  check   │  │               │
│  │  └──────────┘    └──────────┘    └────┬─────┘    └──────────┘  │               │
│  │                                       │                         │               │
│  └───────────────────────────────────────│─────────────────────────┘               │
│                                          │                                          │
│                                          ▼                                          │
│                              ┌───────────────────────┐                              │
│                              │   GITLAB REGISTRY     │                              │
│                              │                       │                              │
│                              │  frontend:latest      │                              │
│                              │  frontend:abc123      │                              │
│                              │  backend:latest       │                              │
│                              │  backend:abc123       │                              │
│                              │                       │                              │
│                              └───────────┬───────────┘                              │
│                                          │                                          │
│                                          │ docker compose pull                      │
│                                          ▼                                          │
│                              ┌───────────────────────┐                              │
│                              │    DOCKER COMPOSE     │                              │
│                              │      (lokal)          │                              │
│                              │                       │                              │
│                              │  ┌─────┐ ┌─────┐     │                              │
│                              │  │Front│ │Back │     │                              │
│                              │  │end  │ │end  │     │                              │
│                              │  └─────┘ └─────┘     │                              │
│                              │  ┌─────┐ ┌─────┐     │                              │
│                              │  │Prome│ │Graf │     │                              │
│                              │  │theus│ │ana  │     │                              │
│                              │  └─────┘ └─────┘     │                              │
│                              │  ┌─────┐             │                              │
│                              │  │Post │             │                              │
│                              │  │gres │             │                              │
│                              │  └─────┘             │                              │
│                              └───────────────────────┘                              │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### Netzwerk-Ports Zusammenfassung

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                     │
│  PORT-MAPPING: Host <──> Container                                                  │
│                                                                                     │
│  HOST (dein Mac)              DOCKER NETWORK                 CONTAINER              │
│  ───────────────              ──────────────                 ─────────              │
│                                                                                     │
│  localhost:3000  ◄─────────►  frontend:8080   ◄──────────►   nginx :8080           │
│                                    │                                                │
│  localhost:8080  ◄─────────►  backend:8080    ◄──────────►   java  :8080           │
│                                    │                                                │
│  localhost:5432  ◄─────────►  postgres:5432   ◄──────────►   pg    :5432           │
│                                    │                                                │
│  localhost:9090  ◄─────────►  prometheus:9090 ◄──────────►   prom  :9090           │
│                                    │                                                │
│  localhost:3001  ◄─────────►  grafana:3000    ◄──────────►   graf  :3000           │
│                                                                                     │
│  LEGENDE:                                                                           │
│  ─────────                                                                          │
│  localhost:XXXX  = Von deinem Browser erreichbar                                    │
│  service:XXXX    = Im Docker-Netzwerk (Container untereinander)                     │
│  :XXXX           = Port im Container selbst                                         │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Die vier Saeulen

Jedes gute DevOps-Setup basiert auf vier Saeulen:

```
    +------------------+------------------+------------------+------------------+
    |     SECURITY     |      BUILD       |      DEPLOY      |     OBSERVE      |
    +------------------+------------------+------------------+------------------+
    |                  |                  |                  |                  |
    |  Gitleaks        |  npm build       |  Docker Images   |  Prometheus      |
    |  Semgrep         |  mvn package     |  K8s Deployments |  Grafana         |
    |  Trivy           |  Docker build    |  Rolling Updates |  Metriken        |
    |                  |                  |                  |                  |
    |  "Ist der Code   |  "Kompiliert     |  "Wie kommt      |  "Laeuft alles   |
    |   sicher?"       |   es?"           |   es live?"      |   noch?"         |
    |                  |                  |                  |                  |
    +------------------+------------------+------------------+------------------+
```

**Wichtig:** Diese Saeulen sind nicht isoliert. Security prueft beim Build, Monitoring ueberwacht das Deployment.

---

## 3. CI/CD Pipeline im Detail

### Was ist CI/CD ueberhaupt?

- **CI (Continuous Integration):** Jeder Push wird automatisch gebaut und getestet
- **CD (Continuous Delivery):** Jeder erfolgreiche Build kann automatisch deployed werden

### Die Pipeline-Stages

```
    PUSH AUF GITLAB
           |
           v
    +------+------+------+------+
    |   SECURITY  | (Stage 1)   |  <-- Laeuft IMMER zuerst
    | Gitleaks    |             |      Secrets im Code?
    | Semgrep     |             |      Sicherheitsluecken?
    +-------------+-------------+
           |
           | OK? Weiter!
           v
    +------+------+------+------+
    |     BUILD   | (Stage 2)   |
    | Frontend    |             |  npm ci && npm run build
    | Backend     |             |  mvn clean verify
    +-------------+-------------+
           |
           | OK? Weiter!
           v
    +------+------+------+------+
    |    PACKAGE  | (Stage 3)   |  <-- Nur auf main Branch
    | Kaniko      |             |      Docker Images bauen
    | Registry    |             |      In GitLab Registry pushen
    +-------------+-------------+
           |
           | OK? Weiter!
           v
    +------+------+------+------+
    |     SCAN    | (Stage 4)   |
    | Trivy       |             |  Container auf CVEs pruefen
    +-------------+-------------+
           |
           | (DEPLOY - vorbereitet, aber deaktiviert)
           v
        FERTIG
```

### Wann laeuft was?

| Trigger | Security | Build | Package | Scan |
|---------|:--------:|:-----:|:-------:|:----:|
| Push auf Feature-Branch | Ja | Ja | Nein | Nein |
| Push auf main | Ja | Ja | Ja | Ja |
| Merge Request | Ja | Ja | Nein | Nein |
| Git Tag (v1.2.3) | Ja | Ja | Ja (stable) | Ja |

**Warum dieser Unterschied?** Feature-Branches brauchen keine Docker-Images. Nur getesteter Code auf `main` wird verpackt.

### Parallelisierung

```
    Stage: BUILD
    +---------------------------+
    |                           |
    |  build-frontend ----+     |
    |                     |---> |  Beide laufen PARALLEL
    |  build-backend  ----+     |  (spart Zeit!)
    |                           |
    +---------------------------+
```

Die Pipeline ist so konfiguriert, dass unabhaengige Jobs parallel laufen. Frontend und Backend haben keine Abhaengigkeiten zueinander.

---

## 4. Security Tools erklaert

### Die drei Schichten der Security

```
    +----------------------------------------------------------+
    |                    SECURITY LAYERS                        |
    +----------------------------------------------------------+
    |                                                          |
    |  Layer 1: GITLEAKS        "Hast du Secrets committed?"   |
    |  +-----------------------+                               |
    |  | Scannt Git-History    |  API-Keys, Passwoerter,       |
    |  | + aktuellen Code      |  Private Keys, Tokens         |
    |  +-----------------------+                               |
    |                                                          |
    |  Layer 2: SEMGREP         "Ist dein Code sicher?"        |
    |  +-----------------------+                               |
    |  | Static Analysis       |  SQL Injection, XSS,          |
    |  | (SAST)                |  Command Injection            |
    |  +-----------------------+                               |
    |                                                          |
    |  Layer 3: TRIVY           "Ist dein Container sicher?"   |
    |  +-----------------------+                               |
    |  | Container Scanning    |  CVEs in Base-Images,         |
    |  |                       |  Dependencies                 |
    |  +-----------------------+                               |
    |                                                          |
    +----------------------------------------------------------+
```

### Gitleaks im Detail

**Was es findet:**
```
# SCHLECHT - Gitleaks schlaegt Alarm:
DATABASE_PASSWORD=geheim123
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
-----BEGIN RSA PRIVATE KEY-----

# GUT - Umgebungsvariablen nutzen:
DATABASE_PASSWORD=${DB_PASSWORD}
```

**Warum wichtig?** Ein einmal gepushtes Secret ist kompromittiert. Git speichert die History - selbst wenn du es loeschst, existiert es noch.

### Semgrep im Detail

**Was es findet:**
```java
// SCHLECHT - SQL Injection:
String query = "SELECT * FROM users WHERE id=" + userId;

// GUT - Prepared Statement:
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id=?");
ps.setString(1, userId);
```

```javascript
// SCHLECHT - Command Injection:
exec("ls " + userInput);

// GUT - Validierte Eingabe:
exec("ls", [sanitizedInput]);
```

**Regeln:** Die Pipeline nutzt `p/default` und `p/security-audit` - Community-Regeln fuer Java, JavaScript, Python und mehr.

### Trivy im Detail

**Was es prueft:**
```
Container-Image
    |
    +-- Base Image (alpine, debian, etc.)
    |       |
    |       +-- Bekannte CVEs?
    |
    +-- Installierte Pakete
    |       |
    |       +-- Veraltete Versionen?
    |
    +-- Dependencies (node_modules, Maven deps)
            |
            +-- Sicherheitsluecken?
```

**Die Konfiguration:**
```yaml
trivy image --exit-code 1 --severity CRITICAL,HIGH --ignore-unfixed
```

- `--exit-code 1`: Pipeline failt bei Funden
- `--severity CRITICAL,HIGH`: Nur die wichtigen
- `--ignore-unfixed`: Ignoriert Probleme ohne verfuegbaren Fix

---

## 5. Container und Images

### Multi-Stage Builds verstehen

Warum bauen wir in zwei Stages? Schauen wir uns das Frontend-Dockerfile an:

```
    STAGE 1: Builder                 STAGE 2: Production
    +------------------------+       +------------------------+
    |                        |       |                        |
    |  node:20-alpine        |       |  nginx-unprivileged    |
    |  ~150 MB               |       |  ~25 MB                |
    |                        |       |                        |
    |  + node_modules        |       |  Nur: dist/ Ordner     |
    |  + Source Code         |  -->  |  (fertige JS/CSS)      |
    |  + Build Tools         |       |                        |
    |  = ~500+ MB            |       |  = ~30 MB              |
    |                        |       |                        |
    +------------------------+       +------------------------+

    Das finale Image enthaelt NUR Stage 2!
```

**Vorteile:**
- Kleinere Images (schnellerer Download, weniger Angriffsoberflaeche)
- Build-Tools nicht im Production-Image
- Weniger CVEs (weniger installierte Pakete)

### Warum Non-Root?

```
    ROOT USER                        NON-ROOT USER
    +------------------------+       +------------------------+
    |                        |       |                        |
    |  UID 0 (root)          |       |  UID 1001 (appuser)    |
    |                        |       |                        |
    |  Kann alles:           |       |  Kann nur:             |
    |  - System aendern      |       |  - App ausfuehren      |
    |  - Pakete installieren |       |  - In /app schreiben   |
    |  - Andere User lesen   |       |                        |
    |                        |       |                        |
    |  Wenn gehackt:         |       |  Wenn gehackt:         |
    |  GAME OVER             |       |  Schaden begrenzt      |
    |                        |       |                        |
    +------------------------+       +------------------------+
```

**Backend-Dockerfile:**
```dockerfile
# Non-root User erstellen
RUN addgroup -g 1001 appgroup && adduser -u 1001 -G appgroup -D appuser
USER appuser  # Ab hier laeuft alles als appuser
```

**Frontend:** Nutzt `nginx-unprivileged`, das bereits als User `nginx` (UID 101) laeuft.

### Healthchecks verstehen

```
    Docker/K8s fragt regelmaessig:
    "Lebt der Container noch?"

                    +-------------+
                    |   Backend   |
                    +-------------+
                          |
        HEALTHCHECK ------+
        GET /actuator/health
                          |
                          v
                    +-------------+
                    |   {"status": |
                    |    "UP"}    |
                    +-------------+
                          |
              +-----------+-----------+
              |                       |
              v                       v
        Status: UP              Status: DOWN
        Container OK            Container wird
                                neu gestartet
```

---

## 6. Lokales Development

### Zwei Modi: Production vs Development

```
    docker-compose.yml           docker-compose.dev.yml
    (Production-like)            (Development)
    +----------------------+     +----------------------+
    |                      |     |                      |
    |  Images von Registry |     |  Baut aus Source     |
    |                      |     |                      |
    |  image: registry...  |     |  build:              |
    |                      |     |    context: ./       |
    |                      |     |                      |
    +----------------------+     +----------------------+

    Wann nutzen?
    - Registry: Schnell starten, testen was deployed wird
    - Dev: Aktiv entwickeln, Aenderungen einbauen
```

### Service-Architektur lokal

```
    +--------------------------------------------------+
    |              DOCKER COMPOSE NETZWERK              |
    +--------------------------------------------------+
    |                                                  |
    |  Browser                                         |
    |     |                                            |
    |     | http://localhost:3000                      |
    |     v                                            |
    |  +----------+     +----------+     +----------+  |
    |  | Frontend |---->| Backend  |---->| Postgres |  |
    |  | (nginx)  |     | (Spring) |     |          |  |
    |  | :3000    |     | :8080    |     | :5432    |  |
    |  +----------+     +----------+     +----------+  |
    |       |                |                         |
    |       |                v                         |
    |       |           +----------+                   |
    |       |           |Prometheus|                   |
    |       |           | :9090    |                   |
    |       |           +----------+                   |
    |       |                |                         |
    |       |                v                         |
    |       |           +----------+                   |
    |       +---------->| Grafana  |                   |
    |                   | :3001    |                   |
    |                   +----------+                   |
    |                                                  |
    +--------------------------------------------------+
```

### Der nginx-Proxy: Warum brauchen wir den?

**Problem:** In der Entwicklung macht Vite den Proxy (`/api` -> Backend). Im Production-Build gibt es keinen Vite-Server.

**Loesung:** nginx uebernimmt das Routing:

```
    Browser Request                 nginx entscheidet
    +--------------+                +------------------+
    |              |                |                  |
    | /api/stories | -------------> | Weiter an        |
    |              |                | backend:8080     |
    +--------------+                +------------------+

    +--------------+                +------------------+
    |              |                |                  |
    | /editions/5  | -------------> | Serviere         |
    |              |                | index.html       |
    +--------------+                +------------------+
```

**nginx.conf erklaert:**
```nginx
# API-Requests an Backend
location /api/ {
    proxy_pass http://backend:8080/api/;
}

# SPA-Fallback (React Router braucht das!)
location / {
    try_files $uri $uri/ /index.html;
}
```

### Schnellstart-Befehle

```bash
# Option 1: Registry-Images (empfohlen zum Testen)
docker compose up

# Option 2: Lokal bauen (fuer Development)
docker compose -f docker-compose.dev.yml up --build

# Option 3: Nur Backend + DB (Frontend mit npm run dev)
docker compose -f docker-compose.dev.yml up postgres backend
cd frontend && npm run dev  # Hot Reload!
```

---

## 7. Monitoring

### Der Monitoring-Stack

```
    WAS PASSIERT HIER?

    +----------+        +------------+        +----------+
    |          |        |            |        |          |
    | Backend  | <----- | Prometheus | <----- | Grafana  |
    |          | scrape |            | query  |          |
    +----------+        +------------+        +----------+
         |                    |                    |
         v                    v                    v
    Exponiert             Speichert           Visualisiert
    Metriken              Zeitreihen          Dashboards

    /actuator/prometheus     TSDB            Charts, Graphs
```

### Prometheus: Der Datensammler

**Wie funktioniert Scraping?**
```
    Alle 15 Sekunden:

    Prometheus                      Backend
        |                              |
        |  GET /actuator/prometheus    |
        |----------------------------->|
        |                              |
        |  http_requests_total 1234    |
        |  jvm_memory_used_bytes ...   |
        |<-----------------------------|
        |                              |
    Speichert in Zeitreihen-DB
```

**prometheus.yml:**
```yaml
scrape_configs:
  - job_name: 'backend'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['backend:8080']
```

### Grafana: Die Visualisierung

**Vorkonfigurierte Panels:**

```
    +--------------------------------------------------+
    |            SPRING BOOT DASHBOARD                  |
    +--------------------------------------------------+
    |                                                  |
    |  +------------------+  +------------------+      |
    |  | HTTP Requests/s  |  | Response Time    |      |
    |  |                  |  |                  |      |
    |  |    ___/\___      |  |    ___           |      |
    |  |   /      \       |  |   /   \___       |      |
    |  +------------------+  +------------------+      |
    |                                                  |
    |  +------------------+  +------------------+      |
    |  | JVM Heap Used    |  | JVM Threads      |      |
    |  |                  |  |                  |      |
    |  |   ____/\_____    |  |  ___/\______     |      |
    |  +------------------+  +------------------+      |
    |                                                  |
    |  +------------------+  +------------------+      |
    |  | DB Connections   |  | CPU Usage        |      |
    |  | Active/Idle/Wait |  |                  |      |
    |  +------------------+  +------------------+      |
    |                                                  |
    +--------------------------------------------------+
```

**Was zeigen diese Metriken?**

| Metrik | Bedeutung | Wenn zu hoch... |
|--------|-----------|-----------------|
| HTTP Requests/s | Last auf der API | Skalieren? Cache? |
| Response Time | Wie schnell antwortet die API? | DB-Queries optimieren |
| JVM Heap | Speicherverbrauch | Memory Leak? Mehr RAM? |
| DB Connections Active | Aktive DB-Verbindungen | Connection Pool voll? |
| CPU Usage | Prozessorauslastung | Mehr Replicas? |

### Zugriff

```
Prometheus:  http://localhost:9090
Grafana:     http://localhost:3001
             User: admin
             Pass: admin
```

---

## 8. Kubernetes-Vorbereitung

### Was ist vorbereitet?

```
    k8s/
    +-- namespace.yaml          Isolierter Bereich "todoapp-staging"
    |
    +-- frontend/
    |   +-- deployment.yaml     Wie Frontend-Pods laufen sollen
    |   +-- service.yaml        Interner DNS-Eintrag
    |   +-- ingress.yaml        Externer Zugang (Domain)
    |
    +-- backend/
    |   +-- deployment.yaml     Wie Backend-Pods laufen sollen
    |   +-- service.yaml        Interner DNS-Eintrag
    |
    +-- postgres/
        +-- deployment.yaml     Datenbank-Pod
        +-- service.yaml        Interner DNS-Eintrag
        +-- pvc.yaml            Persistenter Speicher
        +-- secret.yaml         DB-Credentials (Template!)
```

### K8s-Konzepte kurz erklaert

```
    +----------------+     +----------------+     +----------------+
    |   DEPLOYMENT   |     |    SERVICE     |     |    INGRESS     |
    +----------------+     +----------------+     +----------------+
    |                |     |                |     |                |
    | "Sorge dafuer  |     | "Gib mir eine  |     | "Mach es von   |
    |  dass 2 Pods   |     |  stabile       |     |  aussen        |
    |  laufen"       |     |  Adresse"      |     |  erreichbar"   |
    |                |     |                |     |                |
    +----------------+     +----------------+     +----------------+
           |                      |                      |
           v                      v                      v
      Pods starten          DNS: backend         todoapp.com
      Pods neustarten       Port: 8080           TLS/HTTPS
      Rolling Updates       Load Balancing       Routing
```

### Security in K8s (schon eingebaut)

```yaml
# Aus backend/deployment.yaml:
securityContext:
  runAsNonRoot: true        # Kein root!
  runAsUser: 1001           # appuser
  allowPrivilegeEscalation: false
  capabilities:
    drop: ["ALL"]           # Keine Linux-Capabilities
```

### K8s aktivieren: Schritt fuer Schritt

```
    1. Cloud-Cluster erstellen (GKE, EKS, AKS)

    2. kubectl verbinden
       $ kubectl config use-context <cluster>

    3. Namespace + Secret anlegen
       $ kubectl apply -f k8s/namespace.yaml
       $ kubectl apply -f k8s/postgres/secret.yaml  # Vorher anpassen!

    4. Alles deployen
       $ kubectl apply -f k8s/postgres/
       $ kubectl apply -f k8s/backend/
       $ kubectl apply -f k8s/frontend/

    5. In .gitlab-ci.yml: Deploy-Stage einkommentieren
```

---

## 9. Versionierung und Release-Workflow

### SNAPSHOT vs Release

```
    SNAPSHOT                         RELEASE
    +------------------------+       +------------------------+
    |                        |       |                        |
    |  0.2.0-SNAPSHOT        |       |  0.2.0                 |
    |                        |       |                        |
    |  "In Entwicklung"      |       |  "Stabil"              |
    |  Kann sich aendern     |       |  Unveraenderlich       |
    |                        |       |                        |
    |  Tags: latest,         |       |  Tags: stable,         |
    |        snapshot,       |       |        v0.2.0,         |
    |        abc123f         |       |        abc123f         |
    |                        |       |                        |
    +------------------------+       +------------------------+
```

### Image-Tag-Strategie

```
    Push auf main:                  Git Tag v1.2.3:
    +-------------------+           +-------------------+
    | :latest           |           | :stable           |
    | :snapshot         |           | :v1.2.3           |
    | :abc123f          |           | :abc123f          |
    +-------------------+           +-------------------+

    Welchen Tag wann nutzen?
    +--------------+------------------+
    | Entwicklung  | :latest          |
    | Staging      | :latest          |
    | Production   | :stable / :v1.2.3|
    | Debugging    | :abc123f         |
    +--------------+------------------+
```

### Release erstellen

```bash
# 1. SNAPSHOT entfernen (pom.xml, package.json)
#    0.2.0-SNAPSHOT -> 0.2.0

# 2. Commit + Tag
git commit -am "release: v0.2.0"
git tag v0.2.0
git push origin main --tags

# 3. Naechste Entwicklung
#    0.2.0 -> 0.3.0-SNAPSHOT
git commit -am "chore: start 0.3.0-SNAPSHOT"
git push
```

---

## 10. Quick Reference

### Haeufige Befehle

```bash
# ===== LOKAL STARTEN =====
docker compose up                              # Registry-Images
docker compose -f docker-compose.dev.yml up    # Lokal bauen

# ===== IMAGES =====
docker compose pull                            # Neueste Images holen
docker compose up -d                           # Detached starten
docker compose logs -f backend                 # Logs folgen

# ===== ENTWICKLUNG =====
cd frontend && npm run dev                     # Frontend mit Hot Reload
cd backend && mvn spring-boot:run              # Backend lokal

# ===== GIT / RELEASE =====
git tag v1.2.3                                 # Release-Tag erstellen
git push --tags                                # Tags pushen

# ===== MONITORING =====
# Prometheus: http://localhost:9090
# Grafana:    http://localhost:3001 (admin/admin)

# ===== K8S (wenn aktiviert) =====
kubectl get pods -n todoapp-staging
kubectl logs -f deployment/backend -n todoapp-staging
kubectl rollout restart deployment/backend -n todoapp-staging
```

### Port-Uebersicht

| Service | Lokal | Im Container |
|---------|-------|--------------|
| Frontend | 3000 | 8080 |
| Backend | 8080 | 8080 |
| Postgres | 5432 | 5432 |
| Prometheus | 9090 | 9090 |
| Grafana | 3001 | 3000 |

### Datei-Referenz

| Datei | Zweck |
|-------|-------|
| `.gitlab-ci.yml` | CI/CD Pipeline Definition |
| `docker-compose.yml` | Production-like Setup (Registry-Images) |
| `docker-compose.dev.yml` | Development Setup (lokaler Build) |
| `frontend/Dockerfile` | Frontend Image (nginx + React) |
| `backend/Dockerfile` | Backend Image (Spring Boot) |
| `frontend/nginx.conf` | nginx Konfiguration (Proxy, SPA) |
| `monitoring/prometheus.yml` | Prometheus Scrape Config |
| `monitoring/grafana/` | Grafana Dashboards + Datasources |
| `k8s/` | Kubernetes Manifeste (vorbereitet) |

### Pipeline-Stages auf einen Blick

```
SECURITY -----> BUILD -----> PACKAGE -----> SCAN -----> (DEPLOY)
Gitleaks       npm ci       Kaniko        Trivy       kubectl
Semgrep        mvn verify   Registry                  (deaktiviert)
```

---

## Fragen zum Nachdenken

1. **Warum laeuft Security VOR dem Build?**
   Weil ein kompromittiertes Secret sofort gestoppt werden sollte - nicht erst nach 5 Minuten Build-Zeit.

2. **Warum Multi-Stage Builds?**
   Kleinere Images = schneller, sicherer, weniger Angriffsoberflaeche.

3. **Warum non-root Container?**
   Prinzip der minimalen Rechte. Wenn ein Angreifer einbricht, kann er weniger Schaden anrichten.

4. **Warum Kaniko statt Docker-in-Docker?**
   Kaniko braucht keinen Docker-Daemon. Sicherer und funktioniert in nicht-privilegierten Containern.

5. **Warum separate docker-compose Dateien?**
   Klare Trennung: `docker-compose.yml` zeigt, was in Produktion laeuft. `.dev.yml` ist fuer lokale Entwicklung.

---

> **Letzte Aktualisierung:** Automatisch generiert aus den Projekt-Konfigurationsdateien
