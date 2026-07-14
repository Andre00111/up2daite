# TEARDOWN: up2daite.com offline nehmen

**Status:** up2daite.com wird offline genommen. Alles reversibel.

> ⚠️ Führe diese Befehle gegen den **echten Prod-Cluster** aus — NICHT minikube:
> ```bash
> kubectl config get-contexts
> kubectl config use-context <dein-prod-context>
> kubectl get pods -n up2daite-staging     # prüfen, dass die echten Pods kommen
> ```

---

## 1. DB-Backup (zuerst!)

```bash
# Namen des Postgres-Pods holen
PGPOD=$(kubectl get pod -n up2daite-staging -l app.kubernetes.io/name=postgres -o jsonpath='{.items[0].metadata.name}')

# SQL-Dump auf deinen Rechner
kubectl exec -n up2daite-staging "$PGPOD" -- \
  pg_dump -U up2daite -d up2daite > up2daite-backup-$(date +%Y-%m-%d).sql

# Prüfe, dass das Backup plausibel gefüllt ist
head -20 up2daite-backup-*.sql
wc -l up2daite-backup-*.sql
```

> ⏸️ **Erst weitermachen, wenn das Backup OK ist!**

---

## 2. Seite offline nehmen

```bash
# Ingress entfernen → up2daite.com nicht mehr erreichbar
kubectl delete ingress frontend -n up2daite-staging

# Frontend stoppen (Pod weg, Deployment bleibt)
kubectl scale deployment/frontend --replicas=0 -n up2daite-staging

# Backend stoppen
kubectl scale deployment/backend --replicas=0 -n up2daite-staging

# DB stoppen (optional, aber spart Ressourcen; Volume bleibt!)
kubectl scale deployment/postgres --replicas=0 -n up2daite-staging
```

**Was bleibt:**
- ✅ Alle YAML im Repo
- ✅ Deployment-Objekte (auf 0 skaliert, nicht gelöscht)
- ✅ DB-Volume (`postgres-pvc`) mit allen Daten
- ✅ Alle Secrets (inkl. Zertifikat)
- ❌ Keine laufenden Pods
- ❌ Keine öffentliche IP

---

## 3. Zertifikat-Secret entfernen (optional)

```bash
# Nur das TLS-Secret weg. ACME-Account bleibt.
kubectl delete secret up2daite-tls -n up2daite-staging
```

> Hinweis: Solange kein Ingress auf das Secret verweist, wird es nicht neu ausgestellt.
> Der ACME-Account mit der E-Mail bleibt unverändert.

---

## 4. Status prüfen

```bash
# Prüfe, dass nichts mehr läuft
kubectl get pods -n up2daite-staging
# → sollte leer oder nur "Terminating" zeigen

# Prüfe, dass die DB-Daten noch da sind
kubectl get pvc -n up2daite-staging
# → up2daite-postgres-pvc sollte "Bound" sein

# Prüfe Ingress
kubectl get ingress -n up2daite-staging
# → sollte leer sein
```

---

## ROLLBACK: Wieder online nehmen

```bash
# Alle Pods wieder hochfahren
kubectl scale deployment/postgres --replicas=1 -n up2daite-staging
kubectl scale deployment/backend --replicas=1 -n up2daite-staging
kubectl scale deployment/frontend --replicas=1 -n up2daite-staging

# Warten, bis sie laufen
kubectl rollout status deployment/postgres -n up2daite-staging
kubectl rollout status deployment/backend -n up2daite-staging
kubectl rollout status deployment/frontend -n up2daite-staging

# Ingress wieder online (Zertifikat wird automatisch neu ausgestellt)
kubectl apply -f k8s/frontend/ingress.yaml

# Status beobachten
kubectl get pods -n up2daite-staging -w
kubectl get certificate -n up2daite-staging
```

---

## Falls DB-Backup einspielen nötig

```bash
# Nur wenn du das Backup wiederherstellen willst:
PGPOD=$(kubectl get pod -n up2daite-staging -l app.kubernetes.io/name=postgres -o jsonpath='{.items[0].metadata.name}')

kubectl exec -i -n up2daite-staging "$PGPOD" -- \
  psql -U up2daite -d up2daite < up2daite-backup-JJJJ-MM-TT.sql
```
