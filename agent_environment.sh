#!/usr/bin/env bash
set -euo pipefail

# Ensure pnpm is available
if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm
fi

# Install project dependencies
pnpm install

# Prepare environment variables
if [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

# Install Playwright browsers (safe to run multiple times)
pnpm exec playwright install --with-deps >/dev/null 2>&1 || pnpm exec playwright install >/dev/null 2>&1

# Run Supabase migrations if CLI is installed
if command -v supabase >/dev/null 2>&1; then
  supabase start >/dev/null 2>&1 || true
  supabase db reset >/dev/null 2>&1 || true
else
  echo "Supabase CLI not found, skipping database setup"
fi

echo "Environment setup complete"
