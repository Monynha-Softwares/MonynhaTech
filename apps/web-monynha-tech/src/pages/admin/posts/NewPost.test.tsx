import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});
import NewPost from './NewPost';

vi.mock('@/hooks/useAuthors', () => ({ useAuthors: () => ({ data: [{ id: 'a1', name: 'Author' }] }) }));
vi.mock('@/hooks/useCategories', () => ({ useCategories: () => ({ data: [{ id: 'c1', title_pt: 'Cat' }] }) }));

const insertPost = vi.fn(() => ({
  select: () => ({ single: () => Promise.resolve({ data: { id: '1' }, error: null }) }),
}));
const insertCategories = vi.fn(() => Promise.resolve({ data: null, error: null }));
const fromMock = (table: string) => {
  if (table === 'blog_posts') return { insert: insertPost };
  if (table === 'blog_posts_categories') return { insert: insertCategories };
  return {} as any;
};

vi.mock('@supabaseClient/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => fromMock(...args),
    storage: { from: vi.fn(() => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) })) },
  },
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('NewPost', () => {
  it('generates slug and submits', async () => {
    render(<NewPost />);
    fireEvent.change(screen.getByLabelText('Title (PT)'), { target: { value: 'Hello World' } });
    expect(screen.getByLabelText('Slug')).toHaveValue('hello-world');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(insertPost).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/posts');
  });
});
