FROM oven/bun:1-alpine

WORKDIR /app

COPY package.json turbo.json bun.lock ./
COPY packages/common/package.json ./packages/common/
COPY packages/db/package.json ./packages/db/
COPY apps/be/package.json ./apps/be/

RUN bun install

COPY packages/common ./packages/common/
COPY packages/db ./packages/db/
COPY apps/be ./apps/be/

RUN DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy bun run db:generate

EXPOSE 8080

CMD [ "sh", "-c", "bun run db:migrate && exec bun run be:start" ]