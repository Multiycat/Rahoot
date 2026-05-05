FROM node:24-alpine AS base

# Enable and prepare pnpm via Corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# ----- DEPENDENCIES -----
FROM base AS deps
WORKDIR /app

# Copy pnpm configuration files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages/web/package.json ./packages/web/
COPY packages/socket/package.json ./packages/socket/

# Install only production dependencies
RUN pnpm install --frozen-lockfile --prod

# ----- BUILDER -----
FROM base AS builder
WORKDIR /app

# Copy all monorepo files
COPY . .

# Install all dependencies (including dev) for build
RUN pnpm install --frozen-lockfile

# Build Next.js app with standalone output for smaller runtime image
WORKDIR /app/packages/web
RUN pnpm build

# Build socket server if needed (TypeScript or similar)
WORKDIR /app/packages/socket
RUN if [ -f "tsconfig.json" ]; then pnpm build; fi

# ----- RUNNER -----
FROM node:24-alpine AS runner
WORKDIR /app

# Create a non-root user for better security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs


# Enable pnpm in the runtime image
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy configuration files
COPY pnpm-workspace.yaml package.json ./

# Copy the Vite build output
COPY --from=builder /app/packages/web/dist ./packages/web/dist
COPY --from=builder /app/packages/web/package.json ./packages/web/

# Copy the socket server build
COPY --from=builder /app/packages/socket/dist ./packages/socket/dist

# Install serve to run the static web app
RUN npm install -g serve

# Expose the web and socket ports
EXPOSE 3000 3003

# Environment variables
ENV NODE_ENV=production

# Start both services (Vite web app + Socket server)
CMD ["sh", "-c", "serve -s packages/web/dist -l 3000 & node packages/socket/dist/index.cjs"]
