#!/bin/bash
# Legt das Image-Pull-Secret für die GitLab Container Registry an.
# Einmalig ausführen, danach kennt der Cluster die Registry-Zugangsdaten.
#
# Voraussetzungen:
#   - kubectl ist konfiguriert (minikube start wurde ausgeführt)
#   - Namespace existiert: kubectl apply -f k8s/namespace.yaml
#
# Verwendung:
#   GITLAB_USER=deinuser GITLAB_TOKEN=dein-token bash k8s/image-pull-secret.sh

set -e

NAMESPACE="up2daite-staging"
SECRET_NAME="gitlab-registry"
REGISTRY="registry.gitlab.com"

if [ -z "$GITLAB_USER" ] || [ -z "$GITLAB_TOKEN" ]; then
  echo "Fehler: GITLAB_USER und GITLAB_TOKEN müssen gesetzt sein."
  echo "Beispiel: GITLAB_USER=deinuser GITLAB_TOKEN=glpat-xxx bash k8s/image-pull-secret.sh"
  exit 1
fi

kubectl create secret docker-registry "$SECRET_NAME" \
  --docker-server="$REGISTRY" \
  --docker-username="$GITLAB_USER" \
  --docker-password="$GITLAB_TOKEN" \
  --namespace="$NAMESPACE" \
  --dry-run=client -o yaml | kubectl apply -f -

echo "Secret '$SECRET_NAME' im Namespace '$NAMESPACE' angelegt."
