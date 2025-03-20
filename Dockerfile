FROM oven/bun:apline AS base

FROM base AS deps
# 1.install deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --forzen-lockfile

# 2. build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN bun run build

# 3.start the server
FROM base AS runner

WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static


EXPOSE 3000
CMD ["bun", "run", "server.js"]
