import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const { supabase } = await import('@/integrations/supabase/client');
import { useComments } from './useComments';

function createWrapper() {
  const queryClient = new QueryClient();
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

describe('useComments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('fetches approved comments', async () => {
    const comments = [
      {
        id: '1',
        post_id: '1',
        name: 'John',
        email: 'john@example.com',
        content: 'Hello',
        approved: true,
        created_at: '2023-01-01',
      },
    ];

    const order = vi.fn().mockResolvedValue({ data: comments, error: null });
    const match = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ match, order });
    (supabase.from as any).mockReturnValue({ select });

    const { result } = renderHook(() => useComments('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.comments).toEqual(comments);
    expect(supabase.from).toHaveBeenCalledWith('comments');
  });

  it('returns error when fetching fails', async () => {
    const order = vi.fn().mockResolvedValue({ data: null, error: { message: 'fail' } });
    const match = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ match, order });
    (supabase.from as any).mockReturnValue({ select });

    const { result } = renderHook(() => useComments('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.error).toBeDefined());
    expect(result.current.comments).toEqual([]);
  });

  it('adds a comment successfully', async () => {
    const order = vi.fn().mockResolvedValue({ data: [], error: null });
    const match = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ match, order });
    const insert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({ select, insert });

    const { result } = renderHook(() => useComments('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.mutate({
        postId: '1',
        name: 'Jane',
        email: 'jane@example.com',
        content: 'Hi',
      });
    });

    await waitFor(() => expect(insert).toHaveBeenCalled());
  });

  it('handles error when adding a comment fails', async () => {
    const order = vi.fn().mockResolvedValue({ data: [], error: null });
    const match = vi.fn().mockReturnValue({ order });
    const select = vi.fn().mockReturnValue({ match, order });
    const insert = vi.fn().mockResolvedValue({ error: { message: 'insert fail' } });
    (supabase.from as any).mockReturnValue({ select, insert });

    const { result } = renderHook(() => useComments('1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.mutate({
        postId: '1',
        name: 'Jane',
        email: 'jane@example.com',
        content: 'Hi',
      });
    });

    await waitFor(() => expect(result.current.error).toBeDefined());
  });
});

