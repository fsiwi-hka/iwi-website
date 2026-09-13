# Build-Stage: Angular-Produktionsbuild (Mocks sind hier aus, siehe src/environments/environment.ts)
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build -- --configuration production

# Laufzeit: statische Dateien + SPA-Fallback + API-Proxy ueber Caddy,
# gleiches Muster wie die Hauptseite in ../ui
FROM caddy:alpine
COPY --from=builder /app/dist/backrooms/browser /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
