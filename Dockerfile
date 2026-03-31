##################
# ---- BASE ---- #
##################
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@latest --activate

#####################
# ---- RUNNER ----  #
#####################
FROM alpine:3.21 AS runner
RUN apk add --no-cache nginx nodejs npm supervisor git bash
# Installer pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

# Copier les configs nginx et supervisor
COPY docker/nginx-main.conf       /etc/nginx/nginx.conf
COPY docker/nginx.conf            /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf      /etc/supervisord.conf

# Créer les répertoires temporaires pour Nginx
RUN mkdir -p /tmp/nginx/tmp /tmp/nginx/logs \
    && chmod -R 777 /tmp/nginx

# Copier et rendre exécutable le script de démarrage
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

WORKDIR /app
EXPOSE 8008
CMD ["/bin/bash", "/app/start.sh"]

