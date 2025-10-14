import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Categories from './Categories';

const { deleteCategoryMock } = vi.hoisted(() => ({
  deleteCategoryMock: vi.fn(),
}));

const { toastMock } = vi.hoisted(() => ({
  toastMock: vi.fn(),
}));

vi.mock('@/hooks/useCategories', () => ({
  useCategories: () => ({
    data: [
      {
        id: 'category-1',
        title_pt: 'Categoria',
        title_en: 'Category',
        description_pt: 'Descrição',
        description_en: 'Description',
        slug: 'categoria',
      },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
    deleteCategory: deleteCategoryMock,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: (...args: unknown[]) => toastMock(...args),
}));

describe('Admin Categories page deletion', () => {
  let queryClient: QueryClient;
  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Categories />
        </MemoryRouter>
      </QueryClientProvider>
    );

  beforeEach(() => {
    queryClient = new QueryClient();
    deleteCategoryMock.mockReset();
    deleteCategoryMock.mockResolvedValue(undefined);
    toastMock.mockReset();
  });

  it('confirms deletion and calls deleteCategory', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Categoria' });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalledWith('Are you sure you want to delete Categoria?');

    await waitFor(() => {
      expect(deleteCategoryMock).toHaveBeenCalledWith('category-1');
      expect(toastMock).toHaveBeenCalledWith({ title: 'Category deleted' });
    });

    confirmSpy.mockRestore();
  });

  it('does not delete when confirmation is cancelled', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);
    const user = userEvent.setup();

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Categoria' });
    await user.click(deleteButton);

    expect(confirmSpy).toHaveBeenCalled();
    expect(deleteCategoryMock).not.toHaveBeenCalled();
    expect(toastMock).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it('shows an error toast when deletion fails', async () => {
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const user = userEvent.setup();
    deleteCategoryMock.mockRejectedValueOnce(new Error('Deletion failed'));

    renderComponent();

    const deleteButton = screen.getByRole('button', { name: 'Delete Categoria' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: 'Failed to delete category',
        variant: 'destructive',
      });
    });

    confirmSpy.mockRestore();
  });
});
