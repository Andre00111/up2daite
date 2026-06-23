# HTTPS mit cert-manager auf K3s

## Überblick: Wie dein Setup funktioniert

```
Internet (HTTPS)
    │
    ▼
┌─────────────────────────────────────────────────┐
│  Server (31.70.75.157)                          │
│                                                 │
│  ┌───────────────────────────────────────────┐  │
│  │  K3s Cluster                              │  │
│  │                                           │  │
│  │  ┌─────────────┐    TLS-Terminierung      │  │
│  │  │  Traefik     │◄── hier endet HTTPS     │  │
│  │  │  (Ingress)   │    und wird zu HTTP      │  │
│  │  └──────┬───────┘                         │  │
│  │         │ HTTP (intern)                   │  │
│  │         ▼                                 │  │
│  │  ┌─────────────┐                          │  │
│  │  │  Frontend    │  Nginx im Container     │  │
│  │  │  Service:80  │  served React-App       │  │
│  │  │  Pod:8080    │  proxied /api → Backend │  │
│  │  └──────┬───────┘                         │  │
│  │         │ /api/*                          │  │
│  │         ▼                                 │  │
│  │  ┌─────────────┐                          │  │
│  │  │  Backend     │  Spring Boot             │  │
│  │  │  Service     │  REST API               │  │
│  │  │  :8080       │                         │  │
│  │  └──────┬───────┘                         │  │
│  │         │                                 │  │
│  │         ▼                                 │  │
│  │  ┌─────────────┐                          │  │
│  │  │  PostgreSQL  │  Datenbank              │  │
│  │  │  :5432       │                         │  │
│  │  └─────────────┘                          │  │
│  │                                           │  │
│  │  ┌─────────────┐                          │  │
│  │  │cert-manager  │ ◄── holt automatisch    │  │
│  │  │              │     Let's Encrypt Certs  │  │
│  │  └─────────────┘     und erneuert sie     │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Warum `certbot --nginx` NICHT funktioniert

- `certbot --nginx` sucht nach einer **Nginx, die direkt auf dem Host installiert** ist
- Deine Nginx läuft **innerhalb eines Kubernetes-Containers** — für das Host-System ist sie unsichtbar
- Der K3s-Cluster nutzt **Traefik** als Ingress Controller (nicht Nginx auf dem Host)
- Stattdessen: **cert-manager** läuft IM Cluster und arbeitet mit Traefik zusammen

## Setup-Anleitung (Schritt für Schritt)

### 1. cert-manager installieren

```bash
# cert-manager in den Cluster deployen (einmalig)
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.17.2/cert-manager.yaml

# Warten bis alle Pods laufen (~1-2 Minuten)
kubectl wait --for=condition=Ready pods --all -n cert-manager --timeout=120s

# Prüfen ob alles läuft
kubectl get pods -n cert-manager
# → cert-manager, cert-manager-cainjector, cert-manager-webhook müssen "Running" sein
```

### 2. ClusterIssuer anlegen

```bash
kubectl apply -f k8s/cert-manager/clusterissuer.yaml

# Prüfen ob der Issuer bereit ist
kubectl get clusterissuer
# → READY sollte "True" sein
```

### 3. Ingress mit TLS deployen

```bash
# Die aktualisierte ingress.yaml enthält bereits TLS-Konfiguration
kubectl apply -f k8s/frontend/ingress.yaml

# cert-manager erkennt die Annotation und beantragt automatisch ein Zertifikat
```

### 4. Zertifikat prüfen

```bash
# Zertifikat-Status anzeigen
kubectl get certificate -n up2daite-staging
# → READY = True bedeutet: Zertifikat wurde ausgestellt

# Details zum Zertifikat
kubectl describe certificate up2daite-tls -n up2daite-staging

# Das Secret, in dem das Zertifikat gespeichert ist
kubectl get secret up2daite-tls -n up2daite-staging
```

## Reihenfolge: Erst Staging testen, dann Production

Die `ingress.yaml` ist auf **letsencrypt-staging** eingestellt.
Staging-Zertifikate sind "untrusted" (Browser zeigt Warnung), aber es gibt kein Rate-Limit.

**Wenn Staging funktioniert**, auf Production umschalten:

```yaml
# In ingress.yaml diese Annotation ändern:
cert-manager.io/cluster-issuer: "letsencrypt-prod"   # war: letsencrypt-staging
```

Dann neu deployen:
```bash
# Altes Staging-Zertifikat löschen, damit ein neues beantragt wird
kubectl delete secret up2daite-tls -n up2daite-staging

# Ingress neu anwenden
kubectl apply -f k8s/frontend/ingress.yaml

# Neues Zertifikat prüfen (kann 1-2 Minuten dauern)
kubectl get certificate -n up2daite-staging -w
```

## Troubleshooting

```bash
# cert-manager Logs prüfen
kubectl logs -n cert-manager -l app=cert-manager --tail=50

# Challenge-Status prüfen (zeigt ob HTTP-01 Challenge läuft)
kubectl get challenges -n up2daite-staging

# Zertifikat-Events prüfen
kubectl describe certificate up2daite-tls -n up2daite-staging

# Häufiges Problem: DNS zeigt noch nicht auf den Server
# → Prüfen: dig up2daite.com → muss 31.70.75.157 zurückgeben
nslookup up2daite.com
```

## Automatische Erneuerung

cert-manager erneuert Zertifikate automatisch **30 Tage vor Ablauf**.
Let's Encrypt Zertifikate sind 90 Tage gültig → Erneuerung passiert ca. alle 60 Tage.
Du musst dich um nichts kümmern.
