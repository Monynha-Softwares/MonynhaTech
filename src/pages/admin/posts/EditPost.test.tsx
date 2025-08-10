import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import EditPost from './EditPost';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

vi.mock('@/hooks/useAuthors', () => ({ useAuthors: () => ({ data: [{ id: 'a1', name: 'Author' }] }) }));
vi.mock('@/hooks/useCategories', () => ({ useCategories: () => ({ data: [{ id: 'c1', title_pt: 'Cat' }] }) }));

const updateMock = vi.fn(() => ({ eq: () => Promise.resolve({ error: null }) }));
const deleteMock = vi.fn(() => ({ eq: () => Promise.resolve({}) }));
const deleteCats = vi.fn(() => ({ eq: () => Promise.resolve({}) }));
const insertCats = vi.fn().mockResolvedValue({});

const fromMock = (table: string) => {
  if (table === 'blog_posts') {
    return {
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: {
                id: '1',
                slug: 'old',
                title_pt: 'Old Title',
                title_en: null,
                content_pt: null,
                content_en: null,
                author_id: null,
                published: false,
                published_at: null,
                categories: [{ category_id: 'c1' }],
              },
              error: null,
            }),
        }),
      }),
      update: updateMock,
      delete: deleteMock,
    } as any;
  }
  if (table === 'blog_posts_categories') {
    return {
      delete: deleteCats,
      insert: insertCats,
    } as any;
  }
  return {} as any;
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => fromMock(...args),
    storage: { from: vi.fn(() => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) })) },
  },
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
  useParams: () => ({ id: '1' }),
}));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('EditPost', () => {
  it('loads and updates post', async () => {
    render(<EditPost />);
    const title = await screen.findByLabelText('Title (PT)');
    expect(title).toHaveValue('Old Title');
    fireEvent.change(title, { target: { value: 'New Title' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(updateMock).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/posts');
  });
});
