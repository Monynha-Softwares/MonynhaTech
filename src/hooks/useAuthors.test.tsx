import type { ReactNode } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const { supabase } = await import('@/integrations/supabase/client');
import { useAuthors } from './useAuthors';

function createWrapper() {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useAuthors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns authors with normalized link data', async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'author-1',
          name: 'Author One',
          bio: 'Author bio',
          photo_url: null,
          links: {
            website: 'https://monynha.tech',
            linkedin: 'https://linkedin.com/company/monynha',
            invalid: 42,
          },
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-02T00:00:00.000Z',
        },
      ],
      error: null,
    });
    const select = vi.fn().mockReturnValue({ order });
    const insert = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    const remove = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

    (supabase.from as unknown as Mock).mockReturnValue({
      select,
      insert,
      update,
      delete: remove,
    });

    const { result } = renderHook(() => useAuthors(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.[0].links).toEqual({
      website: 'https://monynha.tech',
      linkedin: 'https://linkedin.com/company/monynha',
    });
  });

  it('sends typed payloads when creating an author', async () => {
    const order = vi.fn().mockResolvedValue({ data: [], error: null });
    const select = vi.fn().mockReturnValue({ order });
    const insert = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
    const remove = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

    (supabase.from as unknown as Mock).mockReturnValue({
      select,
      insert,
      update,
      delete: remove,
    });

    const { result } = renderHook(() => useAuthors(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.createAuthor({
        name: 'Author Two',
        bio: null,
        photo_url: null,
        links: {
          twitter: 'https://twitter.com/monynha',
        },
      });
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Author Two',
        links: {
          twitter: 'https://twitter.com/monynha',
        },
      })
    );
  });
});
