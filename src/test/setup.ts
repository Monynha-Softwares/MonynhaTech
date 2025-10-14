import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.stubEnv('VITE_SUPABASE_URL', process.env.VITE_SUPABASE_URL ?? 'https://fineleshydmsyjcvffye.supabase.co');
vi.stubEnv('VITE_SUPABASE_ANON_KEY', process.env.VITE_SUPABASE_ANON_KEY ?? 'test-anon-key');
