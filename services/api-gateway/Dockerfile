# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY services/api-gateway ./services/api-gateway

# Install dependencies (only what's needed for this service)
RUN pnpm install --frozen-lockfile

# Build the service
RUN pnpm --filter @palmistry/api-gateway build

# Stage 2: Runtime
FROM node:20-alpine AS runtime

WORKDIR /usr/src/app

# Add non-root user
USER node

# Copy built service from builder
COPY --from=builder /usr/src/app/services/api-gateway/dist ./services/api-gateway/dist
COPY --from=builder /usr/src/app/services/api-gateway/package.json ./services/api-gateway/package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages ./packages

# Environment Variables
ENV NODE_ENV=production
ENV PORT=3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

EXPOSE 3000

WORKDIR /usr/src/app/services/api-gateway
CMD ["node", "dist/index.js"]
