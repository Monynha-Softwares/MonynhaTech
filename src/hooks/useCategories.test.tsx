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
import { useCategories } from './useCategories';

function createWrapper() {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns typed category data', async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'category-1',
          title_pt: 'Categoria',
          title_en: 'Category',
          description_pt: 'Descrição',
          description_en: null,
          slug: 'categoria',
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

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual([
      expect.objectContaining({
        slug: 'categoria',
        title_pt: 'Categoria',
      }),
    ]);
  });

  it('sends typed payloads when creating a category', async () => {
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

    const { result } = renderHook(() => useCategories(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.createCategory({
        slug: 'nova-categoria',
        title_pt: 'Nova categoria',
        title_en: null,
        description_pt: null,
        description_en: null,
      });
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: 'nova-categoria',
        title_pt: 'Nova categoria',
      })
    );
  });
});
