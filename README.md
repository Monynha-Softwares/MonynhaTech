# Monynha Nexus Lab

Development setup and contribution guide for the Monynha Nexus Lab project.

## Requirements
- Node.js 20
- [pnpm](https://pnpm.io/)

## Quick start
```bash
# install dependencies
pnpm install

# start development server
pnpm dev
```

## Environment variables

Create a `.env.local` file based on `.env.example` and configure the Supabase client credentials expected by Vite:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

These variables are required both at runtime and during tests.

## Local CI checks
Run the same commands used in the GitHub Actions workflow:

```bash
./ci_test_local.sh
```

The script installs Playwright browsers, runs linting, type checking, and all unit, component, and E2E tests. Use it before pushing changes to ensure the pipeline will pass.
