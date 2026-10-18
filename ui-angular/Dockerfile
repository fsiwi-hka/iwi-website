# Baut die Angular-Website (statisch vorgerendert) und liefert sie mit Caddy aus.
# Das Backend wird wie bei der Next.js-Version ueber /api/* durchgereicht.
FROM node:24-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

FROM caddy:alpine
COPY --from=builder /app/dist/website/browser /usr/share/caddy
COPY Caddyfile /etc/caddy/Caddyfile
EXPOSE 80
