#!/usr/bin/env bash
set -euo pipefail

NODE_VERSION=20
if command -v nvm >/dev/null 2>&1; then
  nvm install "$NODE_VERSION"
  nvm use "$NODE_VERSION"
fi

echo "Using node $(node --version)"
if ! command -v pnpm >/dev/null 2>&1; then
  echo "pnpm is required. Install via 'npm install -g pnpm'." >&2
  exit 1
fi

echo "Installing dependencies"
pnpm install

echo "Installing Playwright browsers"
pnpm exec playwright install --with-deps chromium

echo "Running lint"
pnpm lint

echo "Running type check"
pnpm typecheck

echo "Running unit and component tests"
pnpm test

echo "Running e2e tests"
pnpm test:e2e

# Dry run migrations if DATABASE_URL is set.
if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "[ci_test_local] Performing migration dry‑run…" >&2
  supabase db push --db-url "$DATABASE_URL" --dry-run
fi

echo "[ci_test_local] All local CI checks completed successfully." >&2