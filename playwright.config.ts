import { defineConfig } from '@playwright/test';

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://fineleshydmsyjcvffye.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? 'test-anon-key';

process.env.VITE_SUPABASE_URL = supabaseUrl;
process.env.VITE_SUPABASE_ANON_KEY = supabaseAnonKey;

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:8080',
  },
  webServer: {
    command: 'pnpm dev',
    port: 8080,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_SUPABASE_URL: supabaseUrl,
      VITE_SUPABASE_ANON_KEY: supabaseAnonKey,
    },
  },
});
