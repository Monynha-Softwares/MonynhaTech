import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { LanguageProvider } from '@/hooks/useLanguage';
import { Projects } from '../Projects';

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => ({ data: [], isLoading: false, error: null, refetch: vi.fn() }),
}));

afterEach(() => {
  window.localStorage.clear();
});

describe('Projects component', () => {
  it('navigates to /projects when clicked in Portuguese', async () => {
    window.localStorage.setItem('lang', 'pt');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Projects />
        </Router>
      </LanguageProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /ver todos os projetos/i }));
    expect(history.location.pathname).toBe('/projects');
  });

  it('navigates to /projects when clicked in English', async () => {
    window.localStorage.setItem('lang', 'en');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Projects />
        </Router>
      </LanguageProvider>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /view all projects/i }));
    expect(history.location.pathname).toBe('/projects');
  });
});
