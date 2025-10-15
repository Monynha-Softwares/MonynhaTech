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
import { useProjects } from './useProjects';

function createWrapper() {
  const queryClient = new QueryClient();
  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns projects with normalized link data', async () => {
    const order = vi.fn().mockResolvedValue({
      data: [
        {
          id: 'project-1',
          slug: 'project-1',
          name_pt: 'Projeto 1',
          name_en: 'Project 1',
          description_pt: 'Descrição',
          description_en: null,
          icon: null,
          links: {
            github: 'https://github.com/monynha/project-1',
            demo: 'https://demo.monynha.tech',
            unsupported: 'https://example.com/extra',
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

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data?.[0].links).toEqual({
      github: 'https://github.com/monynha/project-1',
      demo: 'https://demo.monynha.tech',
    });
  });

  it('sends typed payloads when creating a project', async () => {
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

    const { result } = renderHook(() => useProjects(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.createProject({
        name_pt: 'Projeto 2',
        slug: 'project-2',
        links: {
          github: 'https://github.com/monynha/project-2',
        },
      });
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        name_pt: 'Projeto 2',
        slug: 'project-2',
        links: {
          github: 'https://github.com/monynha/project-2',
        },
      })
    );
  });
});
