#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cp "$ROOT/deploy/env/packages-db.env" "$ROOT/packages/db/.env"
cp "$ROOT/deploy/env/packages-common.env" "$ROOT/packages/common/.env"
cp "$ROOT/deploy/env/apps-be.env" "$ROOT/apps/be/.env"
cp "$ROOT/deploy/env/apps-ws-be.env" "$ROOT/apps/ws-be/.env"
cp "$ROOT/deploy/env/apps-fe.env.local" "$ROOT/apps/fe/.env.local"
cp "$ROOT/deploy/env/apps-fe.env.production.local" "$ROOT/apps/fe/.env.production.local"
echo "env files applied"
