import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LanguageProvider } from '@/hooks/useLanguage';
import { Comments } from '../Comments';

const addComment = vi.fn((_vars, opts?: any) => {
  opts?.onSuccess?.();
});

vi.mock('@/hooks/useComments', () => ({
  useComments: () => ({
    comments: [],
    isLoading: false,
    error: null,
    mutate: addComment,
  }),
}));

const toastMock = vi.fn();
vi.mock('@/components/ui/use-toast', () => ({
  toast: (args: any) => toastMock(args),
}));

beforeEach(() => {
  window.localStorage.setItem('lang', 'pt');
  addComment.mockClear();
  toastMock.mockClear();
});

describe('Comments component', () => {
  it('submits a comment', async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Comments postId="1" />
      </LanguageProvider>
    );

    await user.type(screen.getByPlaceholderText(/seu nome/i), 'John');
    await user.type(screen.getByPlaceholderText(/seu email/i), 'john@example.com');
    await user.type(screen.getByPlaceholderText(/seu comentário/i), 'Olá');
    await user.click(screen.getByRole('button', { name: /enviar/i }));

    expect(addComment).toHaveBeenCalledWith(
      {
        postId: '1',
        name: 'John',
        email: 'john@example.com',
        content: 'Olá',
      },
      expect.any(Object)
    );
    expect(screen.getByPlaceholderText(/seu nome/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/seu email/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/seu comentário/i)).toHaveValue('');
    expect(toastMock).toHaveBeenCalled();
  });
});
