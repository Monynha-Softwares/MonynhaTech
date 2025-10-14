import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Authors from './Authors';

const { deleteAuthorMock } = vi.hoisted(() => ({
  deleteAuthorMock: vi.fn(),
}));

const { toastMock } = vi.hoisted(() => ({
  toastMock: vi.fn(),
}));

vi.mock('@/hooks/useAuthors', () => ({
  useAuthors: () => ({
    data: [
      {
        id: 'author-1',
        name: 'Author One',
        bio: 'Bio',
        links: {},
      },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    deleteAuthor: deleteAuthorMock,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: (...args: unknown[]) => toastMock(...args),
}));

describe('Admin Authors page deletion', () => {
  let queryClient: QueryClient;
  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Authors />
        </MemoryRouter>
      </QueryClientProvider>
    );

  beforeEach(() => {
    queryClient = new QueryClient();
    deleteAuthorMock.mockReset();
    deleteAuthorMock.mockResolvedValue(undefined);
    toastMock.mockReset();
  });

  it('confirms deletion and calls deleteAuthor', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Author One' });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete Author One?');

    await waitFor(() => {
      expect(deleteAuthorMock).toHaveBeenCalledWith('author-1');
      expect(toastMock).toHaveBeenCalledWith({ title: 'Author deleted' });
    });

    confirmSpy.mockRestore();
  });

  it('does not delete when confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Author One' });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteAuthorMock).not.toHaveBeenCalled();
    expect(toastMock).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('shows an error toast when deletion fails', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    deleteAuthorMock.mockRejectedValueOnce(new Error('Deletion failed'));

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Author One' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: 'Failed to delete author',
        variant: 'destructive',
      });
    });

    confirmSpy.mockRestore();
  });
});
