import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import NewAuthor from './NewAuthor';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

const insertAuthor = vi.fn(() => Promise.resolve({ error: null }));
let fromMock: any;

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => fromMock(...args),
    storage: { from: vi.fn(() => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) })) },
  },
}));

fromMock = (table: string) => {
  if (table === 'authors') return { insert: insertAuthor } as any;
  return {} as any;
};

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('NewAuthor', () => {
  it('submits', async () => {
    render(<NewAuthor />);
    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Alice' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(insertAuthor).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/authors');
  });
});
