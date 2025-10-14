import { render, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import BlogPost from './BlogPost'

const { mockMaybeSingle, mockFrom, mockUseSEO, mockGenerateSEOForBlogPost } = vi.hoisted(() => ({
  mockMaybeSingle: vi.fn(),
  mockFrom: vi.fn(),
  mockUseSEO: vi.fn(),
  mockGenerateSEOForBlogPost: vi.fn(() => ({})),
}))

vi.mock('@/components/Header', () => ({ Header: () => <div data-testid="header" /> }))
vi.mock('@/components/Footer', () => ({ Footer: () => <div data-testid="footer" /> }))
vi.mock('@/components/Comments', () => ({ Comments: () => <div data-testid="comments" /> }))
vi.mock('@/components/ui/loading-skeleton', () => ({ LoadingSkeleton: () => <div data-testid="loading" /> }))
vi.mock('@/components/ui/error-state', () => ({ ErrorState: ({ message }: { message: string }) => <div role="alert">{message}</div> }))
vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: ReactNode }) => <div data-testid="card">{children}</div>,
  CardContent: ({ children }: { children: ReactNode }) => <div data-testid="card-content">{children}</div>,
}))
vi.mock('@/components/ui/button', () => ({ Button: ({ children }: { children: ReactNode }) => <button>{children}</button> }))
vi.mock('@/hooks/useLanguage', () => ({
  useLanguage: () => ({
    language: 'pt',
    t: (pt: string) => pt,
  }),
}))

vi.mock('@/hooks/useSEO', () => ({
  useSEO: (props: unknown) => {
    mockUseSEO(props)
    return props
  },
  generateSEOForBlogPost: (...args: unknown[]) => mockGenerateSEOForBlogPost(...args),
}))

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockFrom,
  },
}))

describe('BlogPost sanitization', () => {
  beforeEach(() => {
    mockMaybeSingle.mockReset()
    mockFrom.mockReset()

    const queryBuilder: any = {}
    queryBuilder.select = vi.fn(() => queryBuilder)
    queryBuilder.eq = vi.fn(() => queryBuilder)
    queryBuilder.maybeSingle = mockMaybeSingle

    mockFrom.mockReturnValue(queryBuilder)
  })

  it('sanitizes blog post content before rendering', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: '1',
        slug: 'secure-post',
        title_pt: 'Secure Post',
        content_pt: "<p>Hello <strong>world</strong></p><script>alert('xss')</script>",
        content_en: null,
        author: { name: 'Author' },
      },
      error: null,
    })

    const { container } = render(
      <MemoryRouter initialEntries={['/blog/secure-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(mockMaybeSingle).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(container.querySelector('strong')).not.toBeNull()
    })

    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('strong')).not.toBeNull()
  })

  it('falls back to empty content when response is missing html', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: '2',
        slug: 'empty-post',
        title_pt: 'Empty Post',
        content_pt: null,
        content_en: null,
        author: { name: 'Author' },
      },
      error: null,
    })

    const { container } = render(
      <MemoryRouter initialEntries={['/blog/empty-post']}>
        <Routes>
          <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(mockMaybeSingle).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(container.querySelector('[data-testid="card-content"] div')).not.toBeNull()
    })

    const contentContainer = container.querySelector('[data-testid="card-content"] div') as HTMLElement
    expect(contentContainer.innerHTML).toBe('')
  })
})
