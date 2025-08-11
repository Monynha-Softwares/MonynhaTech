import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import NewAuthor from './NewAuthor';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

const insertAuthor = vi.fn(() => ({ error: null }));
vi.mock('@supabaseClient/supabase/client', () => ({
  supabase: {
    from: (table: string) => ({ insert: insertAuthor }),
    storage: { from: () => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) }) },
  },
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('NewAuthor', () => {
  it('submits form', async () => {
    render(<NewAuthor />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Author' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(insertAuthor).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/authors');
  });
});
