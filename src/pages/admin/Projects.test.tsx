import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Projects from './Projects';

const { deleteProjectMock } = vi.hoisted(() => ({
  deleteProjectMock: vi.fn(),
}));

const { toastMock } = vi.hoisted(() => ({
  toastMock: vi.fn(),
}));

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({
    data: [
      {
        id: 'project-1',
        name_pt: 'Projeto',
        name_en: 'Project',
        description_pt: 'Descrição',
        description_en: 'Description',
        links: {},
        icon: null,
      },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    deleteProject: deleteProjectMock,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: (...args: unknown[]) => toastMock(...args),
}));

describe('Admin Projects page deletion', () => {
  let queryClient: QueryClient;
  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Projects />
        </MemoryRouter>
      </QueryClientProvider>
    );

  beforeEach(() => {
    queryClient = new QueryClient();
    deleteProjectMock.mockReset();
    deleteProjectMock.mockResolvedValue(undefined);
    toastMock.mockReset();
  });

  it('confirms deletion and calls deleteProject', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Projeto' });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete Projeto?');

    await waitFor(() => {
      expect(deleteProjectMock).toHaveBeenCalledWith('project-1');
      expect(toastMock).toHaveBeenCalledWith({ title: 'Project deleted' });
    });

    confirmSpy.mockRestore();
  });

  it('does not delete when confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Projeto' });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteProjectMock).not.toHaveBeenCalled();
    expect(toastMock).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('shows an error toast when deletion fails', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    deleteProjectMock.mockRejectedValueOnce(new Error('Deletion failed'));

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Projeto' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: 'Failed to delete project',
        variant: 'destructive',
      });
    });

    confirmSpy.mockRestore();
  });
});
