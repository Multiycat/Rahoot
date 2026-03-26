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
# Copie les fichiers essentiels du monorepo
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/common/package.json ./packages/common/
COPY packages/web/package.json     ./packages/web/
COPY packages/socket/package.json  ./packages/socket/
# Installer les dépendances via cache mount pour pnpm
RUN --mount=type=cache,target=/pnpm/store pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
#####################
# ---- RUNNER ----  #
#####################
FROM alpine:3.21 AS runner
RUN apk add --no-cache nginx nodejs npm supervisor
# Copier les configs nginx et supervisor
COPY docker/nginx.conf        /etc/nginx/http.d/default.conf
COPY docker/supervisord.conf  /etc/supervisord.conf
WORKDIR /home/container
# Copier les assets construits
COPY --from=builder /home/container/packages/web/dist           /home/container/web
COPY --from=builder /home/container/packages/socket/dist/index.cjs /home/container/socket/index.cjs
# (Adapter si tu as un autre point d'entrée ou des ressources à copier)
EXPOSE 8008
CMD ["supervisord", "-c", "/etc/supervisord.conf"]
