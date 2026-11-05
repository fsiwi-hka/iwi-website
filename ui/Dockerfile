FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Kein Instagram-Token mehr noetig: der Feed wird zur Laufzeit vom Backend
# geladen, das die Bilder spiegelt. Signierte CDN-URLs zur Buildzeit
# einzubacken funktioniert nicht, weil sie nach wenigen Stunden ablaufen.
RUN --mount=type=secret,id=nextcloud_url \
    NEXTCLOUD_URL=$(cat /run/secrets/nextcloud_url) \
    npm run build

# Version gepinnt: caddy 2.11.8 hat eine try_files-Regression, durch die "/" 404 liefert.
FROM caddy:2.11.7-alpine
COPY --from=builder /app/out /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80