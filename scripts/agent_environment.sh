#!/usr/bin/env bash

# agent_environment.sh — bootstrap the local development environment for Monynha Nexus Lab.
#
# This script installs all required tooling (pnpm and the Supabase CLI),
# installs project dependencies, and can optionally run a database
# migration dry‑run when a DATABASE_URL is provided.  It is idempotent
# and safe to run multiple times.

set -euo pipefail

# Detect whether pnpm is available; install via npm if missing.
if ! command -v pnpm >/dev/null 2>&1; then
  echo "[agent_environment] Installing pnpm…" >&2
  npm install -g pnpm@latest
fi

# Detect whether the Supabase CLI is available; install via npm if missing.
if ! command -v supabase >/dev/null 2>&1; then
  echo "[agent_environment] Installing Supabase CLI…" >&2
  npm install -g supabase@latest
fi

# Install project dependencies using pnpm.  The workspace uses a
# lockfile, so this will produce deterministic installs.
echo "[agent_environment] Installing project dependencies…" >&2
pnpm install

# If a DATABASE_URL environment variable is set, perform a dry run of
# the migrations to ensure they apply cleanly.  This does not
# persist any changes but gives early feedback to developers.  To
# execute migrations locally, use the provided scripts/migrate.sh.
if [[ -n "${DATABASE_URL:-}" ]]; then
  echo "[agent_environment] Validating database migrations against provided DATABASE_URL…" >&2
  supabase db push --db-url "$DATABASE_URL" --dry-run
fi

echo "[agent_environment] Environment setup complete." >&2