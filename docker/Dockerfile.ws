FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json turbo.json bun.lock ./
COPY packages/common/package.json ./packages/common/
COPY packages/db/package.json ./packages/db/
COPY apps/ws-be/package.json ./apps/ws-be/

RUN bun install

COPY packages/common ./packages/common/
COPY packages/db ./packages/db/
COPY apps/ws-be ./apps/ws-be/

RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy bun run db:generate

EXPOSE 8081

CMD [ "sh", "-c", "bun run db:migrate && exec bun run ws:start" ]