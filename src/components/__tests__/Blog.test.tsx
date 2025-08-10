import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { LanguageProvider } from '@/hooks/useLanguage';
import { Blog } from '../Blog';

vi.mock('@/hooks/useBlogPosts', () => ({
  useBlogPosts: () => ({
    data: [
      {
        id: '1',
        slug: 'post-slug',
        title_pt: 'Post PT',
        title_en: 'Post EN',
        content_pt: 'Conteúdo',
        content_en: 'Content',
        author: { name: 'Author' },
        categories: [],
        published_at: '2024-01-01',
      },
    ],
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

afterEach(() => {
  window.localStorage.clear();
});

describe('Blog component', () => {
  it('navigates to /blog when clicked in Portuguese', async () => {
    window.localStorage.setItem('lang', 'pt');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Blog />
        </Router>
      </LanguageProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /ver todos os posts/i }));
    expect(history.location.pathname).toBe('/blog');
  });

  it('navigates to /blog when clicked in English', async () => {
    window.localStorage.setItem('lang', 'en');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Blog />
        </Router>
      </LanguageProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /view all posts/i }));
    expect(history.location.pathname).toBe('/blog');
  });

  it('navigates to post when clicking read more in Portuguese', async () => {
    window.localStorage.setItem('lang', 'pt');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Blog />
        </Router>
      </LanguageProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /ler mais/i }));
    expect(history.location.pathname).toBe('/blog/post-slug');
  });

  it('navigates to post when clicking read more in English', async () => {
    window.localStorage.setItem('lang', 'en');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Blog />
        </Router>
      </LanguageProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /read more/i }));
    expect(history.location.pathname).toBe('/blog/post-slug');
  });
});
