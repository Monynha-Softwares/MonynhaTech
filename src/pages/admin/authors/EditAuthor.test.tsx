import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import EditAuthor from './EditAuthor';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

const updateMock = vi.fn(() => ({ eq: () => Promise.resolve({ error: null }) }));
const deleteMock = vi.fn(() => ({ eq: () => Promise.resolve({}) }));
const fromMock = (table: string) => {
  if (table === 'authors') {
    return {
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { id: '1', name: 'Old', bio: null, links: null, photo_url: null }, error: null }) }) }),
      update: updateMock,
      delete: deleteMock,
    } as any;
  }
  return {} as any;
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => fromMock(...args),
    storage: { from: () => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) }) },
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

describe('EditAuthor', () => {
  it('loads and updates author', async () => {
    render(<EditAuthor />);
    const name = await screen.findByLabelText('Name');
    expect(name).toHaveValue('Old');
    fireEvent.change(name, { target: { value: 'New' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(updateMock).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/authors');
  });
});
