import { describe, it, expect, vi, afterAll, beforeAll } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider, useLanguage } from '@/hooks/useLanguage';
import { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import ServerError from './ServerError';

const Boom = () => {
  throw new Error('boom');
};

const LanguageSetter = ({ lang }: { lang: 'pt' | 'en' }) => {
  const { setLanguage } = useLanguage();
  useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);
  return null;
};

const renderWithLang = (lang: 'pt' | 'en') => {
  render(
    <LanguageProvider>
      <LanguageSetter lang={lang} />
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route
            path="/"
            element={
              <ErrorBoundary>
                <Boom />
              </ErrorBoundary>
            }
          />
          <Route path="/500" element={<ServerError />} />
        </Routes>
      </MemoryRouter>
    </LanguageProvider>
  );
};

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  (console.error as any).mockRestore();
});

describe('ErrorBoundary', () => {
  it('shows Portuguese fallback', async () => {
    renderWithLang('pt');
    await waitFor(() => {
      expect(
        screen.getByText('Erro interno do servidor')
      ).toBeInTheDocument();
    });
  });

  it('shows English fallback', async () => {
    renderWithLang('en');
    await waitFor(() => {
      expect(
        screen.getByText('Internal server error')
      ).toBeInTheDocument();
    });
  });
});
