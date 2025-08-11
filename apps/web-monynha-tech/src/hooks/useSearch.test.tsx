import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

const { supabase } = await import('@/integrations/supabase/client');
import { useSearch } from './useSearch';

describe('useSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns ranked results limited to 10', async () => {
    const blogPosts = Array.from({ length: 6 }, (_, i) => ({
      id: `bp-${i}`,
      title_pt: `Post ${i}`,
      content_pt: '',
      slug: `bp-${i}`,
      published_at: null,
      score: 1 - i * 0.1,
    }));

    const projects = Array.from({ length: 6 }, (_, i) => ({
      id: `pr-${i}`,
      name_pt: `Project ${i}`,
      description_pt: '',
      slug: `pr-${i}`,
      score: 0.9 - i * 0.1,
    }));

    const dataMap: Record<string, any[]> = {
      blog_posts: blogPosts,
      projects,
      docs: [],
    };

    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        textSearch: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: dataMap[table], error: null }),
      };
      return chain;
    });

    const { result } = renderHook(() => useSearch());

    await act(async () => {
      await result.current.search('query');
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.results).toHaveLength(10);
    const scores = result.current.results.map(r => r.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(scores).not.toContain(0.4);
  });
});
