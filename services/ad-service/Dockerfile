# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
COPY packages ./packages
COPY services/ad-service ./services/ad-service
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @palmistry/ad-service build

# Stage 2: Runtime
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app
USER node
COPY --from=builder /usr/src/app/services/ad-service/dist ./services/ad-service/dist
COPY --from=builder /usr/src/app/services/ad-service/package.json ./services/ad-service/package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/packages ./packages
ENV NODE_ENV=production
ENV PORT=3005
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3005/health || exit 1
EXPOSE 3005
WORKDIR /usr/src/app/services/ad-service
CMD ["node", "dist/index.js"]
