#!/usr/bin/env bash

# scripts/ci_test_local.sh — replicate the CI workflow locally.
#
# This script runs the same checks performed in the CI pipeline so
# developers can validate their changes before pushing.  It should
# install dependencies, run unit/component tests, and perform a dry
# run of migrations if a DATABASE_URL is provided.

set -euo pipefail

# Ensure the environment is bootstrapped.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_ROOT"

if [[ ! -x ./agent_environment.sh ]]; then
  echo "[ci_test_local] agent_environment.sh not found; run from repository root." >&2
  exit 1
fi

# Install dependencies and tools.
./agent_environment.sh

# Run linting and type checking if configured (ignore non‑zero exit if not configured).
if npx --yes eslint -v >/dev/null 2>&1; then
  echo "[ci_test_local] Running ESLint…" >&2
  npx --yes eslint .
fi
if npx --yes tsc -v >/dev/null 2>&1; then
  echo "[ci_test_local] Running TypeScript type check…" >&2
  npx --yes tsc --noEmit
fi

# Run unit and component tests (Vitest/Playwright etc.)
echo "[ci_test_local] Running tests…" >&2
pnpm test --if-present

# Dry run migrations if DATABASE_URL is set.
if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "[ci_test_local] Performing migration dry‑run…" >&2
  supabase db push --db-url "$DATABASE_URL" --dry-run
fi

echo "[ci_test_local] All local CI checks completed successfully." >&2