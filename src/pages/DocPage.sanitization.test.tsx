import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import DocPage from './DocPage'

const { mockMaybeSingle, mockFrom, mockUseSEO } = vi.hoisted(() => ({
  mockMaybeSingle: vi.fn(),
  mockFrom: vi.fn(),
  mockUseSEO: vi.fn(),
}))

vi.mock('@/components/Header', () => ({ Header: () => <div data-testid="header" /> }))
vi.mock('@/components/Footer', () => ({ Footer: () => <div data-testid="footer" /> }))
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
}))

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: mockFrom,
  },
}))

describe('DocPage sanitization', () => {
  beforeEach(() => {
    mockMaybeSingle.mockReset()
    mockFrom.mockReset()

    const queryBuilder: any = {}
    queryBuilder.select = vi.fn(() => queryBuilder)
    queryBuilder.eq = vi.fn(() => queryBuilder)
    queryBuilder.maybeSingle = mockMaybeSingle

    mockFrom.mockReturnValue(queryBuilder)
  })

  it('sanitizes documentation content before rendering', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: 'doc-1',
        slug: 'secure-doc',
        title_pt: 'Secure Doc',
        content_pt: "<p>Safe <em>content</em></p><script>alert('hack')</script>",
        content_en: null,
      },
      error: null,
    })

    const { container } = render(
      <MemoryRouter initialEntries={['/docs/secure-doc']}>
        <Routes>
          <Route path="/docs/:slug" element={<DocPage />} />
        </Routes>
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(mockMaybeSingle).toHaveBeenCalled()
    })

    await waitFor(() => {
      expect(container.querySelector('em')).not.toBeNull()
    })

    expect(container.querySelector('script')).toBeNull()
    expect(container.querySelector('em')).not.toBeNull()
  })

  it('renders empty content safely when html is missing', async () => {
    mockMaybeSingle.mockResolvedValue({
      data: {
        id: 'doc-2',
        slug: 'empty-doc',
        title_pt: 'Empty Doc',
        content_pt: '',
        content_en: '',
      },
      error: null,
    })

    const { container } = render(
      <MemoryRouter initialEntries={['/docs/empty-doc']}>
        <Routes>
          <Route path="/docs/:slug" element={<DocPage />} />
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
