import { describe, it, expect } from 'vitest';
import { slugify } from './slugify';

describe('slugify', () => {
  it('normalizes and removes accents', () => {
    expect(slugify('Olá Mundo')).toBe('ola-mundo');
  });

  it('trims and replaces spaces with hyphens', () => {
    expect(slugify('  Clean   slug  ')).toBe('clean-slug');
  });

  it('removes special characters', () => {
    expect(slugify('Árvores & Flores!')).toBe('arvores-flores');
  });

  it('collapses multiple and trims leading/trailing hyphens', () => {
    expect(slugify('--Hello  --  World--')).toBe('hello-world');
  });
});
