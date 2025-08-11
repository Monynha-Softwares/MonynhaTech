import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BlogPosts from './BlogPosts';

const initialPosts = [
  {
    id: '1',
    author_id: 'a1',
    slug: 'post-1',
    title_pt: 'Post 1',
    title_en: 'Post 1 EN',
    content_pt: 'Conteúdo',
    content_en: 'Content',
    published: true,
    published_at: '2024-01-01',
    author: { id: 'a1', name: 'Author One' },
    categories: [],
  },
  {
    id: '2',
    author_id: 'a2',
    slug: 'post-2',
    title_pt: 'Draft Post',
    title_en: 'Draft Post EN',
    content_pt: 'Rascunho',
    content_en: 'Draft',
    published: false,
    published_at: null,
    author: { id: 'a2', name: 'Author Two' },
    categories: [],
  },
];

vi.mock('@/hooks/useAllBlogPosts', () => ({
  useAllBlogPosts: () => ({
    data: initialPosts,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/hooks/useAuthors', () => ({
  useAuthors: () => ({
    data: [
      { id: 'a1', name: 'Author One' },
      { id: 'a2', name: 'Author Two' },
    ],
  }),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({ data: [] }),
}));

const { fromMock, updateMock, eqMock } = vi.hoisted(() => {
  const eqMock = vi.fn().mockResolvedValue({ error: null });
  const updateMock = vi.fn(() => ({ eq: eqMock }));
  const fromMock = vi.fn(() => ({ update: updateMock }));
  return { fromMock, updateMock, eqMock };
});

vi.mock('@/integrations/supabase/client', () => ({
  supabase: { from: fromMock },
}));

vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }));

let queryClient: QueryClient;

beforeEach(() => {
  queryClient = new QueryClient();
});

describe('Admin BlogPosts page', () => {
  it('renders published and draft badges', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BlogPosts />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText('Published')).toBeInTheDocument();
    expect(screen.getByText('Draft')).toBeInTheDocument();
  });

  it('toggles published status', async () => {
    const user = userEvent.setup();
    const spy = vi.spyOn(queryClient, 'setQueryData');
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <BlogPosts />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const toggle = screen.getAllByRole('switch')[1];
    await user.click(toggle);

    expect(fromMock).toHaveBeenCalledWith('blog_posts');
    const updateArgs = updateMock.mock.calls[0][0];
    expect(updateArgs.published).toBe(true);
    expect(updateArgs.published_at).not.toBeNull();

    const updater = spy.mock.calls[0][1] as (old: typeof initialPosts) => typeof initialPosts;
    const result = updater(initialPosts);
    expect(result[1].published).toBe(true);
  });
});
