#!/usr/bin/env bash
# Writes the local/VM env files for the Matiks apps.
# Run from the repo root:  bash scripts/setup-env.sh
#
# Values can be passed as env vars to skip prompts:
#   PG_PASSWORD=... JWT_SECRET=... PUBLIC_HOST=... bash scripts/setup-env.sh
set -euo pipefail

if [ ! -f package.json ] || [ ! -d apps/be ]; then
  echo "Run this from the repo root." >&2
  exit 1
fi

prompt() { # prompt VAR "question" [secret]
  local var="$1" question="$2" secret="${3:-}"
  if [ -n "${!var:-}" ]; then return; fi
  if [ "$secret" = "secret" ]; then
    read -r -s -p "$question: " value; echo
  else
    read -r -p "$question: " value
  fi
  printf -v "$var" '%s' "$value"
}

prompt PG_PASSWORD "Postgres password (matiks user)" secret
prompt JWT_SECRET "JWT secret" secret
prompt PUBLIC_HOST "Public host, e.g. app.32.197.124.55.sslip.io (leave empty for localhost)"

if [ -z "${PG_PASSWORD}" ] || [ -z "${JWT_SECRET}" ]; then
  echo "PG_PASSWORD and JWT_SECRET are required." >&2
  exit 1
fi

DB_URL="postgresql://matiks:${PG_PASSWORD}@localhost:5432/matiks"

if [ -n "${PUBLIC_HOST}" ]; then
  API_PUBLIC="https://${PUBLIC_HOST}"
  WS_PUBLIC="wss://${PUBLIC_HOST}/ws"
else
  API_PUBLIC="http://localhost:8080"
  WS_PUBLIC="ws://localhost:8081"
fi

umask 077

write_file() { # write_file path <<EOF ... EOF
  local path="$1"
  mkdir -p "$(dirname "$path")"
  cat > "$path"
  chmod 600 "$path"
  echo "wrote $path"
}

# Database (used by prisma: db:migrate, db:generate)
write_file packages/db/.env <<EOF
DATABASE_URL=${DB_URL}
EOF

# Shared env, loaded by the ws service
write_file packages/common/.env <<EOF
DATABASE_URL=${DB_URL}
JWTTOKEN=${JWT_SECRET}
EOF

# Backend API
write_file apps/be/.env <<EOF
DATABASE_URL=${DB_URL}
JWTTOKEN=${JWT_SECRET}
EOF

# WebSocket server
write_file apps/ws-be/.env <<EOF
DATABASE_URL=${DB_URL}
JWTTOKEN=${JWT_SECRET}
EOF

# Frontend: NEXT_PUBLIC_* are baked in at build time.
# .env.production.local is git-ignored (plain .env.production is not).
write_file apps/fe/.env.production.local <<EOF
NEXT_PUBLIC_API_URL=${API_PUBLIC}
NEXT_PUBLIC_WS_URL=${WS_PUBLIC}
API_INTERNAL_URL=http://localhost:8080
EOF

echo "Done. Next: bun install && bun run db:migrate && bun run fe:build"
