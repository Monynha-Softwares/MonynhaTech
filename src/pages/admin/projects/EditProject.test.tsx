import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import EditProject from './EditProject';

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
    storage: { from: vi.fn(() => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) })) },
  },
}));

fromMock = (table: string) => {
  if (table === 'projects') {
    return {
      select: () => ({ eq: () => ({ single: () => Promise.resolve({ data: { id: '1', slug: 'old', name_pt: 'Old', name_en: null, description_pt: null, description_en: null, links: null, icon: null }, error: null }) }) }),
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

describe('EditProject', () => {
  it('loads and updates project', async () => {
    render(<EditProject />);
    const name = await screen.findByLabelText('Name (PT)');
    expect(name).toHaveValue('Old');
    fireEvent.change(name, { target: { value: 'New' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(updateMock).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/projects');
  });
});
