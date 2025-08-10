import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { LanguageProvider } from '@/hooks/useLanguage';
import { Projects } from '../Projects';

const mockUseProjects = vi.fn();

vi.mock('@/hooks/useProjects', () => ({
  useProjects: () => mockUseProjects(),
}));

afterEach(() => {
  window.localStorage.clear();
  mockUseProjects.mockReset();
});

describe('Projects component', () => {
  it('navigates to /projects when clicked in Portuguese', async () => {
    mockUseProjects.mockReturnValue({ data: [], isLoading: false, error: null, refetch: vi.fn() });
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
    mockUseProjects.mockReturnValue({ data: [], isLoading: false, error: null, refetch: vi.fn() });
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

  it('renders stars and users when available', () => {
    mockUseProjects.mockReturnValue({
      data: [
        {
          id: 1,
          name_pt: 'Projeto',
          description_pt: 'desc',
          links: {},
          stars: 1500,
          users: 20,
        },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    window.localStorage.setItem('lang', 'pt');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Projects />
        </Router>
      </LanguageProvider>
    );
    const stats = screen.getByTestId('project-stats');
    expect(stats).toHaveTextContent('1500');
    expect(stats).toHaveTextContent('20');
  });

  it('handles missing numbers gracefully', () => {
    mockUseProjects.mockReturnValue({
      data: [
        {
          id: 1,
          name_pt: 'Projeto',
          description_pt: 'desc',
          links: {},
          stars: null,
          users: null,
        },
      ],
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    });
    window.localStorage.setItem('lang', 'pt');
    const history = createMemoryHistory({ initialEntries: ['/'] });
    render(
      <LanguageProvider>
        <Router location={history.location} navigator={history}>
          <Projects />
        </Router>
      </LanguageProvider>
    );
    const stats = screen.getByTestId('project-stats');
    expect(stats).toBeEmptyDOMElement();
  });
});
