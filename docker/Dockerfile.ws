FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY apps/ws/package.json apps/ws/
COPY packages/db/package.json packages/db/
COPY packages/common/package.json packages/common/

RUN bun install

COPY apps/ws/ /app/apps/ws/
COPY packages/common/ /app/packages/common/
COPY packages/db/ /app/packages/db/

RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy bun run db:generate

EXPOSE 8081

CMD ["sh", "-c", "bun run db:migrate && bun run ws:start"]
