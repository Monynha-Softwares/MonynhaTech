import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'pnpm dev',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
