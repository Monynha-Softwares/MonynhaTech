import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import NewProject from './NewProject';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

const insertProject = vi.fn(() => Promise.resolve({ error: null }));

let fromMock: any;

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: (...args: any[]) => fromMock(...args),
    storage: { from: vi.fn(() => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) })) },
  },
}));

fromMock = (table: string) => {
  if (table === 'projects') return { insert: insertProject } as any;
  return {} as any;
};

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('NewProject', () => {
  it('generates slug and submits', async () => {
    render(<NewProject />);
    fireEvent.change(screen.getByLabelText('Name (PT)'), { target: { value: 'Meu Projeto' } });
    expect(screen.getByLabelText('Slug')).toHaveValue('meu-projeto');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(insertProject).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/projects');
  });
});
