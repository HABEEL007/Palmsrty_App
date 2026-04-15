# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy monorepo configuration
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY services/keep-alive ./services/keep-alive

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the service
RUN pnpm --filter @palmistry/keep-alive build

# Stage 2: Runtime
FROM node:20-alpine AS runtime

WORKDIR /usr/src/app

# Add non-root user
USER node

# Copy built service from builder
COPY --from=builder /usr/src/app/services/keep-alive/dist ./services/keep-alive/dist
COPY --from=builder /usr/src/app/services/keep-alive/package.json ./services/keep-alive/package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Environment Variables
ENV NODE_ENV=production
ENV PORT=3008

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3008/health || exit 1

EXPOSE 3008

WORKDIR /usr/src/app/services/keep-alive
CMD ["node", "dist/index.js"]
