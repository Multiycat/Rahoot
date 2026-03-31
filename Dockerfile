##################
# ---- BASE ---- #
##################
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

#####################
# ---- BUILDER ---- #
#####################
FROM base AS builder
WORKDIR /build
# Cloner et compiler l'app
RUN apk add --no-cache git && \
    git clone --depth 1 https://github.com/Multiycat/rahoot.git . && \
    pnpm install --frozen-lockfile && \
    pnpm run build && \
    rm -rf node_modules .pnpm-store && \
    apk del git

#####################
# ---- RUNNER ----  #
#####################
FROM alpine:3.21 AS runner
RUN apk add --no-cache nginx nodejs npm supervisor git

# Copier les configs nginx et supervisor
COPY docker/nginx-main.conf       /etc/nginx/nginx.conf
COPY docker/nginx.conf            /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf      /etc/supervisord.conf

# Créer les répertoires temporaires pour Nginx
RUN mkdir -p /tmp/nginx/tmp /tmp/nginx/logs \
    && chmod -R 777 /tmp/nginx

# Copier les fichiers compilés depuis le builder
COPY --from=builder /build/packages/web/dist           /app/packages/web/dist
COPY --from=builder /build/packages/socket/dist        /app/packages/socket/dist

# Créer le répertoire config s'il n'existe pas (il sera peuplé à l'exécution)
RUN mkdir -p /app/config/quizz

# Copier et rendre exécutable le script de démarrage
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

WORKDIR /app
EXPOSE 8008
CMD ["/bin/sh", "/app/start.sh"]

