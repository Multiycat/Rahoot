# Créer les répertoires temporaires pour Nginx
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
WORKDIR /home/container

RUN apk add --no-cache git && \
    git clone --depth 1 https://github.com/Multiycat/rahoot.git . && \
    pnpm install --frozen-lockfile && \
    pnpm run build && \
    rm -rf node_modules .pnpm-store

#####################
# ---- RUNNER ----  #
#####################
FROM alpine:3.21 AS runner
RUN apk add --no-cache nginx nodejs npm supervisor git

# Config nginx & supervisor
COPY docker/nginx-main.conf  /home/container/etc/nginx/nginx.conf
COPY docker/nginx.conf       /home/container/etc/nginx/http.d/default.conf
COPY docker/supervisord.conf /home/container/etc/supervisord.conf

# Dossiers temporaires nginx
RUN mkdir -p /home/container/tmp/nginx/tmp /home/container/tmp/nginx/logs \
    && chmod -R 777 /home/container/tmp/nginx

# ✅ CORRECTION ICI
COPY --from=builder /home/container/packages/web/dist    /home/container/app/packages/web/dist
COPY --from=builder /home/container/packages/socket/dist /home/container/app/packages/socket/dist

# Config app
RUN mkdir -p /home/container/app/config/quizz

# Script start
COPY start.sh /home/container/app/start.sh
RUN chmod +x /home/container/app/start.sh

WORKDIR /home/container/app
EXPOSE 8008

# ✅ CORRECTION ICI AUSSI
CMD ["/bin/sh", "/home/container/app/start.sh"]
