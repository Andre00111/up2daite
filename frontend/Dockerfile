# Stage 1: Node baut das React-Bundle
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: nginx serviert das fertige Bundle
FROM nginx:alpine

# Alle Alpine-Pakete aktualisieren (fixt CVEs im Base-Image)
RUN apk upgrade --no-cache

# ★ Eigene nginx-Config mit API-Proxy und SPA-Fallback
# Ersetzt die Default-Config, die kein Proxying kann
COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
