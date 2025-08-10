import { render, screen } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import BlogPosts from './BlogPosts';

vi.mock('@/hooks/useAllBlogPosts', () => ({
  useAllBlogPosts: () => ({
    data: [
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
    ],
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

vi.mock('@/hooks/use-toast', () => ({ toast: vi.fn() }));

describe('Admin BlogPosts page', () => {
  it('renders published and draft badges', () => {
      render(
        <MemoryRouter>
          <BlogPosts />
        </MemoryRouter>
      );
      expect(screen.getByText('Published')).toBeInTheDocument();
      expect(screen.getByText('Draft')).toBeInTheDocument();
    });
  });
