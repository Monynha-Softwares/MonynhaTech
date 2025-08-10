#!/usr/bin/env bash

# scripts/migrate.sh — apply Supabase migrations in a controlled way.
#
# This script applies all database migrations defined in the
# `supabase/migrations` directory against a target database.  It expects
# either a DATABASE_URL environment variable (preferred) or a Supabase
# project reference with a service role token.  The Supabase CLI is
# invoked via `npx` so no global installation is required.  Use this
# script in CI/CD pipelines or locally to ensure migrations are applied
# consistently.

set -euo pipefail

# Determine connection mode.  Prefer DATABASE_URL if present.  As a
# fallback, allow PROJECT_REF and SUPABASE_SERVICE_KEY to be used.
if [[ -n "${DATABASE_URL:-}" ]]; then
  CONNECTION_ARGS=(--db-url "$DATABASE_URL")
elif [[ -n "${PROJECT_REF:-}" && -n "${SUPABASE_SERVICE_KEY:-}" ]]; then
  CONNECTION_ARGS=(--linked)
  # Link the project using the provided environment variables.  This
  # will write a .supabase/config.json file for subsequent commands.
  npx -y supabase@latest link --project-ref "$PROJECT_REF" --secret "$SUPABASE_SERVICE_KEY" >/dev/null
else
  echo "[migrate] Neither DATABASE_URL nor PROJECT_REF/SUPABASE_SERVICE_KEY provided." >&2
  echo "Set DATABASE_URL for remote migrations or PROJECT_REF and SUPABASE_SERVICE_KEY for linked migrations." >&2
  exit 1
fi

# Dry run: show what will change without applying.
echo "[migrate] Performing dry‑run of migrations…" >&2
npx -y supabase@latest db push "${CONNECTION_ARGS[@]}" --dry-run

# Apply migrations.  The --include-all flag ensures that pending
# migrations are applied in the order they appear.
echo "[migrate] Applying migrations…" >&2
npx -y supabase@latest db push "${CONNECTION_ARGS[@]}" --include-all

echo "[migrate] Migrations applied successfully." >&2

