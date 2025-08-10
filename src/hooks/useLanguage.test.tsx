import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from './useLanguage';
import React from 'react';

function TestComponent() {
  const { language, setLanguage, t } = useLanguage();
  return (
    <div>
      <span>{t('Olá', 'Hello')}</span>
      <button onClick={() => setLanguage(language === 'pt' ? 'en' : 'pt')}>toggle</button>
    </div>
  );
}

describe('useLanguage', () => {
  it('switches language at runtime', () => {
    render(
      <LanguageProvider>
        <TestComponent />
      </LanguageProvider>
    );
    expect(screen.getByText('Olá')).toBeInTheDocument();
    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
