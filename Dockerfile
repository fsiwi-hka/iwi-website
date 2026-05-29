FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN --mount=type=secret,id=instagram_token \
    --mount=type=secret,id=nextcloud_url \
    INSTAGRAM_TOKEN=$(cat /run/secrets/instagram_token) \
    NEXTCLOUD_URL=$(cat /run/secrets/nextcloud_url) \
    npm run build

FROM caddy:alpine
COPY --from=builder /app/out /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80