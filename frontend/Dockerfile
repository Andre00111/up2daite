# Stage 1: Node baut das React-Bundle
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: nginx serviert das fertige Bundle
# nginxinc/nginx-unprivileged läuft bereits als non-root (User: nginx, UID 101)
FROM nginxinc/nginx-unprivileged:alpine

# Alle Alpine-Pakete aktualisieren (fixt CVEs im Base-Image)
USER root
RUN apk upgrade --no-cache
USER nginx

# ★ Eigene nginx-Config mit API-Proxy und SPA-Fallback
COPY --chown=nginx:nginx nginx.conf /etc/nginx/conf.d/default.conf
COPY --chown=nginx:nginx --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
