import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import NewCategory from './NewCategory';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

const insertCategory = vi.fn(() => ({ error: null }));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (table: string) => ({ insert: insertCategory }),
  },
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('NewCategory', () => {
  it('generates slug and submits', async () => {
    render(<NewCategory />);
    fireEvent.change(screen.getByLabelText('Title (PT)'), { target: { value: 'Tech News' } });
    expect(screen.getByLabelText('Slug')).toHaveValue('tech-news');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(insertCategory).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/categories');
  });
});
