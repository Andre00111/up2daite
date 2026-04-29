# Kubernetes Setup (vorbereitet für Cloud-Cluster)

Dieses Setup ist ready für ein späteres Deployment auf einem Cloud-Kubernetes-Cluster (GKE, EKS, AKS, etc.).

## Struktur

```
k8s/
├── namespace.yaml          # Namespace "up2daite-staging"
├── frontend/
│   ├── deployment.yaml     # Frontend Pods (nginx + React)
│   ├── service.yaml        # ClusterIP Service
│   └── ingress.yaml        # Externer Zugang via Domain
├── backend/
│   ├── deployment.yaml     # Backend Pods (Spring Boot)
│   └── service.yaml        # ClusterIP Service
└── postgres/
    ├── deployment.yaml     # PostgreSQL Pod
    ├── service.yaml        # ClusterIP Service
    ├── pvc.yaml            # Persistenter Speicher
    └── secret.yaml         # DB Credentials (TEMPLATE!)
```

## Voraussetzungen für Aktivierung

1. **Cloud-Cluster** erstellen (z.B. GKE, EKS)
2. **kubectl** mit Cluster verbinden
3. **GitLab CI/CD Variables** setzen:
   - `KUBE_CONFIG` (Base64-encoded kubeconfig)
   - Oder: GitLab Kubernetes Agent installieren

## Manuelles Deployment (zum Testen)

```bash
# 1. Mit Cluster verbinden
kubectl config use-context <dein-cluster>

# 2. Namespace + Secret anlegen
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres/secret.yaml

# 3. Alles deployen
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/backend/
kubectl apply -f k8s/frontend/

# 4. Status prüfen
kubectl get pods -n up2daite-staging
kubectl get ingress -n up2daite-staging
```

## CI/CD aktivieren

In `.gitlab-ci.yml` den auskommentierten Block `# ─── K8S DEPLOYMENT ───` einkommentieren.

## Wichtige Hinweise

- **postgres/secret.yaml** enthält Dummy-Credentials — in Produktion echte Secrets nutzen!
- **Ingress** erfordert einen Ingress Controller (z.B. nginx-ingress)
- Für Produktion: Managed Database (Cloud SQL, RDS) statt Postgres-Pod empfohlen
