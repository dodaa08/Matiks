FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json bun.lock turbo.json ./
COPY apps/be/package.json apps/be/
COPY packages/db/package.json packages/db/
COPY packages/common/package.json packages/common/

RUN bun install

COPY apps/be/ /app/apps/be/
COPY packages/common/ /app/packages/common/
COPY packages/db/ /app/packages/db/

RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy bun run db:generate

EXPOSE 8080

CMD ["sh", "-c", "bun run db:migrate && bun run be:start"]
