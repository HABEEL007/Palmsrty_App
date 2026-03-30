# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY services/reading-service ./services/reading-service
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @palmistry/reading-service build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
USER node
COPY --from=builder /usr/src/app/services/reading-service/dist ./services/reading-service/dist
COPY --from=builder /usr/src/app/services/reading-service/package.json ./services/reading-service/package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages ./packages
ENV NODE_ENV=production
ENV PORT=3004
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3004/health || exit 1
EXPOSE 3004
WORKDIR /usr/src/app/services/reading-service
CMD ["node", "dist/index.js"]
