import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import EditCategory from './EditCategory';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

let fromMock: any;
const updateMock = vi.fn(() => ({ eq: () => Promise.resolve({ error: null }) }));
const deleteMock = vi.fn(() => ({ eq: () => Promise.resolve({}) }));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => fromMock(...args),
  },
}));

fromMock = (table: string) => {
  if (table === 'categories') {
    return {
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { id: '1', slug: 'old', title_pt: 'Old', title_en: null, description_pt: null, description_en: null }, error: null }) }) }),
      update: updateMock,
      delete: deleteMock,
    } as any;
  }
  return {} as any;
};

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock, useParams: () => ({ id: '1' }) }));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('EditCategory', () => {
  it('loads and updates category', async () => {
    render(<EditCategory />);
    const title = await screen.findByLabelText('Title (PT)');
    expect(title).toHaveValue('Old');
    fireEvent.change(title, { target: { value: 'New' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(updateMock).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/categories');
  });
});
