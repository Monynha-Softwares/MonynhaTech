#!/usr/bin/env bash
set -euo pipefail

# Ensure pnpm is installed
if ! command -v pnpm >/dev/null 2>&1; then
  npm install -g pnpm
fi

# Install node dependencies
pnpm install

# Setup environment variables
if [ -f .env.agents.example ] && [ ! -f .env.local ]; then
  cp .env.agents.example .env.local
elif [ -f .env.example ] && [ ! -f .env.local ]; then
  cp .env.example .env.local
fi

# Install Playwright browsers and system dependencies
pnpm exec playwright install --with-deps

# Start Supabase and run migrations if Docker is available
if command -v docker >/dev/null 2>&1; then
  pnpm dlx supabase start
  pnpm dlx supabase db reset --force --no-interaction
else
  echo "Docker not installed; skipping Supabase start and migrations."
fi
