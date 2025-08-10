#!/bin/bash
set -euo pipefail

# Ensure pnpm is available
if ! command -v pnpm >/dev/null 2>&1; then
  echo "Installing pnpm..."
  npm install -g pnpm >/dev/null 2>&1
fi

# Install dependencies
pnpm install

# Configure environment variables
if [ -f .env.example ] && [ ! -f .env ]; then
  cp .env.example .env
fi
if [ -f .env.agents.example ] && [ ! -f .env.local ]; then
  cp .env.agents.example .env.local
fi

# Install Playwright browsers and system dependencies
pnpm exec playwright install --with-deps chromium

# Run database migrations if Supabase CLI is available
if command -v supabase >/dev/null 2>&1; then
  supabase start
  supabase db reset --no-confirm
fi

echo "Environment setup complete."
