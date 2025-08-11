import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import NewProject from './NewProject';

vi.stubGlobal('ResizeObserver', class {
  observe() {}
  unobserve() {}
  disconnect() {}
});

const insertProject = vi.fn(() => ({ error: null }));
vi.mock('@supabaseClient/supabase/client', () => ({
  supabase: {
    from: (table: string) => ({ insert: insertProject }),
    storage: { from: () => ({ upload: vi.fn().mockResolvedValue({ data: {}, error: null }) }) },
  },
}));

const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({ useNavigate: () => navigateMock }));
vi.mock('@tanstack/react-query', async () => {
  const actual: any = await vi.importActual('@tanstack/react-query');
  return { ...actual, useQueryClient: () => ({ invalidateQueries: vi.fn() }) };
});

describe('NewProject', () => {
  it('generates slug and submits', async () => {
    render(<NewProject />);
    fireEvent.change(screen.getByLabelText('Name (PT)'), { target: { value: 'My Project' } });
    expect(screen.getByLabelText('Slug')).toHaveValue('my-project');
    fireEvent.click(screen.getByRole('button', { name: /save/i }));
    await waitFor(() => expect(insertProject).toHaveBeenCalled());
    expect(navigateMock).toHaveBeenCalledWith('/admin/projects');
  });
});
